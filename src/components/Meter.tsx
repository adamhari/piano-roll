import React, { useState } from "react";
import { Meter } from "tone";
import styled from "styled-components";
import useAnimationFrame from "use-animation-frame";
import { border, color } from "../styles";
import { rgba } from "polished";
import { ControlContainer } from "./controls";

const C_LENGTH = 7.75;
const C_THICKNESS = 1.25;
const C_PADDING = 0.125;
const STEPS = 60;
const STEP_GAP = 0.0625;

const Container = styled.div`
  width: ${`${C_THICKNESS}rem`};
  height: ${`${C_LENGTH}rem`};
  display: flex;
  flex-flow: column-reverse nowrap;
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
  height: ${`${((C_LENGTH - C_PADDING * 2) / STEPS) - STEP_GAP / 2}rem`};
  background-color: ${color.meterLight};
  box-shadow: ${({ index }) =>
    `0 0 0.25rem 0.015625rem ${rgba(
      color.meterLight,
      0.75
    )}`};
  border-top-left-radius: ${({ index }) =>
    index === 0 ? "0.0625rem" : "0"};
  border-bottom-left-radius: ${({ index }) =>
    index === 0 ? "0.0625rem" : "0"};
  border-top-right-radius: ${({ index }) =>
    index === STEPS - 1 ? "0.0625rem" : "0"};
  border-bottom-right-radius: ${({ index }) =>
    index === STEPS - 1 ? "0.0625rem" : "0"};
`;

type Props = {
  meter: Meter;
};

const MeterComponent = ({ meter, ...props }: Props) => {
  const [value, setValue] = useState<number>();

  useAnimationFrame(() => {
    if (meter) {
      const value = meter.getValue();
      setValue(
        Math.min(
          STEPS,
          Math.round(((value > 1 ? 1 : value) as number) * STEPS * 4)
        )
      );
    }
  }, [meter]);

  return (
    <ControlContainer>
      <Container>
        {new Array(value).fill(null).map((x, i) => (
          <Step index={i} />
        ))}
      </Container>
    </ControlContainer>
  );
};

export default React.memo(MeterComponent);
