import {CONTROLS, OSC_SHAPES} from "./statics";

export default class Voice {

  constructor(
    audioContext, 
    frequency
    ){
    this.audioContext = audioContext;
    this.frequency = frequency;

    this.vco = this.audioContext.createOscillator();
    this.vco.frequency.value = this.frequency //* Math.pow(2, octave);

    this.vca = this.audioContext.createGain();
    this.vca.gain.value = 0;
    this.vco.connect(this.vca);
    this.vca.connect(this.audioContext.destination);

    this.oscillators = [];
    this.oscillators.push(this.vco);
    this.vco.start();

    this.active = false;
    this.setParams();
  };

  setParams = (
    gain = CONTROLS["gain"].defaultValue,
    shape = CONTROLS["shape"].defaultValue,
    octave = CONTROLS["octave"].defaultValue, 
    transpose = CONTROLS["transpose"].defaultValue
    ) => {
    this.gain = gain;
    this.vco.type = OSC_SHAPES[shape];
  }

  start = () => {
    this.active = true;
    this.vca.gain.exponentialRampToValueAtTime(1, this.audioContext.currentTime + 5);
  };

  stop = () => {
    this.active = false;
  }
};