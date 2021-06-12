export const LAYOUTS = [
	{
		// MAJOR
		z: 'C0',
		x: 'D0',
		c: 'E0',
		v: 'F0',
		b: 'G0',
		n: 'A0',
		m: 'B0',
		a: 'C1',
		s: 'D1',
		d: 'E1',
		f: 'F1',
		g: 'G1',
		h: 'A1',
		j: 'B1',
		k: 'C2',
		l: 'D2',
		';': 'E2',
		"'": 'F2',
		',': 'C1',
		'.': 'D1',
		'/': 'E1',
		q: 'C2',
		w: 'D2',
		e: 'E2',
		r: 'F2',
		t: 'G2',
		y: 'A2',
		u: 'B2',
		i: 'C3',
		o: 'D3',
		p: 'E3',
		'[': 'F3',
		']': 'G3',
		'\\': 'A3',
    delete: 'B3',
    1: 'C3',
    2: 'D3',
    3: 'E3',
    4: 'F3',
    5: 'G3',
    6: 'A3',
    7: 'B3',
    8: 'C4',
    9: 'D4',
    0: 'E4',
    '-': 'F4',
    '=': 'G4',
    'backspace': 'A4'
	},
	{
		// MINOR
		z: 'C0',
		s: 'C♯0',
		x: 'D0',
		d: 'D♯0',
		c: 'E0',
		v: 'F0',
		g: 'F♯0',
		b: 'G0',
		h: 'G♯0',
		n: 'A0',
		j: 'A♯0',
		m: 'B0',
		',': 'C1',
		l: 'C♯1',
		'.': 'D1',
		';': 'D♯1',
		'/': 'E1',
		q: 'C1',
		'2': 'C♯1',
		w: 'D1',
		'3': 'D♯1',
		e: 'E1',
		r: 'F1',
		'5': 'F♯1',
		t: 'G1',
		'6': 'G♯1',
		y: 'A1',
		'7': 'A♯1',
		u: 'B1',
		i: 'C2',
		'9': 'C♯2',
		o: 'D2',
		'0': 'D♯2',
		p: 'E2',
		'[': 'F2',
		'=': 'F♯2',
		']': 'G2',
		backspace: 'G♯2',
		'\\': 'A2',
		insert: 'A♯2',
    delete: 'B2'
	},
];

export const MODIFIER_KEYS = ['control', 'command', 'meta'];
export const BASE_FREQ = 16.3516;
export const FREQ_MULTIPLIER = 1.0594630943593;
export const NOTES = [
	{
		name: 'C',
		freq: BASE_FREQ * Math.pow(FREQ_MULTIPLIER, 0),
	},
	{
		name: 'C♯',
		freq: BASE_FREQ * Math.pow(FREQ_MULTIPLIER, 1),
	},
	{
		name: 'D',
		freq: BASE_FREQ * Math.pow(FREQ_MULTIPLIER, 2),
	},
	{
		name: 'D♯',
		freq: BASE_FREQ * Math.pow(FREQ_MULTIPLIER, 3),
	},
	{
		name: 'E',
		freq: BASE_FREQ * Math.pow(FREQ_MULTIPLIER, 4),
	},
	{
		name: 'F',
		freq: BASE_FREQ * Math.pow(FREQ_MULTIPLIER, 5),
	},
	{
		name: 'F♯',
		freq: BASE_FREQ * Math.pow(FREQ_MULTIPLIER, 6),
	},
	{
		name: 'G',
		freq: BASE_FREQ * Math.pow(FREQ_MULTIPLIER, 7),
	},
	{
		name: 'G♯',
		freq: BASE_FREQ * Math.pow(FREQ_MULTIPLIER, 8),
	},
	{
		name: 'A',
		freq: BASE_FREQ * Math.pow(FREQ_MULTIPLIER, 9),
	},
	{
		name: 'A♯',
		freq: BASE_FREQ * Math.pow(FREQ_MULTIPLIER, 10),
	},
	{
		name: 'B',
		freq: BASE_FREQ * Math.pow(FREQ_MULTIPLIER, 11),
	},
];

type Key = {
	name: string;
	freq: number;
	octave: number;
};
export const KEYS: Key[] = [];

