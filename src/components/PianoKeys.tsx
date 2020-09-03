import React, {ReactNode} from 'react';
import {KEYS} from '../js/statics';
import {PianoKeyMouseEvents} from '../types';

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
		const active = activeKeys.includes(name);
		const note = name.substring(0, name.length - 1);
		const keySet = note.endsWith('♯') ? blackKeys : whiteKeys;

		keySet.push(
			<div
				key={index}
				title={name}
				className={[
					'piano-key',
					`piano-key-${note}`,
					note.endsWith('♯') ? 'piano-key-black' : 'piano-key-white',
					active ? 'piano-key-active' : 'piano-key-inactive',
				].join(' ')}
				id={`piano-key-${name}`}
				onMouseDown={handleMouseDownPianoKey}
				onMouseUp={handleMouseUpPianoKey}
				onMouseOver={handleMouseOverPianoKey}
				onMouseLeave={handleMouseLeavePianoKey}
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
