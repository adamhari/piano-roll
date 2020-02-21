import React from 'react';
import {CONTROL_TYPES, CONTROLS} from '../js/statics';

const DigitalControl = ({
	handleMouseDownControl,
	handleMouseUpControl,
	handleMouseWheelControl,
	name,
	label,
	outline,
	value
}) => {
	const {
		range: {min, max}
	} = CONTROLS[name];

	const getDigits = () => {
		let typeOfDigits = '';
		if (max > 9) typeOfDigits = 'multi-digit';
		else typeOfDigits = 'single-digit';
		if (min < 0) typeOfDigits += '-negative';
		return typeOfDigits;
	};

	const digits = getDigits();

	const handleMouseDown = e => handleMouseDownControl(name, CONTROL_TYPES.digital.name, e);

	const handleMouseUp = e => handleMouseUpControl(name, CONTROL_TYPES.digital.name, e);

	const handleMouseWheel = e => handleMouseWheelControl(name, CONTROL_TYPES.digital.name, e);

	const digitTypes = {
		'single-digit': {
			backgroundValue: 8,
			style: val => {
				const styles = {};
				if (val === 1) styles.left = '-0.25rem';
				return styles;
			}
		},
		'single-digit-negative': {
			backgroundValue: -8,
			style: val => {
				const styles = {};
				if (val > 1 || val === 0) styles.left = '-0.0625rem';
				if (val === 1) styles.left = '0.245rem';
				if (val === -1) {
					styles.left = '-0.225rem';
					styles.letterSpacing = '0.5375rem';
				}
				return styles;
			}
		}
	};

	return (
		<div className={'digital-control ' + (outline ? 'digital-control-outlined' : '')}>
			<label id={'' + name + '-label'} className="control-label" htmlFor={'' + name}>
				{label || name}
			</label>
			<div className="digital-control-input-container control-container">
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
						children={value}
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
