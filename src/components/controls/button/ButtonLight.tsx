import React from 'react';
import styled, {css} from 'styled-components';
import {Size} from '../../../types';
import {color, shadow, blinkingLight} from '../../../styles';

const ButtonLight = styled.div<Props>`
	display: block;
	position: absolute;
	content: '';
	width: ${({size}) => (size === 'large' ? '1.5rem' : '0.5rem')};
	height: 0.5rem;
	border-radius: 0.25rem;
	background: ${({active}) => (active ? color.buttonLightActive : color.buttonLightInactive)};
	box-shadow: ${({active}) =>
		active
			? [shadow.buttonLightInset, shadow.buttonLightOutset].join(', ')
			: shadow.buttonLightInset};
	transition: 0.1s all ease-out;
	animation: ${({blinking}) =>
		blinking &&
		css`
			${blinkingLight} 0.3s ease-in-out infinite alternate
		`};
`;

type Props = {
	active: boolean;
	blinking?: boolean;
	size: Size;
};

export default ({active, blinking, size}: Props) => (
	<ButtonLight active={active} blinking={blinking} size={size} />
);