type KeysMap = {
	[key: string]: Key;
};
export const KEYS_MAP: KeysMap = {};
for (let i = 0; i < 10; i++) {
	NOTES.forEach((note) => {
		const key = {
			name: note.name + i,
			freq: note.freq * Math.pow(2, i),
			octave: i,
		};
		KEYS.push(key);
		KEYS_MAP[key.name] = key;
	});
}

export const MODES = {
	SAMPLER: 0,
	SYNTH: 1,
};

export const SAMPLES = ['/assets/audio/samples/CS_Synth_Hit_9_G.mp3'];

export const SUPPORTED_SAMPLE_FORMATS = ['audio/wav', 'audio/mp3', 'audio/ogg'];

export const OSC_SHAPES = ['sawtooth', 'square', 'triangle', 'sine'];

export const FILTER_TYPES = [
	'lowpass',
	'highpass',
	'bandpass',
	'lowshelf',
	'highshelf',
	'peaking',
	'notch',
];

export const FILTER_ROLLOFFS = [-12, -24, -48, -96];

export const OVERSAMPLE_TYPES = ['none', '2x', '4x'];

export const CONTROL_TYPES = {
	digital: {
		name: 'digital',
		pixelStep: 10,
	},
	knob: {
		name: 'knob',
		pixelStep: 3,
	},
};

type Controls = {
	[key: string]: {
		defaultValue: number;
		range: {
			min: number;
			max: number;
		};
	};
};

