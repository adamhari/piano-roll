import React from 'react';

const ButtonControl = ({handleClickControl, label, name, value}) => {
	const active = label === value;

	const handleClick = e => handleClickControl(name, label);

	return (
		<div className={'button-control-container control-container'}>
			<div className="control-label">{label}</div>
			<div className={'button-container'}>
				<div onClick={handleClick} className={'button ' + (active ? 'active' : '')} />
			</div>
		</div>
	);
};

export default ButtonControl;
