import React, { useState } from 'react';
import { Meter } from 'tone';
import styled from 'styled-components';
import useAnimationFrame from 'use-animation-frame';
import { border, color } from '../styles';
import { rgba } from 'polished';

const C_WIDTH = 4;
const C_PADDING = 0.125;
const STEPS = 24;
const STEP_GAP = 0.0625;

const Container = styled.div`
  height: 0.75rem;
  width: ${`${C_WIDTH}rem`};
  display: flex;
  gap: ${`${STEP_GAP}rem`};
  background-color: ${color.digitalBackground};
  padding: ${`${C_PADDING}rem`};
  border-top: ${border.digitalDisplayHorizontal};
  border-bottom: ${border.digitalDisplayHorizontal};
  border-left: ${border.digitalDisplayVertical};
  border-right: ${border.digitalDisplayVertical};
  overflow-x: hidden;
  /* border-radius: 0.25rem; */
`;

const Step = styled.div<{ index: number }>`
  width: ${`${(C_WIDTH - C_PADDING * 2) / STEPS - STEP_GAP}rem`};
  height: 100%;
  background-color: ${color.meterLight};
  box-shadow: ${({ index }) =>
    `0 0 1rem 0.125rem ${rgba(color.meterLight, 0.375 + index * 0.015625)}, 0 0 0.25rem 0.0625rem ${rgba(
      color.meterLight,
      0.375 + index * 0.015625
    )}`};
  /* border-top-left-radius: ${({ index }) => (index === 0 ? '0.0625rem' : '0')}; */
  /* border-bottom-left-radius: ${({ index }) => (index === 0 ? '0.0625rem' : '0')}; */
  /* border-top-right-radius: ${({ index }) => (index === STEPS - 1 ? '0.0625rem' : '0')}; */
  /* border-bottom-right-radius: ${({ index }) => (index === STEPS - 1 ? '0.0625rem' : '0')}; */
`;



type Props = {
  meter: Meter
}

const MeterComponent = ({ meter, ...props }: Props) => {
  const [value, setValue] = useState<number>();

  useAnimationFrame(() => {
    if (meter) {
      const value = meter.getValue();
      setValue(Math.min(STEPS, Math.round((value > 1 ? 1 : value) as number * STEPS * 4)));
    }
  }, [meter]);

  return (
    <Container>
      {
        new Array(value).fill(null).map((x, i) => <Step index={i} />)
      }
    </Container>
  );
};

export default React.memo(MeterComponent);