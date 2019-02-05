export default class Voice {

  constructor(frequency, audioContext){
    this.audioContext = audioContext;
    this.frequency = frequency;
    this.oscillators = [];
  };

  start = () => {
    /* VCO */
    var vco = this.audioContext.createOscillator();
    vco.type = "triangle";
    vco.frequency.value = this.frequency * 4;

    /* VCA */
    var vca = this.audioContext.createGain();
    vca.gain.value = 0.25;

    /* connections */
    vco.connect(vca);
    vca.connect(this.audioContext.destination);

    vco.start(0);

    this.oscillators.push(vco);
  };

  stop = () => {
    this.oscillators.forEach(osc => osc.stop());
  }

};