import { MouseEvent } from 'react';

export type Size = 'small' | 'medium' | 'large';

export type DigitType = 'single-digit' | 'single-digit-negative' | 'double-digit' | 'double-digit-negative';

export type ControlMouseEvents = {
  handleMouseDownControl: (activeControl: string, activeControlType: string, e: MouseEvent<HTMLDivElement>) => void;
  handleMouseUpControl: (activeControl: string, activeControlType: string, e: MouseEvent<HTMLDivElement>) => void;
  handleMouseWheelControl: (activeControl: string, activeControlType: string, e: MouseEvent<HTMLDivElement>) => void;
};

export type ButtonMouseEvents = {
  handleClickControl: (name: string, value: number | string) => void
}

export type PianoKeyMouseEvents = {
	handleMouseDownPianoKey: (e: MouseEvent) => void;
	handleMouseUpPianoKey: (e: MouseEvent) => void;
	handleMouseOverPianoKey: (e: MouseEvent) => void;
	handleMouseLeavePianoKey: (e: MouseEvent) => void;
};
