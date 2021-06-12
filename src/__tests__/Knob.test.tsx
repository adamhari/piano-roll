import React from 'react';
import {render, screen} from '@testing-library/react';

import KnobControl, {Props} from '../components/controls/KnobControl';
import {CONTROLS} from '../js/statics';

const testControlName = Object.keys(CONTROLS)[0];
const testControlLabel = testControlName + ' label';
const testControl = CONTROLS[testControlName];

const testProps: Props = {
	handleMouseDownControl: () => {},
	handleMouseUpControl: () => {},
	handleMouseWheelControl: () => {},
	activeControl: '',
	name: testControlName,
	label: testControlLabel,
	size: 'large',
	value: testControl.range.max,
};

test('renders without crashing', () => {
	render(<KnobControl {...testProps} />);
});

test('renders label text', () => {
	render(<KnobControl {...testProps} />);
	expect(screen.getByText(testControlLabel)).toBeInTheDocument();
});

test('falls back to rendering name prop as text when label prop is not provided', () => {
	render(<KnobControl {...testProps} label={undefined} />);
	expect(screen.getByText(testControlName)).toBeInTheDocument();
	expect(screen.queryByText(testControlLabel)).not.toBeInTheDocument();
});