export const CONTROLS: Controls = {
	/* GLOBAL */
	layout: {
		defaultValue: 0,
		range: {
			min: 0,
			max: LAYOUTS.length - 1,
		},
	},
	volume: {
		defaultValue: 50,
		range: {
			min: 0,
			max: 100,
		},
	},
	polyphony: {
		defaultValue: 9,
		range: {
			min: 1,
			max: 9,
		},
	},
	portamento: {
		defaultValue: 0,
		range: {
			min: 0,
			max: 100,
		},
	},
	/* ENVELOPE */
	attack: {
		defaultValue: 0,
		range: {
			min: 0,
			max: 100,
		},
	},
	decay: {
		defaultValue: 50,
		range: {
			min: 0,
			max: 100,
		},
	},
	sustain: {
		defaultValue: 75,
		range: {
			min: 0,
			max: 100,
		},
	},
	release: {
		defaultValue: 25,
		range: {
			min: 0,
			max: 100,
		},
	},
	mode: {
		defaultValue: MODES.SAMPLER,
		range: {
			min: 0,
			max: Object.keys(MODES).length - 1,
		},
	},
	/* SAMPLER */
	sample: {
		defaultValue: 0,
		range: {
			min: 0,
			max: SAMPLES.length - 1,
		},
	},
	samplePitch: {
		defaultValue: 0,
		range: {
			min: -50,
			max: 50,
		},
	},
	/* SYNTH */
	osc1Shape: {
		defaultValue: 0,
		range: {
			min: 0,
			max: OSC_SHAPES.length - 1,
		},
	},
	osc1Octave: {
		defaultValue: 5,
		range: {
			min: 0,
			max: 9,
		},
	},
	osc1Transpose: {
		defaultValue: 0,
		range: {
			min: -9,
			max: 9,
		},
	},
	osc1Detune: {
		defaultValue: 0,
		range: {
			min: -100,
			max: 100,
		},
	},
	osc1Gain: {
		defaultValue: 100,
		range: {
			min: 0,
			max: 100,
		},
	},
	osc2Shape: {
		defaultValue: 0,
		range: {
			min: 0,
			max: OSC_SHAPES.length - 1,
		},
	},
	osc2Octave: {
		defaultValue: 5,
		range: {
			min: 0,
			max: 9,
		},
	},
	osc2Transpose: {
		defaultValue: 0,
		range: {
			min: -9,
			max: 9,
		},
	},
	osc2Detune: {
		defaultValue: 0,
		range: {
			min: -100,
			max: 100,
		},
	},
	osc2Gain: {
		defaultValue: 0,
		range: {
			min: 0,
			max: 100,
		},
	},
	modOscShape: {
		defaultValue: 0,
		range: {
			min: 0,
			max: OSC_SHAPES.length - 1,
		},
	},
	modOscFreq: {
		defaultValue: 50,
		range: {
			min: 0,
			max: 100,
		},
	},
	modOscGain: {
		defaultValue: 0,
		range: {
			min: 0,
			max: 100,
		},
	},
	/* FILTERS */
	filter1Type: {
		defaultValue: 0,
		range: {
			min: 0,
			max: FILTER_TYPES.length - 1,
		},
	},
	filter1Rolloff: {
		defaultValue: 0,
		range: {
			min: 0,
			max: FILTER_ROLLOFFS.length - 1,
		},
	},
	filter1Freq: {
		defaultValue: 100,
		range: {
			min: 0,
			max: 100,
		},
	},
	filter1Q: {
		defaultValue: 0,
		range: {
			min: 0,
			max: 100,
		},
	},
	filter2Type: {
		defaultValue: 0,
		range: {
			min: 0,
			max: FILTER_TYPES.length - 1,
		},
	},
	filter2Rolloff: {
		defaultValue: 0,
		range: {
			min: 0,
			max: FILTER_ROLLOFFS.length - 1,
		},
	},
	filter2Freq: {
		defaultValue: 100,
		range: {
			min: 0,
			max: 100,
		},
	},
	filter2Q: {
		defaultValue: 0,
		range: {
			min: 0,
			max: 100,
		},
	},
	/* VIBRATO */
	vibratoDepth: {
		defaultValue: 100,
		range: {
			min: 0,
			max: 100,
		},
	},
	vibratoFreq: {
		defaultValue: 50,
		range: {
			min: 0,
			max: 100,
		},
	},
	vibratoWet: {
		defaultValue: 0,
		range: {
			min: 0,
			max: 100,
		},
	},
	/* CHORUS */
	chorusSpread: {
		defaultValue: 180,
		range: {
			min: 0,
			max: 359,
		},
	},
	chorusDepth: {
		defaultValue: 50,
		range: {
			min: 0,
			max: 100,
		},
	},
	chorusDelay: {
		defaultValue: 0,
		range: {
			min: 0,
			max: 100,
		},
	},
	chorusFreq: {
		defaultValue: 0,
		range: {
			min: 0,
			max: 100,
		},
	},
	chorusType: {
		defaultValue: 0,
		range: {
			min: 0,
			max: OSC_SHAPES.length - 1,
		},
	},
	chorusWet: {
		defaultValue: 0,
		range: {
			min: 0,
			max: 100,
		},
	},
	/* BIT CRUSHER */
	crusherBits: {
		defaultValue: 4,
		range: {
			min: 1,
			max: 8,
		},
	},
	crusherWet: {
		defaultValue: 0,
		range: {
			min: 0,
			max: 100,
		},
	},
	/* DISTORTION */
	distOver: {
		defaultValue: 0,
		range: {
			min: 0,
			max: OVERSAMPLE_TYPES.length - 1,
		},
	},
	distAmount: {
		defaultValue: 50,
		range: {
			min: 0,
			max: 100,
		},
	},
	distWet: {
		defaultValue: 0,
		range: {
			min: 0,
			max: 100,
		},
	},
	/* FREQUENCY SHIFTER */
	freqShifterAmount: {
		defaultValue: 0,
		range: {
			min: 0,
			max: 100,
		},
	},
	freqShifterWet: {
		defaultValue: 0,
		range: {
			min: 0,
			max: 100,
		},
	},
	/* PITCHER */
	pitcherPitch: {
		defaultValue: 0,
		range: {
			min: -60,
			max: 60,
		},
	},
	pitcherWindow: {
		defaultValue: 100,
		range: {
			min: 0,
			max: 100,
		},
	},
	pitcherWet: {
		defaultValue: 0,
		range: {
			min: 0,
			max: 100,
		},
	},
	/* REVERB */
	reverbSize: {
		defaultValue: 50,
		range: {
			min: 0,
			max: 100,
		},
	},
	reverbDampening: {
		defaultValue: 50,
		range: {
			min: 0,
			max: 100,
		},
	},
	reverbWet: {
		defaultValue: 0,
		range: {
			min: 0,
			max: 100,
		},
	},
};

export const CONTROLS_NAMES: string[] = [];
export const CONTROLS_DEFAULT_VALUES: {[key: string]: number} = {};
Object.keys(CONTROLS).forEach((k) => {
	CONTROLS_NAMES.push(k);
	CONTROLS_DEFAULT_VALUES[k] = CONTROLS[k].defaultValue;
});
