import {BASE_FREQ, FREQ_MULTIPLIER} from './statics';

export const getDecibelsFromValue = value => 20 * Math.log10(value / 100);
export const getFrequencyFromValue = value => BASE_FREQ * 4 * Math.pow(FREQ_MULTIPLIER, value);
