import React, {CSSProperties, MouseEvent} from 'react';
import {CONTROL_TYPES, CONTROLS} from '../js/statics';
import {Size, ControlMouseEvents} from '../types';

type Props = ControlMouseEvents & {
	activeControl: string;
	name: string;
	label?: string;
	size: Size;
	value: number;
};

const KnobControl = ({
	activeControl,
	handleMouseDownControl,
	handleMouseUpControl,
	handleMouseWheelControl,
	name,
	label,
	size,
	value,
}: Props) => {
	const {
		range: {min, max},
	} = CONTROLS[name];

	const handleMouseDown = (e: MouseEvent<HTMLDivElement>) =>
		handleMouseDownControl(name, CONTROL_TYPES.knob.name, e);

	const handleMouseUp = (e: MouseEvent<HTMLDivElement>) =>
		handleMouseUpControl(name, CONTROL_TYPES.knob.name, e);

	const handleMouseWheel = (e: MouseEvent<HTMLDivElement>) =>
		handleMouseWheelControl(name, CONTROL_TYPES.knob.name, e);

	const getKnobStyle = () => {
		const style: CSSProperties = {};

		const valueAsPercent = ((value - min) * 100) / (max - min);
		const valueAsDeg = valueAsPercent * 3.6;
		const valueForRotate = (valueAsDeg + 180) * 0.875 + 45;

		style.transform = `rotate(${valueForRotate}deg)`;

		return style;

		//min: 0, 0
		//max: 30, 50
		//input: 5, 15

		// (5 - 0) * 100 / (30 - 0) = 16.667
		// (15 - 0) * 100 / (50 - 0) = 30
	};

	const getValueStyles = () => {
		const styles: CSSProperties = {
			opacity: activeControl === name ? 1 : 0,
		};

		return styles;
	};

	return (
		<div className={'knob-control-container control-container ' + (size || '')}>
			<div className='control-label'>{label || name}</div>
			<div className='knob-container'>
				<div
					className='knob'
					style={getKnobStyle()}
					onMouseDown={handleMouseDown}
					onMouseUp={handleMouseUp}
					onWheel={handleMouseWheel}
				/>
				<div className='knob-control-value' style={getValueStyles()}>
					{value}
				</div>
			</div>
		</div>
	);
};

export default KnobControl;
