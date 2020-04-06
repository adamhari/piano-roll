import {
	BitCrusher,
	Buffer,
	Chorus,
	Distortion,
	Filter,
	Freeverb,
	FMSynth,
	Master,
	PitchShift,
	PolySynth,
	Sampler,
	Vibrato,
} from 'tone';
import {
	CONTROLS_NAMES,
	FILTER_ROLLOFFS,
	FILTER_TYPES,
	MODES,
	OSC_SHAPES,
	OVERSAMPLE_TYPES,
	SAMPLES,
} from '../statics';
import {
	getDecibelsFromValue,
	getFrequencyFromValue,
	getHarmonicityFromValue,
	getNoteFromValues,
	getSecondsFromValue,
} from '../utils';

export default class Output {
	constructor(
		app,
		audioContext,
		layout,
		volume,
		polyphony,
		portamento,
		attack,
		decay,
		sustain,
		release,
		mode,
		sample,
		samplePitch,
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
		filter1Rolloff,
		filter1Freq,
		filter1Q,
		filter2Type,
		filter2Rolloff,
		filter2Freq,
		filter2Q,
		vibratoDepth,
		vibratoFreq,
		vibratoWet,
		chorusSpread,
		chorusDepth,
		chorusDelay,
		chorusFreq,
		chorusType,
		chorusWet,
		crusherBits,
		crusherWet,
		distOver,
		distAmount,
		distWet,
		pitcherPitch,
		pitcherWindow,
		pitcherWet,
		reverbSize,
		reverbDampening,
		reverbWet
	) {
		this._active = false;
		this._app = app;
		this._audioContext = audioContext;

		CONTROLS_NAMES.forEach((n, i) => (this[`_${n}`] = arguments[i + 2]));

		this.initializeMaster();
		this.initializeReverb();
		this.initializePitcher();
		this.initializeDistortion();
		// this.initializeBitcrusher();
		this.initializeChorus();
		this.initializeVibrato();
		this.initializeFilters();
		this.initializeSampler();
		this.initializeOscillators();
		this.initializeValues();
	}

	initializeMaster = () => {
		this.master = Master;
	};

	initializeReverb = () => {
		this.reverb = new Freeverb();
		this.reverb.connect(this.master);
	};

	initializePitcher = () => {
		this.pitcher = new PitchShift();
		this.pitcher.connect(this.reverb);
	};

	initializeDistortion = () => {
		this.distortion = new Distortion();
		this.distortion.connect(this.pitcher);
	};

	initializeBitcrusher = () => {
		this.bitcrusher = new BitCrusher();
		this.bitcrusher.connect(this.distortion);
	};

	initializeChorus = () => {
		this.chorus = new Chorus();
		this.chorus.connect(this.distortion);
	};

	initializeVibrato = () => {
		this.vibrato = new Vibrato();
		this.vibrato.connect(this.chorus);
	};

	initializeFilters = () => {
		this.filter1 = new Filter(0, 'lowpass', -12);
		this.filter2 = new Filter(0, 'lowpass', -12);
		this.filter1.connect(this.filter2);
		this.filter2.connect(this.vibrato);
	};

	initializeSampler = () => {
		this.sampler = new Sampler(
			{
				C5: SAMPLES[0],
			},
			(e) => console.log('sampler buffers loaded: ', e)
			// './src/assets/audio/samples/'
		);
		this.sampler.connect(this.filter1);
	};

	initializeOscillators = () => {
		this.osc1 = new PolySynth(this.polyphony, FMSynth);
		this.osc2 = new PolySynth(this.polyphony, FMSynth);
		this.oscillators = [this.osc1, this.osc2];
		this.oscillators.forEach((o) => {
			o.connect(this.filter1);
		});
	};

	initializeValues = () => {
		CONTROLS_NAMES.forEach((n) => {
			if (n !== 'polyphony') {
				this[n] = this[`_${n}`];
			}
		});

		this.envelope = 'set';
		this.freqs = [];
	};

	playKey = (freq) => {
		// console.log('playKey', freq);

		this.playKeys([freq]);
	};

	playKeys = (freqs = []) => {
		// console.log('playKey', freqs);

		freqs.forEach((freq) => {
			this.freqs.push(freq);

			if (this.mode === MODES.SYNTH) {
				const activeOsc1Freq = getNoteFromValues(freq, this._osc1Octave, this._osc1Transpose);
				const activeOsc2Freq = getNoteFromValues(freq, this._osc2Octave, this._osc2Transpose);
				this.osc1.triggerAttack(activeOsc1Freq, this._audioContext.now(), 1);
				this.osc2.triggerAttack(activeOsc2Freq, this._audioContext.now(), 1);
			} else if (this.mode === MODES.SAMPLER && this.sampler.loaded) {
				this.sampler.triggerAttack(
					getNoteFromValues(freq, 6, this.samplePitch),
					this._audioContext.now(),
					1
				);
			}
		});
	};

