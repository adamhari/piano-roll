import {Filter, FMSynth, Master, PolySynth} from 'tone';
import {FILTER_TYPES, OSC_SHAPES} from '../statics';
import {
	getDecibelsFromValue,
	getFrequencyFromValue,
	getHarmonicityFromValue,
	getModulationDepthFromValue,
	getNoteFromValues,
	getSecondsFromValue
} from '../utils';

export default class Output {
	constructor(
		audioContext,
		volume,
		polyphony,
		attack,
		decay,
		sustain,
		release,
		osc1Shape,
		osc1Octave,
		osc1Transpose,
		osc1Detune,
		osc1Gain,
		osc2Shape,
		osc2Octave,
		osc2Transpose,
		osc2Detune,
		osc2Gain,
		modOscShape,
		modOscGain,
		modOscFreq,
		filter1Type,
		filter1Freq,
		filter1Q,
		filter2Type,
		filter2Freq,
		filter2Q
	) {
		this._active = false;

		this._audioContext = audioContext;
		this._volume = volume;
		this._polyphony = polyphony;
		this._attack = attack;
		this._decay = decay;
		this._sustain = sustain;
		this._release = release;
		this._osc1Shape = osc1Shape;
		this._osc1Octave = osc1Octave;
		this._osc1Transpose = osc1Transpose;
		this._osc1Detune = osc1Detune;
		this._osc1Gain = osc1Gain;
		this._osc2Shape = osc2Shape;
		this._osc2Octave = osc2Octave;
		this._osc2Transpose = osc2Transpose;
		this._osc2Detune = osc2Detune;
		this._osc2Gain = osc2Gain;
		this._modOscShape = modOscShape;
		this._modOscGain = modOscGain;
		this._modOscFreq = modOscFreq;
		this._filter1Type = filter1Type;
		this._filter1Freq = filter1Freq;
		this._filter1Q = filter1Q;
		this._filter2Type = filter2Type;
		this._filter2Freq = filter2Freq;
		this._filter2Q = filter2Q;

		this.initializeMaster();
		this.initializeFilters();
		this.initializeOscillators();
		this.initializeValues();
	}

	initializeMaster = () => {
		this.master = Master;
	};

	initializeFilters = () => {
		this.filter1 = new Filter(this.filter1Freq, this.filter1Type, -12);
		this.filter2 = new Filter(this.filter2Freq, this.filter2Type, -12);
		this.filter1.connect(this.filter2);
		this.filter2.connect(this.master);
	};

	initializeOscillators = () => {
		this.osc1 = new PolySynth(this.polyphony, FMSynth);
		this.osc2 = new PolySynth(this.polyphony, FMSynth);
		this.oscillators = [this.osc1, this.osc2];
		this.oscillators.forEach(o => {
			o.connect(this.filter1);
		});
	};

	initializeValues = () => {
		this.audioContext = this._audioContext;
		this.envelope = null;
		this.volume = this._volume;
		this.polyphony = this._polyphony;
		this.attack = this._attack;
		this.decay = this._decay;
		this.sustain = this._sustain;
		this.release = this._release;
		this.osc1Shape = this._osc1Shape;
		this.osc1Octave = this._osc1Octave;
		this.osc1Transpose = this._osc1Transpose;
		this.osc1Detune = this._osc1Detune;
		this.osc1Gain = this._osc1Gain;
		this.osc2Shape = this._osc2Shape;
		this.osc2Octave = this._osc2Octave;
		this.osc2Transpose = this._osc2Transpose;
		this.osc2Detune = this._osc2Detune;
		this.osc2Gain = this._osc2Gain;
		this.modOscShape = this._modOscShape;
		this.modOscGain = this._modOscGain;
		this.modOscFreq = this._modOscFreq;
		this.filter1Type = this._filter1Type;
		this.filter1Freq = this._filter1Freq;
		this.filter1Q = this._filter1Q;
		this.filter2Type = this._filter2Type;
		this.filter2Freq = this._filter2Freq;
		this.filter2Q = this._filter2Q;

		this.freqs = [];
	};

	playKey = freq => {
		console.log('playKey', freq);

		this.playKeys([freq]);
	};

	playKeys = (freqs = []) => {
		console.log('playKey', freqs);

		freqs.forEach(freq => {
			const activeOsc1Freq = getNoteFromValues(freq, this._osc1Octave, this._osc1Transpose);
			const activeOsc2Freq = getNoteFromValues(freq, this._osc2Octave, this._osc2Transpose);
			this.osc1.triggerAttack(activeOsc1Freq, this._audioContext.now(), 1);
			this.osc2.triggerAttack(activeOsc2Freq, this._audioContext.now(), 1);
			this.freqs.push(freq);
		});
	};

	stopKey = freq => {
		console.log('stopKey', freq);

		const activeOsc1Freq = getNoteFromValues(freq, this._osc1Octave, this._osc1Transpose);
		const activeOsc2Freq = getNoteFromValues(freq, this._osc2Octave, this._osc2Transpose);
		this.osc1.triggerRelease(activeOsc1Freq, this.audioContext.now());
		this.osc2.triggerRelease(activeOsc2Freq, this.audioContext.now());
		this.freqs.splice(this.freqs.indexOf(freq), 1);
	};

	stopKeys = () => {
		console.log('stopKeys');

		this.osc1.releaseAll();
		this.osc2.releaseAll();
		this.freqs = [];
	};

	retriggerKeys = () => {
		console.log('retriggerKeys');

		this.stoppedFreqs = this.freqs;
		this.stopKeys();
		this.playKeys(this.stoppedFreqs);
	};

	// GLOBAL

