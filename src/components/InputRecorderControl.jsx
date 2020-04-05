import React from 'react';
import ButtonControl from './ButtonControl';

const InputRecorderControl = ({active, label, light, onClick, size}) => {
	return (
		<ButtonControl active={active} label={label} light={light} onClick={onClick} size={size} />
	);
};

export default InputRecorderControl;
