import {BASE_FREQ, FREQ_MULTIPLIER} from './statics';

export const getValueFromRange = (value, range) => {
  const { min, max } = range;
  if (value > max) return max;
  else if (value < min) return min;
  return value;
};

// (base Hz, octave, transpose) --> (pitched Hz)
export const getNoteFromValues = (freq, octave, transpose) => {
	const octavedFrequency = (freq * Math.pow(2, octave)) / 8;
	return octavedFrequency * Math.pow(FREQ_MULTIPLIER, transpose);
};

// (0 - 100) --> (-Infinity - 0)
export const getDecibelsFromValue = value => 20 * Math.log10(value / 100);

// (0 - 100) --> (0 - 21031)
export const getFrequencyFromValue = value => BASE_FREQ * 4 * Math.pow(FREQ_MULTIPLIER, value) - BASE_FREQ * 4;

// (0 - 100) --> (0.0001 - 4)
export const getSecondsFromValue = value => Math.pow(value, 2) / 2500 || 0.0001;

// (0 - 100) --> (0.03125 - 32)
export const getHarmonicityFromValue = value => Math.pow(2, (value - 50) / 10);