	get volume() {
		return getDecibelsFromValue(this._volume);
	}
	set volume(x) {
		this._volume = x;
		this.master.volume.value = this.volume;
	}

	get polyphony() {
		return this._polyphony;
	}
	set polyphony(x) {
		this._polyphony = x;
		this.initializeOscillators();
	}

	get envelope() {
		return {
			attackCurve: 'exponential',
			decayCurve: 'exponential',
			releaseCurve: 'exponential',
			attack: this.attack,
			decay: this.decay,
			sustain: this.sustain,
			release: this.release
		};
	}
	set envelope(x = null) {
		this.oscillators.forEach(o =>
			o.set({
				envelope: this.envelope,
				modulationEnvelope: this.envelope
			})
		);
	}

	get attack() {
		return getSecondsFromValue(this._attack);
	}
	set attack(x) {
		this._attack = x;
		this.oscillators.forEach(o => o.set({envelope: {attack: this.attack}}));
	}

	get decay() {
		return getSecondsFromValue(this._decay);
	}
	set decay(x) {
		this._decay = x;
		this.oscillators.forEach(o => o.set({envelope: {decay: this.decay}}));
	}

	get sustain() {
		return this._sustain / 100;
	}
	set sustain(x) {
		this._sustain = x;
		this.oscillators.forEach(o => o.set({envelope: {sustain: this.sustain}}));
	}

	get release() {
		return getSecondsFromValue(this._release);
	}
	set release(x) {
		this._release = x;
		this.oscillators.forEach(o => o.set({envelope: {release: this.release}}));
	}

	// OSC

	get osc1Shape() {
		return OSC_SHAPES[this._osc1Shape];
	}
	set osc1Shape(x) {
		this._osc1Shape = x;
		this.osc1.set({oscillator: {type: this.osc1Shape}});
	}

	get osc2Shape() {
		return OSC_SHAPES[this._osc2Shape];
	}
	set osc2Shape(x) {
		this._osc2Shape = x;
		this.osc2.set({oscillator: {type: this.osc2Shape}});
	}

	get osc1Octave() {
		return this._osc1Octave;
	}
	set osc1Octave(x) {
		this._osc1Octave = x;
		this.retriggerKeys();
	}

	get osc2Octave() {
		return this._osc2Octave;
	}
	set osc2Octave(x) {
		this._osc2Octave = x;
		this.retriggerKeys();
	}

	get osc1Transpose() {
		return this._osc1Transpose;
	}
	set osc1Transpose(x) {
		this._osc1Transpose = x;
		this.retriggerKeys();
	}

	get osc2Transpose() {
		return this._osc2Transpose;
	}
	set osc2Transpose(x) {
		this._osc2Transpose = x;
		this.retriggerKeys();
	}

	get osc1Detune() {
		return this._osc1Detune;
	}
	set osc1Detune(x) {
		this._osc1Detune = x;
		this.osc1.set('detune', this.osc1Detune);
	}

	get osc2Detune() {
		return this._osc2Detune;
	}
	set osc2Detune(x) {
		this._osc2Detune = x;
		this.osc2.set('detune', this.osc2Detune);
	}

	get osc1Gain() {
		return getDecibelsFromValue(this._osc1Gain);
	}
	set osc1Gain(x) {
		this._osc1Gain = x;
		this.osc1.set('volume', this.osc1Gain);
	}
	get osc2Gain() {
		return getDecibelsFromValue(this._osc2Gain);
	}
	set osc2Gain(x) {
		this._osc2Gain = x;
		this.osc2.set('volume', this.osc2Gain);
	}

	// MOD OSC

	get modOscShape() {
		return OSC_SHAPES[this._modOscShape];
	}
	set modOscShape(x) {
		this._modOscShape = x;
		this.oscillators.forEach(o => o.set({modulation: {type: this.modOscShape}}));
	}

	get modOscGain() {
		return getModulationDepthFromValue(this._modOscGain);
	}
	set modOscGain(x) {
		this._modOscGain = x;
		this.oscillators.forEach(o => o.set({modulationIndex: this.modOscGain}));
	}

	get modOscFreq() {
		return getHarmonicityFromValue(this._modOscFreq);
	}
	set modOscFreq(x) {
		this._modOscFreq = x;
		this.oscillators.forEach(o => o.set({harmonicity: this.modOscFreq}));
	}

	// FILTER

	get filter1Type() {
		return FILTER_TYPES[this._filter1Type];
	}
	set filter1Type(x) {
		this.filter1.type = this.filter1Type;
	}

	get filter2Type() {
		return FILTER_TYPES[this._filter2Type];
	}
	set filter2Type(x) {
		this.filter2.type = this.filter2Type;
	}

	get filter1Freq() {
		return getFrequencyFromValue(this._filter1Freq);
	}
	set filter1Freq(x) {
		this._filter1Freq = x;
		this.filter1.frequency.value = this.filter1Freq;
	}

	get filter2Freq() {
		return getFrequencyFromValue(this._filter2Freq);
	}
	set filter2Freq(x) {
		this._filter2Freq = x;
		this.filter2.frequency.value = this.filter2Freq;
	}

	get filter1Q() {
		return Math.pow(this._filter1Q, 3) / 10000;
	}
	set filter1Q(x) {
		this._filter1Q = x;
		this.filter1.Q.value = this.filter1Q;
	}

	get filter2Q() {
		return Math.pow(this._filter2Q, 3) / 10000;
	}
	set filter2Q(x) {
		this._filter2Q = x;
		this.filter2.Q.value = this.filter2Q;
	}

	set = (control, value) => {
		console.log(`setting ${control} to ${value}`);

		this[control] = value;
	};
}
