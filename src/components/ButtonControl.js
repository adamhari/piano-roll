import React from 'react';

const ButtonControl = ({active, handleClickControl, label, name, size, value}) => {
	const handleClick = e => {
		handleClickControl(name, value);
	};

	const getClasses = () => {
		let classes = 'button ';
		if (active) classes += 'active ';
		if (size) classes += `${size} `;
		return classes;
	};

	return (
		<div className={'button-control-container control-container'}>
			<div className="control-label">{label || value}</div>
			<div className={'button-container'}>
				<div onClick={handleClick} className={getClasses()} />
			</div>
		</div>
	);
};

export default ButtonControl;
