import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { FFT } from 'tone';
import useAnimationFrame from 'use-animation-frame';
import {border, color, shadow} from '../styles';

const Container = styled.div`
  width: 4rem;
  display: flex;
  height: 100%;
  align-items: flex-end;
`

type Props = {
  fft: FFT
}

const Meter = ({ fft, ...props }: Props) => {
  const [values, setValues] = useState<number[]>();

  useAnimationFrame((e: any) => {
    if (fft) {
      const values = Array.from(fft.getValue()).filter((x, i) => i % 64 === 0);
      setValues(values);
    }
  }, [fft]);

  return (
    <Container>
      {
        values?.map((x, i) => <div key={i} style={{
          display: 'flex',
          flex: 1,
          backgroundColor: color.label,
          height: (Math.pow(x, 0.2) * 100).toFixed(2) + '%'
        }} />)
      }
    </Container>
  );
};

export default React.memo(Meter);