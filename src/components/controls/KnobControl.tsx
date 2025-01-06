import React, {MouseEvent} from 'react';
import styled, {css} from 'styled-components';
import {CONTROL_TYPES, CONTROLS} from '../../js/statics';
import {Size, ControlMouseEvents} from '../../types';
import {ControlLabel, ControlContainer} from '.';
import {shadow, color, pseudoElement} from '../../styles';

type ContainerProps = {
	size: Size;
};

const Container = styled(ControlContainer)<ContainerProps>`
	position: relative;
	display: flex;
	flex-flow: column nowrap;
	justify-content: flex-start;
	align-items: center;
	width: ${({size}) => {
		switch (size) {
			case 'small':
				return '3rem';
			default:
				return undefined;
		}
	}};
`;

type KnobContainerProps = {
	size: Size;
};

const KnobContainer = styled.div<KnobContainerProps>`
	border-radius: 50%;
	box-shadow: ${shadow.knobOutset};

	width: ${({size}) => {
		switch (size) {
			case 'small':
				return '2rem';
			case 'medium':
				return '3rem';
			case 'large':
				return '4rem';
		}
	}};
	height: ${({size}) => {
		switch (size) {
			case 'small':
				return '2rem';
			case 'medium':
				return '3rem';
			case 'large':
				return '4rem';
		}
	}};
`;

type KnobProps = {
	size: Size;
	value: number;
	min: number;
	max: number;
};

const Knob = styled.div<KnobProps>`
  cursor: grab;
  position: relative;
  background-color: ${color.knobRubber};
  border-radius: 50%;
  box-shadow: ${shadow.knobInset};
  width: ${({ size }) => {
    switch (size) {
      case "small":
        return "2rem";
      case "medium":
        return "3rem";
      case "large":
        return "4rem";
    }
  }};
  height: ${({ size }) => {
    switch (size) {
      case "small":
        return "2rem";
      case "medium":
        return "3rem";
      case "large":
        return "4rem";
    }
  }};
  transform: ${({ value, min, max }) => {
    const valueAsPercent = ((value - min) * 100) / (max - min);
    const valueAsDeg = valueAsPercent * 3.6;
    const valueForRotate = (valueAsDeg + 180) * 0.875 + 45;
    return css`rotate(${valueForRotate}deg)`;
  }};

  &:before {
    ${pseudoElement};
    box-sizing: border-box;
    background-color: ${color.knobMetal};
    box-shadow: ${shadow.knobDialOutset}, ${shadow.knobDialInset};
    transform: translateY(-50%);
    border-radius: 50%;
    position: relative;
    top: 50%;
    margin: auto;
    border-style: solid;
    border-color: ${color.knobDial};
    width: ${({ size }) => {
      switch (size) {
        case "small":
          return "1.25rem";
        case "medium":
          return "2rem";
        case "large":
          return "3rem";
      }
    }};
    height: ${({ size }) => {
      switch (size) {
        case "small":
          return "1.25rem";
        case "medium":
          return "2rem";
        case "large":
          return "3rem";
      }
    }};
    border-width: ${({ size }) => {
      switch (size) {
        case "small":
          return "0.1667rem";
        case "medium":
          return "0.1875rem";
        case "large":
          return "0.1875rem";
      }
    }};
  }

  &:after {
    ${pseudoElement};
    background-color: ${color.knobDial};
    border-top-left-radius: 0.075rem;
    border-top-right-radius: 0.075rem;
    border-bottom-left-radius: 0.125rem;
    border-bottom-right-radius: 0.125rem;
    margin: auto;
    transform: translateX(-50%);
    left: 50%;
    width: ${({ size }) => {
      switch (size) {
        case "small":
          return "0.1875rem";
        case "medium":
          return "0.25rem";
        case "large":
          return "0.375rem";
      }
    }};
    height: ${({ size }) => {
      switch (size) {
        case "small":
          return "0.625rem";
        case "medium":
          return "0.5rem";
        case "large":
          return "0.15625rem";
      }
    }};
    top: ${({ size }) => {
      switch (size) {
        case "small":
          return "0.4375rem";
        case "medium":
          return "0.5rem";
        case "large":
          return "0.65625rem";
      }
    }};

    border-bottom-left-radius: ${({ size }) => {
      switch (size) {
        case "small":
          return undefined;
        case "medium":
          return "37.5% 100%";
        case "large":
          return "0.0625rem";
      }
    }};
    border-bottom-right-radius: ${({ size }) => {
      switch (size) {
        case "small":
          return undefined;
        case "medium":
          return "37.5% 100%";
        case "large":
          return "0.0625rem";
      }
    }};
    border-top-left-radius: ${({ size }) => {
      switch (size) {
        case "small":
          return undefined;
        case "medium":
          return undefined;
        case "large":
          return "0.05rem";
      }
    }};
    border-top-right-radius: ${({ size }) => {
      switch (size) {
        case "small":
          return undefined;
        case "medium":
          return undefined;
        case "large":
          return "0.05rem";
      }
    }};
  }
`;

type ValueTooltipProps = {
	visible: boolean;
};

const ValueTooltip = styled.div<ValueTooltipProps>`
	width: 100%;
	margin: 0.3125rem auto 0;
	padding: 0 0 0.0625rem;
	background-color: ${color.tooltipBackground};
	border-radius: 1rem;

	text-align: center;
	font-size: 0.5625rem;
	font-weight: 800;

	transition: 0.1s all ease-out;
	opacity: ${({visible}) => (visible ? 1 : 0)};
`;

export type Props = ControlMouseEvents & {
	activeControl: string;
	name: string;
	label?: string;
	size: Size;
	value: number;
};

export default ({
	activeControl,
	handleMouseDownControl,
	handleMouseUpControl,
	handleMouseWheelControl,
	name,
	label,
	size,
	value,
}: Props) => {
	const {
		range: {min, max},
	} = CONTROLS[name];

	const handleMouseDown = (e: MouseEvent<HTMLDivElement>) =>
		handleMouseDownControl(name, CONTROL_TYPES.knob.name, e);

	const handleMouseUp = (e: MouseEvent<HTMLDivElement>) =>
		handleMouseUpControl(name, CONTROL_TYPES.knob.name, e);

	const handleMouseWheel = (e: MouseEvent<HTMLDivElement>) =>
		handleMouseWheelControl(name, CONTROL_TYPES.knob.name, e);

	return (
		<Container size={size}>
			<ControlLabel>{label || name}</ControlLabel>
			<KnobContainer size={size}>
				<Knob
					size={size}
					value={value}
					min={min}
					max={max}
					onMouseDown={handleMouseDown}
					onMouseUp={handleMouseUp}
					onWheel={handleMouseWheel}
				/>
				<ValueTooltip visible={activeControl === name}>{value}</ValueTooltip>
			</KnobContainer>
		</Container>
	);
};
