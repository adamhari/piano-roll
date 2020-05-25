import React from 'react';
import Light from './Light';

interface Props {
	active?: boolean;
	children?: React.ReactNode;
	handleClickControl: (name: string, value: number) => void;
	label?: string;
	light?: boolean;
	name: string;
	onClick: () => void;
	size: string;
	value: any;
}

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
		let classes = 'button ';
		if (active) classes += 'active ';
		if (size) classes += `${size} `;
		return classes;
	};

	const renderLight = () => light && <Light active={active} size={size} />;

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
