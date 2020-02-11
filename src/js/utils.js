import {BASE_FREQ, FREQ_MULTIPLIER} from './statics';

//
export const getNoteFromValues = (freq, octave, transpose) => {
	const octavedFrequency = (freq * Math.pow(2, octave)) / 8;
	return octavedFrequency * Math.pow(FREQ_MULTIPLIER, transpose);
};

// (0 - 100) --> (-Infinity - 0)
export const getDecibelsFromValue = value => 20 * Math.log10(value / 100);

// (0 - 100) --> (0 - 21031)
export const getFrequencyFromValue = value => BASE_FREQ * 4 * Math.pow(FREQ_MULTIPLIER, value) - BASE_FREQ * 4;

// (0 - 100) --> (0.001 - 10)
export const getSecondsFromValue = value => Math.pow(value, 2) / 1000 || 0.0001;
