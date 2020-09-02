import React from 'react';
import {PianoKeyMouseEvents} from '../types';

type Props = PianoKeyMouseEvents & {
	active: boolean;
	disabled?: boolean;
	name: string;
	note: string;
};

const PianoKey = ({
	active,
	disabled,
	handleMouseDownPianoKey,
	handleMouseUpPianoKey,
	handleMouseOverPianoKey,
	handleMouseLeavePianoKey,
	name,
	note,
}: Props) => {
	const getClasses = () =>
		[
			'piano-key',
			`piano-key-${note}`,
			note.endsWith('♯') ? 'piano-key-black' : 'piano-key-white',
			active ? 'piano-key-active' : disabled ? 'piano-key-disabled' : 'piano-key-inactive',
		].join(' ');

	return (
		<div
			title={name}
			className={getClasses()}
			id={`piano-key-${name}`}
			onMouseDown={handleMouseDownPianoKey}
			onMouseUp={handleMouseUpPianoKey}
			onMouseOver={handleMouseOverPianoKey}
			onMouseLeave={handleMouseLeavePianoKey}
		/>
	);
};

export default PianoKey;
