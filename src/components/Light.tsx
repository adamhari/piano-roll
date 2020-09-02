import React from 'react';
import {Size} from '../types';

type Props = {
	active: boolean;
	size: Size;
};

const Light = ({active, size}: Props) => {
	const getClasses = () => {
		let classes = ['light'];
		active && classes.push('active');
		size && classes.push(size);
		return classes.join(' ');
	};

	return <div className={getClasses()} />;
};

export default Light;
