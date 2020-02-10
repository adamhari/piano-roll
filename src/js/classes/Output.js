import {Filter, Master, PolySynth, Synth} from 'tone';
import {FILTER_TYPES, FREQ_MULTIPLIER, KEYS, OSC_SHAPES} from '../statics';
import {getDecibelsFromValue, getFrequencyFromValue, getSetterFromString} from '../utils';

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
		filter1Type,
		filter1Freq,
		filter1Q,
		filter2Type,
		filter2Freq,
		filter2Q
	) {
		this.active = false;

		this.audioContext = audioContext;
		this.volume = volume;
		this.polyphony = polyphony;
		this.attack = attack;
		this.decay = decay;
		this.sustain = sustain;
		this.release = release;
		this.osc1Shape = osc1Shape;
		this.osc1Octave = osc1Octave;
		this.osc1Transpose = osc1Transpose;
		this.osc1Detune = osc1Detune;
		this.osc1Gain = osc1Gain;
		this.osc2Shape = osc2Shape;
		this.osc2Octave = osc2Octave;
		this.osc2Transpose = osc2Transpose;
		this.osc2Detune = osc2Detune;
		this.osc2Gain = osc2Gain;
		this.filter1Type = filter1Type;
		this.filter1Freq = filter1Freq;
		this.filter1Q = filter1Q;
		this.filter2Type = filter2Type;
		this.filter2Freq = filter2Freq;
		this.filter2Q = filter2Q;

		this.initializeMaster();
		this.setVolume();

		this.initializeFilters();
		this.initializeOscillators();
	}

	initializeMaster = () => {
		this.master = Master;
	};

	initializeFilters = () => {
		this.filter1 = new Filter(this.getFilterFreq(1), this.getFilterType(1), -12);
		this.setFilter1Q();
		this.filter2 = new Filter(this.getFilterFreq(2), this.getFilterType(2), -12);
		this.setFilter2Q();
		this.filter1.connect(this.filter2);
		this.filter2.connect(this.master);
	};

	initializeOscillators = () => {
		this.osc1 = new PolySynth(this.getPolyphony(), Synth);
		this.setOsc1Shape();
		this.osc2 = new PolySynth(this.getPolyphony(), Synth);
		this.setOsc2Shape();
		this.oscillators = [this.osc1, this.osc2];
		this.setEnvelope();
		this.oscillators.forEach(o => {
			o.connect(this.filter1);
		});
	};

	startPlayingKey = freq => {
		console.log('startPlayingKey', freq);

		this.osc1.triggerAttack(this.getOscFreq(1, freq), this.audioContext.now(), 1);
		this.osc2.triggerAttack(this.getOscFreq(2, freq), this.audioContext.now(), 1);
	};

	stopPlayingKey = freq => {
		console.log('stopPlayingKey', freq);

		this.osc1.triggerRelease(this.getOscFreq(1, freq), this.audioContext.now());
		this.osc2.triggerRelease(this.getOscFreq(2, freq), this.audioContext.now());
	};

	// GLOBAL

	getVolume = () => getDecibelsFromValue(this.volume);
	setVolume = () => (this.master.volume.value = this.getVolume());

	getPolyphony = () => this.polyphony;
	setPolyphony = () => this.initializeOscillators();

	getEnvelope = () => ({
		attackCurve: 'exponential',
		decayCurve: 'exponential',
		releaseCurve: 'exponential',
		attack: this.getAttack(),
		decay: this.getDecay(),
		sustain: this.getSustain(),
		release: this.getRelease()
	});
	setEnvelope = () => {
		this.oscillators.forEach(o => o.set({envelope: this.getEnvelope()}));
	};

	getAttack = () => this.attack / 100 || 0.01;
	setAttack = value => {
		this.oscillators.forEach(o => o.set({envelope: {attack: this.getAttack()}}));
	};

	getDecay = () => this.decay / 100 || 0.01;
	setDecay = value => {
		this.oscillators.forEach(o => o.set({envelope: {decay: this.getDecay()}}));
	};

	getSustain = () => this.sustain / 100 || 0.01;
	setSustain = value => {
		this.oscillators.forEach(o => o.set({envelope: {sustain: this.getSustain()}}));
	};

	getRelease = () => this.release / 100 || 0.01;
	setRelease = value => {
		this.oscillators.forEach(o => o.set({envelope: {release: this.getRelease()}}));
	};

	// OSC

	getOscFreq = (i, freq) => {
		const octave = this[`osc${i}Octave`];
		const transpose = this[`osc${i}Transpose`];
		const octavedFrequency = (freq * Math.pow(2, octave)) / 16;
		return octavedFrequency * Math.pow(FREQ_MULTIPLIER, transpose);
	};

	getOscShape = i => {
		const value = this[`osc${i}Shape`];
		return OSC_SHAPES[value];
	};
	setOscShape = i => this[`osc${i}`].set({oscillator: {type: this.getOscShape(i)}});
	setOsc1Shape = () => this.setOscShape(1);
	setOsc2Shape = () => this.setOscShape(2);

	getOscDetune = i => this[`osc${i}Detune`];
	setOscDetune = i => this[`osc${i}`].set('detune', this.getOscDetune(i));
	setOsc1Detune = () => this.setOscDetune(1);
	setOsc2Detune = () => this.setOscDetune(2);

	getOscGain = i => getDecibelsFromValue(this[`osc${i}Gain`]);
	setOscGain = i => this[`osc${i}`].set('volume', this.getOscGain(i));
	setOsc1Gain = () => this.setOscGain(1);
	setOsc2Gain = () => this.setOscGain(2);

	// FILTER

	getFilterType = i => {
		const value = this[`filter${i}Type`];
		return FILTER_TYPES[value];
	};
	setFilterType = i => (this[`filter${i}`].type = this.getFilterType(i));
	setFilter1Type = () => this.setFilterType(1);
	setFilter2Type = () => this.setFilterType(2);

	getFilterFreq = i => {
		const value = this[`filter${i}Freq`];
		return getFrequencyFromValue(value);
	};
	setFilterFreq = i => (this[`filter${i}`].frequency.value = this.getFilterFreq(i));
	setFilter1Freq = () => this.setFilterFreq(1);
	setFilter2Freq = () => this.setFilterFreq(2);

	getFilterQ = i => {
		const value = this[`filter${i}Q`];
		return Math.pow(value, 3) / 10000;
	};
	setFilterQ = i => (this[`filter${i}`].Q.value = this.getFilterQ(i));
	setFilter1Q = () => this.setFilterQ(1);
	setFilter2Q = () => this.setFilterQ(2);

	set = (control, value) => {
		console.log(control);

		this[control] = value;
		const setter = getSetterFromString(control);
		this[setter] && this[setter]();
	};
}
