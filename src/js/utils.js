import {BASE_FREQ, FREQ_MULTIPLIER} from './statics';

export const getSetterFromString = str => 'set' + str.replace(/^\w/, c => c.toUpperCase());

export const getDecibelsFromValue = value => 20 * Math.log10(value / 100);
export const getFrequencyFromValue = value => BASE_FREQ * 4 * Math.pow(FREQ_MULTIPLIER, value);
