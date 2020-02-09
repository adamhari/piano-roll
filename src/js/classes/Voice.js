import {FREQ_MULTIPLIER, OSC_SHAPES} from '../statics';

export default class Voice {
	constructor(
		audioContext,
		frequency,
		attack = 1,
		decay = 1,
		sustain = 1,
		release = 1,
		osc1Shape = 0,
		osc1Octave = 5,
		osc1Transpose = 0,
		osc1Detune = 0,
		osc1Gain = 1,
		osc2Shape = 0,
		osc2Octave = 5,
		osc2Transpose = 0,
		osc2Detune = 0,
		osc2Gain = 1
	) {
		this.audioContext = audioContext;
		this.frequency = frequency;
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

		this.oscillators = [];
		this.active = false;

		this.initializeOscillators();
	}

	initializeOscillators = () => {
		this.osc1GainNode = this.audioContext.createGain();
		this.osc1GainNode.gain.value = 0;
		this.osc1GainNode.connect(this.audioContext.effectChain);
		this.osc1 = this.audioContext.createOscillator();
		this.osc1.type = this.getOsc1Shape();
		this.osc1.frequency.value = this.getOsc1Frequency();
		this.osc1.detune.value = this.getOsc1Detune();
		this.osc1.connect(this.osc1GainNode);
		this.osc1.start();

		this.osc2GainNode = this.audioContext.createGain();
		this.osc2GainNode.gain.value = 0;
		this.osc2GainNode.connect(this.audioContext.effectChain);
		this.osc2 = this.audioContext.createOscillator();
		this.osc2.type = this.getOsc2Shape();
		this.osc2.frequency.value = this.getOsc2Frequency();
		this.osc2.detune.value = this.getOsc2Detune();
		this.osc2.connect(this.osc2GainNode);
		this.osc2.start();

		this.oscillators.push(this.osc1);
		this.oscillators.push(this.osc2);

		console.log(this.oscillators);
	};

	start = () => {
		this.active = true;

		this.osc1GainNode.gain.exponentialRampToValueAtTime(this.getOsc1Gain(), this.getAttack());
		this.osc2GainNode.gain.exponentialRampToValueAtTime(this.getOsc2Gain(), this.getAttack());
		this.osc1GainNode.gain.exponentialRampToValueAtTime(
			this.getOsc1Gain() * this.getSustain(),
			this.getDecay()
		);
		this.osc2GainNode.gain.exponentialRampToValueAtTime(
			this.getOsc2Gain() * this.getSustain(),
			this.getDecay()
		);
	};

	stop = () => {
		this.active = false;

		this.osc1GainNode.gain.cancelScheduledValues(this.audioContext.currentTime);
		this.osc2GainNode.gain.cancelScheduledValues(this.audioContext.currentTime);
		this.osc1GainNode.gain.exponentialRampToValueAtTime(0.001, this.getRelease());
		this.osc2GainNode.gain.exponentialRampToValueAtTime(0.001, this.getRelease());
	};

	getAttack = () => this.audioContext.currentTime + this.attack / 100;
	getDecay = () => this.getAttack() + this.decay / 100;
	getSustain = () => this.sustain / 100;
	getRelease = () => this.audioContext.currentTime + this.release / 100;

	getOscShape = shape => OSC_SHAPES[shape];
	getOsc1Shape = () => this.getOscShape(this.osc1Shape);
	getOsc2Shape = () => this.getOscShape(this.osc2Shape);

	getOscFrequency = (octave, transpose) => {
		const octavedFrequency = (this.frequency * Math.pow(2, octave)) / 16;
		return octavedFrequency * Math.pow(FREQ_MULTIPLIER, transpose);
	};
	getOsc1Frequency = () => this.getOscFrequency(this.osc1Octave, this.osc1Transpose);
	getOsc2Frequency = () => this.getOscFrequency(this.osc2Octave, this.osc2Transpose);

	getOscDetune = detune => detune;
	getOsc1Detune = () => this.getOscDetune(this.osc1Detune);
	getOsc2Detune = () => this.getOscDetune(this.osc2Detune);

	getOscGain = gain => gain / 100;
	getOsc1Gain = () => this.getOscGain(this.osc1Gain);
	getOsc2Gain = () => this.getOscGain(this.osc2Gain);
}
