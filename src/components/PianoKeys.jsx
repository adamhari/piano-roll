import React from 'react';
import PianoKey from './PianoKey';
import {KEYS} from '../js/statics';

const PianoKeys = props => {
	const {activeKeys, octaves} = props;

	const blackKeys = [];
	const whiteKeys = [];

	const pianoKeys = KEYS.slice(0, 12 * octaves);

	pianoKeys.forEach((key, index) => {
		const keySet = key.name.includes('♯') ? blackKeys : whiteKeys;

		keySet.push(
			<PianoKey
				{...props}
				key={key.octave * 12 + index}
				name={key.name}
				note={key.name.substring(0, key.name.length - 1)}
				freq={key.freq * Math.pow(2, key.octave)}
				active={activeKeys.includes(key.name)}
			/>
		);
	});

	return (
		<div id="piano-keys">
			<div id="piano-black-keys">{blackKeys}</div>
			<div id="piano-white-keys">{whiteKeys}</div>
		</div>
	);
};

export default PianoKeys;
