import React, {ReactNode} from 'react';
import PianoKey from './PianoKey';
import {KEYS} from '../js/statics';
import {PianoKeyMouseEvents} from '../types';

type Props = PianoKeyMouseEvents & {
	activeKeys: string[];
	octaves: number;
};

const PianoKeys = (props: Props) => {
	const blackKeys: ReactNode[] = [];
	const whiteKeys: ReactNode[] = [];

	const pianoKeys = KEYS.slice(0, 12 * props.octaves);

	pianoKeys.forEach((key, index) => {
		const keySet = key.name.includes('♯') ? blackKeys : whiteKeys;

		keySet.push(
			<PianoKey
				{...props}
				name={key.name}
				note={key.name.substring(0, key.name.length - 1)}
				active={props.activeKeys.includes(key.name)}
			/>
		);
	});

	return (
		<div id='piano-keys'>
			<div id='piano-black-keys'>{blackKeys}</div>
			<div id='piano-white-keys'>{whiteKeys}</div>
		</div>
	);
};

export default PianoKeys;
