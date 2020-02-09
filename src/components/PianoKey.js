import React from 'react';

const PianoKey = ({
	active,
	disabled,
	handleMouseDownPianoKey,
	handleMouseUpPianoKey,
	handleMouseOverPianoKey,
	handleMouseLeavePianoKey,
	name,
	note
}) => {
	const getClassNames = () => {
		let classNames = [
			'piano-key',
			`piano-key-${note}`,
			name.includes('♯') ? 'piano-key-black' : 'piano-key-white',
			active ? 'piano-key-active' : disabled ? 'piano-key-disabled' : 'piano-key-inactive'
		];

		return classNames.join(' ');
	};

	return (
		<div
			title={name}
			className={getClassNames()}
			id={`piano-key-${name}`}
			tabIndex="0"
			onMouseDown={handleMouseDownPianoKey}
			onMouseUp={handleMouseUpPianoKey}
			onMouseOver={handleMouseOverPianoKey}
			onMouseLeave={handleMouseLeavePianoKey}
		/>
	);
};

export default PianoKey;
