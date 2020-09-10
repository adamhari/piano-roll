import React, {ReactNode} from 'react';
import styled from 'styled-components';
import {KEYS} from '../js/statics';
import {PianoKeyMouseEvents} from '../types';
import {border, color, shadow} from '../styles';

const KeysContainer = styled.div`
	display: inline-block;
	cursor: pointer;
`;

const BlackKeysContainer = styled.div`
	display: flex;
	flex-flow: row;
	position: absolute;
`;

const WhiteKeysContainer = styled.div`
	display: flex;
`;

const Key = styled.div`
	display: inline-block;
	border: ${border.key};
	border-top: ${border.instrument};
	border-bottom: ${border.instrument};
`;

const WhiteKey = styled(Key)`
	width: 2.3rem;
	height: 12rem;
	background: ${color.keyWhite};
	box-shadow: ${shadow.keyInsetTop}, ${shadow.keyInsetBottom}, ${shadow.keyWhiteOutset};

	& :first-child {
		border-left: ${border.instrument};
		border-bottom-left-radius: 0.3125rem;
		box-shadow: ${shadow.keyWhiteOutset}, ${shadow.keyInsetTop}, ${shadow.keyInsetLeft};
	}

	& :last-child {
		border-right: ${border.instrument};
		border-bottom-right-radius: 0.3125rem;
		box-shadow: ${shadow.keyWhiteOutset}, ${shadow.keyInsetTop}, ${shadow.keyInsetRight};
	}
`;

const WhiteKeyActive = styled(WhiteKey)`
	background: ${color.keyWhiteActive};
	box-shadow: ${shadow.keyWhiteOutsetActive};
`;

const BlackKey = styled(Key)`
	margin-top: 0.1rem;
	width: 1.3rem;
	height: 7.8rem;
	background: ${color.keyBlack};
	border: ${color.keyBorder};
	border-top-width: 0.075rem;
	border-left-width: 0.15rem;
	border-right-width: 0.15rem;
	border-bottom-width: 0.15rem;
	border-bottom-left-radius: 0.2rem 0.3rem;
	border-bottom-right-radius: 0.2rem 0.3rem;
	box-shadow: ${shadow.keyBlackOutset};
	position: absolute;

	${Array(10)
		.fill(null)
		.map((x, i) => {
			const offset = 16.1 * i;

			return `
    &:nth-child(${i * 5 + 1}) {
      left: ${offset + 1.433333}rem;
    }

    &:nth-child(${i * 5 + 2}) {
      left: ${offset + 4.166666}rem;
    }

    &:nth-child(${i * 5 + 3}) {
      left: ${offset + 8.225}rem;
    }

    &:nth-child(${i * 5 + 4}) {
      left: ${offset + 10.8375}rem;
    }

    &:nth-child(${i * 5 + 5}) {
      left: ${offset + 13.375}rem;
    }
  `;
		})
		.join(' ')}
`;

const BlackKeyActive = styled(BlackKey)`
	background: ${color.keyBlackActive};
	box-shadow: ${shadow.keyBlackOutsetActive};
`;

type Props = PianoKeyMouseEvents & {
	activeKeys: string[];
	octaves: number;
};

const PianoKeys = ({
	activeKeys,
	octaves,
	handleMouseDownPianoKey,
	handleMouseUpPianoKey,
	handleMouseOverPianoKey,
	handleMouseLeavePianoKey,
}: Props) => {
	const blackKeys: ReactNode[] = [];
	const whiteKeys: ReactNode[] = [];

	KEYS.slice(0, 12 * octaves).forEach((key, index) => {
		const {name} = key;
		const note = name.substring(0, name.length - 1);
		const keySet = note.endsWith('♯') ? blackKeys : whiteKeys;
		const active = activeKeys.includes(name);

		const keyProps = {
			key: index,
			title: name,
			onMouseDown: handleMouseDownPianoKey,
			onMouseUp: handleMouseUpPianoKey,
			onMouseMover: handleMouseOverPianoKey,
			onMouseLeave: handleMouseLeavePianoKey,
		};

		if (keySet === whiteKeys) {
			if (active) keySet.push(<WhiteKeyActive {...keyProps} />);
			else keySet.push(<WhiteKey {...keyProps} />);
		} else {
			if (active) keySet.push(<BlackKeyActive {...keyProps} />);
			else keySet.push(<BlackKey {...keyProps} />);
		}
	});

	return (
		<KeysContainer>
			<BlackKeysContainer>{blackKeys}</BlackKeysContainer>
			<WhiteKeysContainer>{whiteKeys}</WhiteKeysContainer>
		</KeysContainer>
	);
};

export default PianoKeys;
