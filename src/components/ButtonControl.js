import React from 'react';
import Light from './Light';

const ButtonControl = ({active, handleClickControl, label, name, size, value}) => {
	const handleClick = (e) => {
		handleClickControl(name, value);
	};

	const getClasses = () => {
		let classes = 'button ';
		if (active) classes += 'active ';
		if (size) classes += `${size} `;
		return classes;
	};

	const renderLight = () => active !== null && <Light active={active} size={size} />;

	return (
		<div className={'button-control-container control-container'}>
			<div className="control-label">{label || value}</div>
			<div className={'button-container'}>
				<div onClick={handleClick} className={getClasses()}>
					{renderLight()}
				</div>
			</div>
		</div>
	);
};

export default ButtonControl;
