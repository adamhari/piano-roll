import { FREQ_MULTIPLIER, OSC_SHAPES } from "../statics";

export default class Voice {

  constructor(
    audioContext,
    frequency,
    gain,
    shape,
    octave,
    transpose,
    attack = 1,
    decay = 1,
    sustain = 1,
    release = 1
  ) {
    this.active = false;
    this.audioContext = audioContext;
    this.frequency = frequency;
    this.gain = gain;
    this.shape = shape;
    this.octave = octave;
    this.transpose = transpose;
    this.attack = attack;
    this.decay = decay;
    this.sustain = sustain;
    this.release = release;

    this.oscillators = [];

    this.initializeOscillators();
  }

  initializeOscillators = () => {
    this.osc1Gain = this.audioContext.createGain();
    this.osc1Gain.gain.value = this.getGain();
    this.osc1Gain.connect(this.audioContext.effectChain);
    this.osc1 = this.audioContext.createOscillator();
    this.osc1.frequency.value = this.getFrequency(); //* Math.pow(2, octave);
    this.osc1.type = this.getOscType();
    this.osc1.connect(this.osc1Gain);


    this.oscillators.push(this.osc1);
  };

  start = () => {
    this.active = true;

    const now = this.audioContext.currentTime;
    const attack = now + this.release / 1000;

    this.osc1.start(attack);
  };

  stop = () => {
    this.active = false;

    const now = this.audioContext.currentTime;
    const release = now + this.release / 1000;

    this.osc1.stop(release);
  };

  getFrequency = () => {
    const octavedFrequency = this.frequency * Math.pow(2, this.octave);
    const transposedFrequency = octavedFrequency * Math.pow(FREQ_MULTIPLIER, this.transpose);
    return transposedFrequency;
  };

  getGain = () => this.gain / 100;

  getOscType = () => OSC_SHAPES[this.shape];
}