	stopKey = (freq) => {
		// console.log('stopKey', freq);

		this.freqs.splice(this.freqs.indexOf(freq), 1);

		if (this.mode === MODES.SYNTH) {
			const activeOsc1Freq = getNoteFromValues(freq, this._osc1Octave, this._osc1Transpose);
			const activeOsc2Freq = getNoteFromValues(freq, this._osc2Octave, this._osc2Transpose);
			this.osc1.triggerRelease(activeOsc1Freq, this._audioContext.now());
			this.osc2.triggerRelease(activeOsc2Freq, this._audioContext.now());
		} else if (this.mode === MODES.SAMPLER) {
			this.sampler.triggerRelease(
				getNoteFromValues(freq, 6, this.samplePitch),
				this._audioContext.now()
			);
		}
	};

	stopKeys = () => {
		// console.log('stopKeys');

		this.osc1.releaseAll();
		this.osc2.releaseAll();
		this.sampler.releaseAll();
		this.freqs = [];
	};

	retriggerKeys = () => {
		// console.log('retriggerKeys');

		this.stoppedFreqs = this.freqs;
		this.stopKeys();
		this.playKeys(this.stoppedFreqs);
	};

	hasPortamento = () => this.portamento !== 0;

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
		this.initializeValues();
	}

	get portamento() {
		return this._portamento / 500;
	}
	set portamento(x) {
		this._portamento = x;
		this.oscillators.forEach((o) => o.set('portamento', this.portamento));
	}

	get envelope() {
		return {
			attackCurve: 'exponential',
			decayCurve: 'exponential',
			releaseCurve: 'exponential',
			attack: this.attack,
			decay: this.decay,
			sustain: this.sustain,
			release: this.release,
		};
	}
	set envelope(x = null) {
		this.oscillators.forEach((o) =>
			o.set({
				envelope: this.envelope,
				modulationEnvelope: this.envelope,
			})
		);
	}

	get attack() {
		return getSecondsFromValue(this._attack);
	}
	set attack(x) {
		this._attack = x;

		this.oscillators.forEach((o) => o.set({envelope: {attack: this.attack}}));
		this.sampler.attack = this.attack;
	}

	get decay() {
		return getSecondsFromValue(this._decay);
	}
	set decay(x) {
		this._decay = x;

		this.oscillators.forEach((o) => o.set({envelope: {decay: this.decay}}));
		this.sampler.decay = this.decay;
	}

	get sustain() {
		return this._sustain / 100;
	}
	set sustain(x) {
		this._sustain = x;

		this.oscillators.forEach((o) => o.set({envelope: {sustain: this.sustain}}));
		this.sampler.sustain = this.sustain;
	}

	get release() {
		return getSecondsFromValue(this._release);
	}
	set release(x) {
		this._release = x;
		this.oscillators.forEach((o) => o.set({envelope: {release: this.release}}));
		this.sampler.release = this.release;
	}

	get mode() {
		return this._mode;
	}
	set mode(x) {
		this._mode = x;
		this.stopKeys();
	}

	// SAMPLER

	get sample() {
		return SAMPLES[this._sample] || this._sample;
	}
	set sample(x) {
		this._sample = x;

		this._app.setState({
			sampleLoaded: false,
			sampleLoading: true,
		});

		const sampleBuffer = new Buffer(
			this.sample,
			() => {
				console.log('buffer loaded');
				this.sampler.add('C5', sampleBuffer, () => {
					console.log('sample loaded');
					this._app.setState({
						sampleLoaded: true,
						sampleLoading: false,
					});
				});
			},
			(e) => {
				console.log('error loading sample: ', e);
				this._app.setState({
					sampleLoaded: false,
					sampleLoading: false,
				});
			}
		);
	}

	get samplePitch() {
		return this._samplePitch;
	}
	set samplePitch(x) {
		this._samplePitch = x;
		this.retriggerKeys();
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
		this.oscillators.forEach((o) => o.set({modulation: {type: this.modOscShape}}));
	}

	get modOscFreq() {
		return getHarmonicityFromValue(this._modOscFreq);
	}
	set modOscFreq(x) {
		this._modOscFreq = x;
		this.oscillators.forEach((o) => o.set({harmonicity: this.modOscFreq}));
	}

	get modOscGain() {
		return this._modOscGain;
	}
	set modOscGain(x) {
		this._modOscGain = x;
		this.oscillators.forEach((o) => o.set({modulationIndex: this.modOscGain}));
	}

	// FILTER

	get filter1Type() {
		return FILTER_TYPES[this._filter1Type];
	}
	set filter1Type(x) {
		this._filter1Type = x;
		this.filter1.type = this.filter1Type;
	}

	get filter2Type() {
		return FILTER_TYPES[this._filter2Type];
	}
	set filter2Type(x) {
		this._filter2Type = x;
		this.filter2.type = this.filter2Type;
	}

	get filter1Rolloff() {
		return FILTER_ROLLOFFS[this._filter1Rolloff];
	}
	set filter1Rolloff(x) {
		this._filter1Rolloff = x;
		this.filter1.rolloff = this.filter1Rolloff;
	}

	get filter2Rolloff() {
		return FILTER_ROLLOFFS[this._filter2Rolloff];
	}
	set filter2Rolloff(x) {
		this._filter2Rolloff = x;
		this.filter2.rolloff = this.filter2Rolloff;
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
		return Math.pow(this._filter1Q, 2) / 250;
	}
	set filter1Q(x) {
		this._filter1Q = x;
		this.filter1.Q.value = this.filter1Q;
	}

	get filter2Q() {
		return Math.pow(this._filter2Q, 2) / 250;
	}
	set filter2Q(x) {
		this._filter2Q = x;
		this.filter2.Q.value = this.filter2Q;
	}

	// VIBRATO

	get vibratoDepth() {
		return this._vibratoDepth / 100;
	}
	set vibratoDepth(x) {
		this._vibratoDepth = x;
		this.vibrato.depth.value = this.vibratoDepth;
	}

	get vibratoFreq() {
		return this._vibratoFreq / 10;
	}
	set vibratoFreq(x) {
		this._vibratoFreq = x;
		this.vibrato.frequency.value = this.vibratoFreq;
	}

	get vibratoWet() {
		return this._vibratoWet / 100;
	}
	set vibratoWet(x) {
		this._vibratoWet = x;
		this.vibrato.wet.value = this.vibratoWet;
	}

	// CHORUS

	get chorusSpread() {
		return this._chorusSpread;
	}
	set chorusSpread(x) {
		this._chorusSpread = x;
		this.chorus.spread = this.chorusSpread;
	}

	get chorusDepth() {
		return this._chorusDepth / 100;
	}
	set chorusDepth(x) {
		this._chorusDepth = x;
		this.chorus.depth = this.chorusDepth;
	}

	get chorusDelay() {
		return this._chorusDelay;
	}
	set chorusDelay(x) {
		this._chorusDelay = x;
		this.chorus.delay = this.chorusDelay;
	}

	get chorusFreq() {
		return getSecondsFromValue(this._chorusFreq);
	}
	set chorusFreq(x) {
		this._chorusFreq = x;
		this.chorus.frequency.value = this.chorusFreq;
	}

	get chorusType() {
		return OSC_SHAPES[this._chorusType];
	}
	set chorusType(x) {
		this._chorusType = x;
		this.chorus.type = this.chorusType;
	}

	get chorusWet() {
		return this._chorusWet / 100;
	}
	set chorusWet(x) {
		this._chorusWet = x;
		this.chorus.wet.value = this.chorusWet;
	}

	// BITCRUSHER

	// get crusherBits() {
	// 	return this._crusherBits;
	// }
	// set crusherBits(x) {
	// 	this._crusherBits = x;
	// 	this.bitcrusher.bits = this.crusherBits;
	// }

	// get crusherWet() {
	// 	return this._crusherWet / 100;
	// }
	// set crusherWet(x) {
	// 	this._crusherWet = x;
	// 	this.bitcrusher.wet.value = this.crusherWet;
	// }

	// DISTORTION

	get distOver() {
		return OVERSAMPLE_TYPES[this._distOver];
	}
	set distOver(x) {
		this._distOver = x;
		this.distortion.oversample = this.distOver;
	}

	get distAmount() {
		return this._distAmount / 100;
	}
	set distAmount(x) {
		this._distAmount = x;
		this.distortion.distortion = this.distAmount;
	}

	get distWet() {
		return this._distWet / 100;
	}
	set distWet(x) {
		this._distWet = x;
		this.distortion.wet.value = this.distWet;
	}

	// PITCHER

	get pitcherPitch() {
		return this._pitcherPitch;
	}
	set pitcherPitch(x) {
		this._pitcherPitch = x;
		this.pitcher.pitch = this.pitcherPitch;
	}

	get pitcherWindow() {
		return this._pitcherWindow / 1000;
	}
	set pitcherWindow(x) {
		this._pitcherWindow = x;
		this.pitcher.windowSize = this.pitcherWindow;
	}

	get pitcherWet() {
		return this._pitcherWet / 100;
	}
	set pitcherWet(x) {
		this._pitcherWet = x;
		this.pitcher.wet.value = this.pitcherWet;
	}

	// REVERB

	get reverbSize() {
		return this._reverbSize / 100;
	}
	set reverbSize(x) {
		this._reverbSize = x;
		this.reverb.roomSize.value = this.reverbSize;
	}

	get reverbDampening() {
		return getFrequencyFromValue(this._reverbDampening);
	}
	set reverbDampening(x) {
		this._reverbDampening = x;
		this.reverb.dampening.value = this.reverbDampening;
	}

	get reverbWet() {
		return this._reverbWet / 100;
	}
	set reverbWet(x) {
		this._reverbWet = x;
		this.reverb.wet.value = this.reverbWet;
	}

	set = (control, value) => {
		console.log(`setting ${control} to ${value}`);

		this[control] = value;
	};
}
