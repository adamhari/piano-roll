"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tone_1 = require("tone");
var statics_1 = require("../statics");
var utils_1 = require("../utils");
var Output = /** @class */ (function () {
    function Output(app, audioContext, layout, volume, polyphony, portamento, attack, decay, sustain, release, mode, sample, samplePitch, osc1Shape, osc1Octave, osc1Transpose, osc1Detune, osc1Gain, osc2Shape, osc2Octave, osc2Transpose, osc2Detune, osc2Gain, modOscShape, modOscGain, modOscFreq, filter1Type, filter1Rolloff, filter1Freq, filter1Q, filter2Type, filter2Rolloff, filter2Freq, filter2Q, vibratoDepth, vibratoFreq, vibratoWet, crusherBits, crusherWet, distOver, distAmount, distWet, pitcherPitch, pitcherWindow, pitcherWet, reverbSize, reverbDampening, reverbWet) {
        var _this = this;
        this.initializeMaster = function () {
            _this.master = tone_1.Master;
        };
        this.initializeReverb = function () {
            _this.reverb = new tone_1.Freeverb();
            _this.reverb.connect(_this.master);
        };
        this.initializePitcher = function () {
            _this.pitcher = new tone_1.PitchShift();
            _this.pitcher.connect(_this.reverb);
        };
        this.initializeDistortion = function () {
            _this.distortion = new tone_1.Distortion();
            _this.distortion.connect(_this.pitcher);
        };
        this.initializeBitcrusher = function () {
            _this.bitcrusher = new tone_1.BitCrusher();
            _this.bitcrusher.connect(_this.distortion);
        };
        this.initializeChorus = function () {
            _this.chorus = new tone_1.Chorus();
            _this.chorus.connect(_this.distortion);
        };
        this.initializeVibrato = function () {
            _this.vibrato = new tone_1.Vibrato();
            _this.vibrato.connect(_this.chorus);
        };
        this.initializeFilters = function () {
            _this.filter1 = new tone_1.Filter(0, 'lowpass', -12);
            _this.filter2 = new tone_1.Filter(0, 'lowpass', -12);
            _this.filter1.connect(_this.filter2);
            _this.filter2.connect(_this.vibrato);
        };
        this.initializeSampler = function () {
            _this.sampler = new tone_1.Sampler({
                C5: statics_1.SAMPLES[0]
            }, function (e) { return console.log('sampler buffers loaded: ', e); }
            // './src/assets/audio/samples/'
            );
            _this.sampler.connect(_this.filter1);
        };
        this.initializeOscillators = function () {
            _this.osc1 = new tone_1.PolySynth(_this.polyphony, tone_1.FMSynth);
            _this.osc2 = new tone_1.PolySynth(_this.polyphony, tone_1.FMSynth);
            _this.oscillators = [_this.osc1, _this.osc2];
            _this.oscillators.forEach(function (o) {
                o.connect(_this.filter1);
            });
        };
        this.initializeValues = function () {
            statics_1.CONTROLS_NAMES.forEach(function (n) {
                if (n !== 'polyphony') {
                    _this[n] = _this["_" + n];
                }
            });
            _this.envelope = 'set';
            _this.freqs = [];
        };
        this.playKey = function (freq) {
            // console.log('playKey', freq);
            _this.playKeys([freq]);
        };
        this.playKeys = function (freqs) {
            // console.log('playKey', freqs);
            if (freqs === void 0) { freqs = []; }
            freqs.forEach(function (freq) {
                _this.freqs.push(freq);
                if (_this.mode === statics_1.MODES.SYNTH) {
                    var activeOsc1Freq = utils_1.getNoteFromValues(freq, _this._osc1Octave, _this._osc1Transpose);
                    var activeOsc2Freq = utils_1.getNoteFromValues(freq, _this._osc2Octave, _this._osc2Transpose);
                    _this.osc1.triggerAttack(activeOsc1Freq, _this._audioContext.now(), 1);
                    _this.osc2.triggerAttack(activeOsc2Freq, _this._audioContext.now(), 1);
                }
                else if (_this.mode === statics_1.MODES.SAMPLER && _this.sampler.loaded) {
                    _this.sampler.triggerAttack(utils_1.getNoteFromValues(freq, 6, _this.samplePitch), _this._audioContext.now(), 1);
                }
            });
        };
        this.stopKey = function (freq) {
            // console.log('stopKey', freq);
            _this.freqs.splice(_this.freqs.indexOf(freq), 1);
            if (_this.mode === statics_1.MODES.SYNTH) {
                var activeOsc1Freq = utils_1.getNoteFromValues(freq, _this._osc1Octave, _this._osc1Transpose);
                var activeOsc2Freq = utils_1.getNoteFromValues(freq, _this._osc2Octave, _this._osc2Transpose);
                _this.osc1.triggerRelease(activeOsc1Freq, _this._audioContext.now());
                _this.osc2.triggerRelease(activeOsc2Freq, _this._audioContext.now());
            }
            else if (_this.mode === statics_1.MODES.SAMPLER) {
                _this.sampler.triggerRelease(utils_1.getNoteFromValues(freq, 6, _this.samplePitch), _this._audioContext.now());
            }
        };
        this.stopKeys = function () {
            // console.log('stopKeys');
            _this.osc1.releaseAll();
            _this.osc2.releaseAll();
            _this.sampler.releaseAll();
            _this.freqs = [];
        };
        this.retriggerKeys = function () {
            // console.log('retriggerKeys');
            _this.stoppedFreqs = _this.freqs;
            _this.stopKeys();
            _this.playKeys(_this.stoppedFreqs);
        };
        this.hasPortamento = function () { return _this.portamento !== 0; };
        this.set = function (control, value) {
            console.log("setting " + control + " to " + value);
            _this[control] = value;
        };
        this._active = false;
        this._app = app;
        this._audioContext = audioContext;
        statics_1.CONTROLS_NAMES.forEach(function (n, i) { return (_this["_" + n] = arguments[i + 2]); });
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
    Object.defineProperty(Output.prototype, "volume", {
        // GLOBAL
        get: function () {
            return utils_1.getDecibelsFromValue(this._volume);
        },
        set: function (x) {
            this._volume = x;
            this.master.volume.value = this.volume;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "polyphony", {
        get: function () {
            return this._polyphony;
        },
        set: function (x) {
            this._polyphony = x;
            this.initializeOscillators();
            this.initializeValues();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "portamento", {
        get: function () {
            return this._portamento / 500;
        },
        set: function (x) {
            var _this = this;
            this._portamento = x;
            this.oscillators.forEach(function (o) { return o.set('portamento', _this.portamento); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "envelope", {
        get: function () {
            return {
                attackCurve: 'exponential',
                decayCurve: 'exponential',
                releaseCurve: 'exponential',
                attack: this.attack,
                decay: this.decay,
                sustain: this.sustain,
                release: this.release
            };
        },
        set: function (x) {
            var _this = this;
            if (x === void 0) { x = null; }
            this.oscillators.forEach(function (o) {
                return o.set({
                    envelope: _this.envelope,
                    modulationEnvelope: _this.envelope
                });
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "attack", {
        get: function () {
            return utils_1.getSecondsFromValue(this._attack);
        },
        set: function (x) {
            var _this = this;
            this._attack = x;
            this.oscillators.forEach(function (o) { return o.set({ envelope: { attack: _this.attack } }); });
            this.sampler.attack = this.attack;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "decay", {
        get: function () {
            return utils_1.getSecondsFromValue(this._decay);
        },
        set: function (x) {
            var _this = this;
            this._decay = x;
            this.oscillators.forEach(function (o) { return o.set({ envelope: { decay: _this.decay } }); });
            this.sampler.decay = this.decay;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "sustain", {
        get: function () {
            return this._sustain / 100;
        },
        set: function (x) {
            var _this = this;
            this._sustain = x;
            this.oscillators.forEach(function (o) { return o.set({ envelope: { sustain: _this.sustain } }); });
            this.sampler.sustain = this.sustain;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "release", {
        get: function () {
            return utils_1.getSecondsFromValue(this._release);
        },
        set: function (x) {
            var _this = this;
            this._release = x;
            this.oscillators.forEach(function (o) { return o.set({ envelope: { release: _this.release } }); });
            this.sampler.release = this.release;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "mode", {
        get: function () {
            return this._mode;
        },
        set: function (x) {
            this._mode = x;
            this.stopKeys();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "sample", {
        // SAMPLER
        get: function () {
            return statics_1.SAMPLES[this._sample] || this._sample;
        },
        set: function (x) {
            var _this = this;
            this._sample = x;
            this._app.setState({
                sampleLoaded: false,
                sampleLoading: true
            });
            var sampleBuffer = new tone_1.Buffer(this.sample, function () {
                console.log('buffer loaded');
                _this.sampler.add('C5', sampleBuffer, function () {
                    console.log('sample loaded');
                    _this._app.setState({
                        sampleLoaded: true,
                        sampleLoading: false
                    });
                });
            }, function (e) {
                console.log('error loading sample: ', e);
                _this._app.setState({
                    sampleLoaded: false,
                    sampleLoading: false
                });
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "samplePitch", {
        get: function () {
            return this._samplePitch;
        },
        set: function (x) {
            this._samplePitch = x;
            this.retriggerKeys();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "osc1Shape", {
        // OSC
        get: function () {
            return statics_1.OSC_SHAPES[this._osc1Shape];
        },
        set: function (x) {
            this._osc1Shape = x;
            this.osc1.set({ oscillator: { type: this.osc1Shape } });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "osc2Shape", {
        get: function () {
            return statics_1.OSC_SHAPES[this._osc2Shape];
        },
        set: function (x) {
            this._osc2Shape = x;
            this.osc2.set({ oscillator: { type: this.osc2Shape } });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "osc1Octave", {
        get: function () {
            return this._osc1Octave;
        },
        set: function (x) {
            this._osc1Octave = x;
            this.retriggerKeys();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "osc2Octave", {
        get: function () {
            return this._osc2Octave;
        },
        set: function (x) {
            this._osc2Octave = x;
            this.retriggerKeys();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "osc1Transpose", {
        get: function () {
            return this._osc1Transpose;
        },
        set: function (x) {
            this._osc1Transpose = x;
            this.retriggerKeys();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "osc2Transpose", {
        get: function () {
            return this._osc2Transpose;
        },
        set: function (x) {
            this._osc2Transpose = x;
            this.retriggerKeys();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "osc1Detune", {
        get: function () {
            return this._osc1Detune;
        },
        set: function (x) {
            this._osc1Detune = x;
            this.osc1.set('detune', this.osc1Detune);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "osc2Detune", {
        get: function () {
            return this._osc2Detune;
        },
        set: function (x) {
            this._osc2Detune = x;
            this.osc2.set('detune', this.osc2Detune);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "osc1Gain", {
        get: function () {
            return utils_1.getDecibelsFromValue(this._osc1Gain);
        },
        set: function (x) {
            this._osc1Gain = x;
            this.osc1.set('volume', this.osc1Gain);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "osc2Gain", {
        get: function () {
            return utils_1.getDecibelsFromValue(this._osc2Gain);
        },
        set: function (x) {
            this._osc2Gain = x;
            this.osc2.set('volume', this.osc2Gain);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "modOscShape", {
        // MOD OSC
        get: function () {
            return statics_1.OSC_SHAPES[this._modOscShape];
        },
        set: function (x) {
            var _this = this;
            this._modOscShape = x;
            this.oscillators.forEach(function (o) { return o.set({ modulation: { type: _this.modOscShape } }); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "modOscFreq", {
        get: function () {
            return utils_1.getHarmonicityFromValue(this._modOscFreq);
        },
        set: function (x) {
            var _this = this;
            this._modOscFreq = x;
            this.oscillators.forEach(function (o) { return o.set({ harmonicity: _this.modOscFreq }); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "modOscGain", {
        get: function () {
            return this._modOscGain;
        },
        set: function (x) {
            var _this = this;
            this._modOscGain = x;
            this.oscillators.forEach(function (o) { return o.set({ modulationIndex: _this.modOscGain }); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "filter1Type", {
        // FILTER
        get: function () {
            return statics_1.FILTER_TYPES[this._filter1Type];
        },
        set: function (x) {
            this._filter1Type = x;
            this.filter1.type = this.filter1Type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "filter2Type", {
        get: function () {
            return statics_1.FILTER_TYPES[this._filter2Type];
        },
        set: function (x) {
            this._filter2Type = x;
            this.filter2.type = this.filter2Type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "filter1Rolloff", {
        get: function () {
            return statics_1.FILTER_ROLLOFFS[this._filter1Rolloff];
        },
        set: function (x) {
            this._filter1Rolloff = x;
            this.filter1.rolloff = this.filter1Rolloff;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "filter2Rolloff", {
        get: function () {
            return statics_1.FILTER_ROLLOFFS[this._filter2Rolloff];
        },
        set: function (x) {
            this._filter2Rolloff = x;
            this.filter2.rolloff = this.filter2Rolloff;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "filter1Freq", {
        get: function () {
            return utils_1.getFrequencyFromValue(this._filter1Freq);
        },
        set: function (x) {
            this._filter1Freq = x;
            this.filter1.frequency.value = this.filter1Freq;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "filter2Freq", {
        get: function () {
            return utils_1.getFrequencyFromValue(this._filter2Freq);
        },
        set: function (x) {
            this._filter2Freq = x;
            this.filter2.frequency.value = this.filter2Freq;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "filter1Q", {
        get: function () {
            return Math.pow(this._filter1Q, 2) / 250;
        },
        set: function (x) {
            this._filter1Q = x;
            this.filter1.Q.value = this.filter1Q;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "filter2Q", {
        get: function () {
            return Math.pow(this._filter2Q, 2) / 250;
        },
        set: function (x) {
            this._filter2Q = x;
            this.filter2.Q.value = this.filter2Q;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "vibratoDepth", {
        // VIBRATO
        get: function () {
            return this._vibratoDepth / 100;
        },
        set: function (x) {
            this._vibratoDepth = x;
            this.vibrato.depth.value = this.vibratoDepth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "vibratoFreq", {
        get: function () {
            return this._vibratoFreq / 10;
        },
        set: function (x) {
            this._vibratoFreq = x;
            this.vibrato.frequency.value = this.vibratoFreq;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "vibratoWet", {
        get: function () {
            return this._vibratoWet / 100;
        },
        set: function (x) {
            this._vibratoWet = x;
            this.vibrato.wet.value = this.vibratoWet;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "chorusSpread", {
        // CHORUS
        get: function () {
            return this._chorusSpread;
        },
        set: function (x) {
            this._chorusSpread = x;
            this.chorus.spread = this.chorusSpread;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "chorusDepth", {
        get: function () {
            return this._chorusDepth / 100;
        },
        set: function (x) {
            this._chorusDepth = x;
            this.chorus.depth = this.chorusDepth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "chorusDelay", {
        get: function () {
            return this._chorusDelay;
        },
        set: function (x) {
            this._chorusDelay = x;
            this.chorus.delay = this.chorusDelay;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "chorusWet", {
        get: function () {
            return this._chorusWet / 100;
        },
        set: function (x) {
            this._chorusWet = x;
            this.chorus.wet.value = this.chorusWet;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "distOver", {
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
        get: function () {
            return statics_1.OVERSAMPLE_TYPES[this._distOver];
        },
        set: function (x) {
            this._distOver = x;
            this.distortion.oversample = this.distOver;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "distAmount", {
        get: function () {
            return this._distAmount / 100;
        },
        set: function (x) {
            this._distAmount = x;
            this.distortion.distortion = this.distAmount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "distWet", {
        get: function () {
            return this._distWet / 100;
        },
        set: function (x) {
            this._distWet = x;
            this.distortion.wet.value = this.distWet;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "pitcherPitch", {
        // PITCHER
        get: function () {
            return this._pitcherPitch;
        },
        set: function (x) {
            this._pitcherPitch = x;
            this.pitcher.pitch = this.pitcherPitch;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "pitcherWindow", {
        get: function () {
            return this._pitcherWindow / 1000;
        },
        set: function (x) {
            this._pitcherWindow = x;
            this.pitcher.windowSize = this.pitcherWindow;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "pitcherWet", {
        get: function () {
            return this._pitcherWet / 100;
        },
        set: function (x) {
            this._pitcherWet = x;
            this.pitcher.wet.value = this.pitcherWet;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "reverbSize", {
        // REVERB
        get: function () {
            return this._reverbSize / 100;
        },
        set: function (x) {
            this._reverbSize = x;
            this.reverb.roomSize.value = this.reverbSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "reverbDampening", {
        get: function () {
            return utils_1.getFrequencyFromValue(this._reverbDampening);
        },
        set: function (x) {
            this._reverbDampening = x;
            this.reverb.dampening.value = this.reverbDampening;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "reverbWet", {
        get: function () {
            return this._reverbWet / 100;
        },
        set: function (x) {
            this._reverbWet = x;
            this.reverb.wet.value = this.reverbWet;
        },
        enumerable: true,
        configurable: true
    });
    return Output;
}());
exports.default = Output;
