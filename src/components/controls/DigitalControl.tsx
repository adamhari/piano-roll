import React, { CSSProperties, MouseEvent, useMemo } from "react";
import styled from "styled-components/macro";
import { CONTROL_TYPES, CONTROLS } from "../../js/statics";
import { ControlMouseEvents, DigitType } from "../../types";
import { ControlContainer, ControlLabel } from ".";
import {
  border,
  color,
  font,
  labelText,
} from "../../styles";
import { rgba } from "polished";

type ContainerProps = {};

const Container = styled(ControlContainer)<ContainerProps>`
  position: relative;
  display: flex;
  align-content: center;
  flex-flow: column wrap;

  text-align: center;
  border-radius: 0.1875rem;
  margin-bottom: 0;

  user-select: none;
`;

type DigitalControlInputProps = {
  digitType: DigitType;
};

const DigitalControlInput = styled.div<DigitalControlInputProps>`
  position: relative;
  font-family: ${font.digital};
  font-size: 2rem;
  color: transparent;
  width: ${({ digitType }) =>
    digitType === "single-digit" ? "2.75rem" : "3.375rem"};
  padding: ${({ digitType }) =>
    digitType === "single-digit"
      ? "0.375rem 0rem 0.375rem 0.6875rem"
      : "0.375rem 0rem 0.375rem 0.25rem"};
  background-color: ${color.digitalBackground};
  border-left: ${border.digitalDisplayVertical};
  border-right: ${border.digitalDisplayVertical};
  border-top: ${border.digitalDisplayHorizontal};
  border-bottom: ${border.digitalDisplayHorizontal};
  margin: 0 auto;
`;

type DigitalControlInputTextProps = {
  value: number;
  digitType: DigitType;
};

const DigitalControlInputText = styled.div<DigitalControlInputTextProps>`
  position: absolute;
  top: -0.1rem;
  left: -0.53125rem;
  background: none;
  border-color: transparent;
  width: ${({ digitType }) =>
    digitType === "single-digit" ? "2.75rem" : "3.375rem"};
  padding: ${({ digitType }) =>
    digitType === "single-digit"
      ? "0.5rem 0rem 0.375rem 0.6875rem"
      : "0.5rem 0rem 0.375rem 0.25rem"};
`;

const DigitalControlInputBackgroundText = styled(DigitalControlInputText)`
  color: ${rgba(color.digitalText, 0.625)};
  opacity: 0.1875;
  text-shadow: 0.03125rem 0.03125rem 0rem
    ${rgba(color.digitalTextBackground, 0.5)};
`;

const DigitalControlInputForegroundText = styled(DigitalControlInputText)`
  color: ${rgba(color.digitalText, 0.9375)};
  text-shadow: 0 0 0.625rem ${rgba(color.digitalText, 0.625)},
    0 0 0.375rem ${rgba(color.digitalText, 0.375)},
    0 0 0.125rem ${rgba(color.digitalText, 0.25)};

  &:hover {
    cursor: grab;
  }
`;

const digitTypes = {
  "single-digit": {
    backgroundText: 8,
    foregroundTextStyle: (val: number) => {
      const styles: CSSProperties = {};
      if (val === 1) styles.left = "-0.25rem";
      return styles;
    },
  },
  "single-digit-negative": {
    backgroundText: -8,
    foregroundTextStyle: (val: number) => {
      const styles: CSSProperties = {};
      if (val > 1 || val === 0) styles.left = "-0.0625rem";
      if (val === 1) styles.left = "0.245rem";
      if (val === -1) {
        styles.left = "-0.225rem";
        styles.letterSpacing = "0.5375rem";
      }
      return styles;
    },
  },
  "double-digit": {
    backgroundText: 88,
    foregroundTextStyle: (val: number) => {
      const styles: CSSProperties = {};
      return styles;
    },
  },
  "double-digit-negative": {
    backgroundText: -88,
    foregroundTextStyle: (val: number) => {
      const styles: CSSProperties = {};
      return styles;
    },
  },
};

type Props = ControlMouseEvents & {
  name: string;
  label?: string;
  value: number;
};

const DigitalControl = ({
  handleMouseDownControl,
  handleMouseUpControl,
  handleMouseWheelControl,
  name,
  label,
  value,
}: Props) => {
  const {
    range: { min, max },
  } = CONTROLS[name];

  const getDigitType = (min: number, max: number): DigitType => {
    if (min > -1 && max < 10) return "single-digit";
    if (min <= -1 && max < 10) return "single-digit-negative";
    if (min > -1 && max >= 10) return "double-digit";
    return "double-digit-negative";
  };

  const digitType = useMemo(() => getDigitType(min, max), [min, max]);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) =>
    handleMouseDownControl(name, CONTROL_TYPES.digital.name, e);

  const handleMouseUp = (e: MouseEvent<HTMLDivElement>) =>
    handleMouseUpControl(name, CONTROL_TYPES.digital.name, e);

  const handleMouseWheel = (e: MouseEvent<HTMLDivElement>) =>
    handleMouseWheelControl(name, CONTROL_TYPES.digital.name, e);

  return (
    <Container>
      <ControlLabel>{label || name}</ControlLabel>
        <DigitalControlInput digitType={digitType}>
          8
          <DigitalControlInputBackgroundText
            digitType={digitType}
            value={value}
          >
            {digitTypes[digitType].backgroundText}
          </DigitalControlInputBackgroundText>
          <DigitalControlInputForegroundText
            value={value}
            digitType={digitType}
            children={Number.isInteger(value) ? value : "-"}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onWheel={handleMouseWheel}
            style={digitTypes[digitType].foregroundTextStyle(value)}
          />
        </DigitalControlInput>
    </Container>
  );
};

export default DigitalControl;
