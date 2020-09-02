import React, {MouseEvent} from 'react';
import Light from './Light';
import {ButtonMouseEvents, Size} from '../types';

type Props = ButtonMouseEvents & {
	active?: boolean;
	children?: React.ReactNode;
	label?: string;
	light?: boolean;
	name: string;
	onClick?: (e: any) => void;
	size: Size;
	value: number | string;
};

const ButtonControl = ({
	active,
	children,
	handleClickControl,
	label,
	light,
	name,
	onClick,
	size,
	value,
}: Props) => {
	const handleClick = (e: MouseEvent) => handleClickControl(name, value);

	const getClasses = () => {
		let classes = ['button'];
		active && classes.push('active');
		size && classes.push(size);
		return classes.join(' ');
	};

	const renderLight = () => light && <Light active={active || false} size={size} />;

	return (
		<div className={'button-control-container control-container'}>
			<div className='control-label'>{label || value}</div>
			<div className={'button-container'}>
				<div onClick={onClick || handleClick} className={getClasses()}>
					{renderLight()}
					{children}
				</div>
			</div>
		</div>
	);
};

export default ButtonControl;
