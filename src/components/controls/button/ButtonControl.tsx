import React, {MouseEvent, ReactNode} from 'react';
import styled from 'styled-components';
import ButtonLight from './ButtonLight';
import {ButtonMouseEvents, Size} from '../../../types';
import {ControlContainer, ControlLabel} from '..';
import {color, border, shadow} from '../../../styles';

const ButtonContainer = styled.div`
	display: flex;
	justify-content: center;
`;

type ButtonProps = {
	active?: boolean;
	size: Size;
	onClick?: (e: any) => void;
};

const Button = styled.div<ButtonProps>`
	width: ${({size}) => (size === 'large' ? '4.5rem' : '3rem')};
	height: 3rem;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	background: ${({active}) => (active ? color.buttonBackgroundActive : color.buttonBackground)};
	border: ${border.button};
	border-radius: 0.25rem;
	box-shadow: ${shadow.buttonOutset};
	transition: 0.15s all ease-out;
	cursor: pointer;

	&:active {
		background: ${color.buttonBackgroundActive};
		transform: scale(0.984375);
	}
`;

type Props = ButtonProps &
	ButtonMouseEvents & {
		children?: React.ReactNode;
		label?: string;
		light?: boolean;
		name: string;
		renderButtonLight?: () => ReactNode;
		value: number | string;
	};

const ButtonControl = ({
	active,
	children,
	handleClickControl,
	label,
	light,
	name,
	onClick,
	renderButtonLight,
	size,
	value,
}: Props) => {
	const handleClick = (e: MouseEvent) => handleClickControl(name, value);

	const renderLight = () => light && <ButtonLight active={active || false} size={size} />;

	return (
		<ControlContainer>
			<ControlLabel>{label || value}</ControlLabel>
			<ButtonContainer>
				<Button active={active} size={size} onClick={onClick || handleClick}>
					{renderButtonLight ? renderButtonLight() : renderLight()}
					{children}
				</Button>
			</ButtonContainer>
		</ControlContainer>
	);
};

export default ButtonControl;
