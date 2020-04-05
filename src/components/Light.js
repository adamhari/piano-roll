import React from 'react';

const Light = ({active, size}) => {
	const getClasses = () => {
		let classes = 'light ';
		if (active) classes += 'active ';
		if (size) classes += `${size} `;
		return classes;
	};

	return <div className={getClasses()} />;
};

export default Light;
