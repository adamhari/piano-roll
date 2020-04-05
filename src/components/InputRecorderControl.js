import React from 'react';

const InputRecorderControl = ({active, label, size}) => {
	const getClasses = () => {
		let classes = 'button ';
		if (active) classes += 'active ';
		if (size) classes += size;
		return classes;
	};

	return (
		<div className={'button-control-container control-container'}>
			<div className="control-label">{label}</div>
			<div className={'button-container'}>
				<div className={getClasses()} />
			</div>
		</div>
	);
};

export default InputRecorderControl;
