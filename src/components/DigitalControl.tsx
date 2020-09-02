import React, {CSSProperties, MouseEvent, useMemo} from 'react';
import {CONTROL_TYPES, CONTROLS} from '../js/statics';
import {ControlMouseEvents, DigitTypes} from '../types';

type Props = ControlMouseEvents & {
	name: string;
	label?: string;
	outline?: boolean;
	value: number;
};

const DigitalControl = ({
	handleMouseDownControl,
	handleMouseUpControl,
	handleMouseWheelControl,
	name,
	label,
	outline,
	value,
}: Props) => {
	const {
		range: {min, max},
	} = CONTROLS[name];

	const getDigits = (min: number, max: number): DigitTypes => {
		if (min > -1 && max < 10) return 'single-digit';
		if (min <= -1 && max < 10) return 'single-digit-negative';
		if (min > -1 && max >= 10) return 'double-digit';
		return 'double-digit-negative';
	};

	const digits = useMemo(() => getDigits(min, max), [min, max]);

	const handleMouseDown = (e: MouseEvent<HTMLDivElement>) =>
		handleMouseDownControl(name, CONTROL_TYPES.digital.name, e);

	const handleMouseUp = (e: MouseEvent<HTMLDivElement>) =>
		handleMouseUpControl(name, CONTROL_TYPES.digital.name, e);

	const handleMouseWheel = (e: MouseEvent<HTMLDivElement>) =>
		handleMouseWheelControl(name, CONTROL_TYPES.digital.name, e);

	const digitTypes = {
		'single-digit': {
			backgroundValue: 8,
			style: (val: number) => {
				const styles: CSSProperties = {};
				if (val === 1) styles.left = '-0.25rem';
				return styles;
			},
		},
		'single-digit-negative': {
			backgroundValue: -8,
			style: (val: number) => {
				const styles: CSSProperties = {};
				if (val > 1 || val === 0) styles.left = '-0.0625rem';
				if (val === 1) styles.left = '0.245rem';
				if (val === -1) {
					styles.left = '-0.225rem';
					styles.letterSpacing = '0.5375rem';
				}
				return styles;
			},
		},
		'double-digit': {
			backgroundValue: 88,
			style: (val: number) => {
				const styles: CSSProperties = {};
				return styles;
			},
		},
		'double-digit-negative': {
			backgroundValue: -88,
			style: (val: number) => {
				const styles: CSSProperties = {};
				return styles;
			},
		},
	};

	return (
		<div className={'digital-control ' + (outline ? 'digital-control-outlined' : '')}>
			<label id={'' + name + '-label'} className='control-label' htmlFor={'' + name}>
				{label || name}
			</label>
			<div className='digital-control-input-container control-container'>
				<div id={'' + name} className={'digital-control-input ' + digits}>
					{8}
					<div
						id={'' + name + '-background'}
						className={'digital-control-input digital-control-input-background ' + digits}
						children={digitTypes[digits].backgroundValue}
					/>
					<div
						id={'' + name + '-foreground'}
						className={'digital-control-input digital-control-input-foreground ' + digits}
						children={Number.isInteger(value) ? value : '-'}
						style={digitTypes[digits].style(value)}
						onMouseDown={handleMouseDown}
						onMouseUp={handleMouseUp}
						onWheel={handleMouseWheel}
					/>
				</div>
			</div>
		</div>
	);
};

export default DigitalControl;
