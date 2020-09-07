import WaveformData from 'waveform-data';
import {BASE_FREQ, FREQ_MULTIPLIER} from './statics';
import {audioContext} from './globals';

export const getArrayBufferFromFile = (file: any) =>
	new Promise<ArrayBuffer>((resolve, reject) => {
		try {
			const reader = new FileReader();
			reader.readAsArrayBuffer(file);
			reader.onloadend = (e: any) => {
				e.target.readyState === FileReader.DONE
					? resolve(e.target.result)
					: reject(e.target.result);
			};
		} catch (err) {
			reject(err);
		}
	});

export const getWaveformFromArrayBuffer = (arrayBuffer: ArrayBuffer) =>
	new Promise<WaveformData>((resolve, reject) => {
		WaveformData.createFromAudio(
			{
				audio_context: audioContext.rawContext as AudioContext,
				array_buffer: arrayBuffer,
				scale: 32,
			},
			(err, waveform) => {
				err && reject(err);
				resolve(waveform);
			}
		);
	});

export const getValueFromRange = (value: number, range: {min: number; max: number}) => {
	const {min, max} = range;
	if (value > max) return max;
	else if (value < min) return min;
	return value;
};

// (base Hz, octave, transpose) --> (pitched Hz)
export const getNoteFromValues = (freq: number, octave: number, transpose: number) => {
	const octavedFrequency = (freq * Math.pow(2, octave)) / 8;
	return octavedFrequency * Math.pow(FREQ_MULTIPLIER, transpose);
};

// (0 - 100) --> (-Infinity - 0)
export const getDecibelsFromValue = (value: number) => 20 * Math.log10(value / 100);

// (0 - 100) --> (0 - 21031)
export const getFrequencyFromValue = (value: number) =>
	BASE_FREQ * 4 * Math.pow(FREQ_MULTIPLIER, value) - BASE_FREQ * 4;

// (0 - 100) --> (0.0001 - 4)
export const getSecondsFromValue = (value: number) => Math.pow(value, 2) / 2500 || 0.0001;

// (0 - 100) --> (0.03125 - 32)
export const getHarmonicityFromValue = (value: number) => Math.pow(2, (value - 50) / 10);
