import styled, {css} from 'styled-components';
import {color, font} from '../../styles';

export const controlOutline = css`
	border: solid ${color.label} 0.1875rem;
	border-top: none;
	border-top-left-radius: 0;
	border-top-right-radius: 0;
	border-bottom-left-radius: 0.25rem;
	border-bottom-right-radius: 0.25rem;
`;

export const labelText = css`
	text-transform: uppercase;
	color: ${color.label};
	font-family: ${font.label};
	font-size: 0.5625rem;
	letter-spacing: 0.015625rem;
	padding: 0.225rem 0.375rem 0.1875rem;
`;

export const outlinedControlLabelText = css`
	color: ${color.instrumentPlastic};
	background-color: ${color.label};
	border-top-left-radius: 0.25rem;
	border-top-right-radius: 0.25rem;
`;

export const ControlContainer = styled.div`
	margin: 0 0.5rem 0.5rem;
`;

export const ControlLabel = styled.div`
	${labelText};
	text-align: center;
	margin: 0 0 0.375rem;
`;
