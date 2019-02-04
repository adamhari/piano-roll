import React, { Component } from "react";
import {
  CONTROL_TYPES,
  CONTROLS,
  KEYS_MAP,
  LAYOUTS,
} from "./statics";
import Piano from "./components/Piano";

class PianoRoll extends Component {
  constructor(props) {
    super(props);

    this.octaves = this.props.octaves;
    if (!this.octaves || this.octaves > 10 || !Number.isInteger(this.octaves))
      this.octaves = 4;

    this.state = {
      octaves: this.octaves,
      layout: 1,
      layoutMap: LAYOUTS['major'],
      hasUserGestured: false,
      alternateControl: false,
      activeKeys: [],
      activeControl: null,
      activeControlType: null,
      transpose: CONTROLS["transpose"].defaultValue,
      octave: CONTROLS["octave"].defaultValue,
      master:CONTROLS["master"].defaultValue,
      mouseDown: false
    }

    this.registerEvents();
    this.initializeSoundEngine();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.hasUserGestured && this.state.hasUserGestured)
      this.resumeAudioContext();
  }

  registerEvents = () => {
    document.addEventListener('keydown', this.handleKeyboardKeyDown);
    document.addEventListener('keyup', this.handleKeyboardKeyUp);

    // document.addEventListener('mouseleave', () => {
    //   this.deactivateKeys();
    //   this.handleMouseUpControl();
    // });
    // document.addEventListener('mouseout', () => {
    //   this.deactivateKeys();
    // });
    document.addEventListener('mouseup', () => {
      this.resetControlState();
    });

    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mousedown', () => {
      if (!this.state.hasUserGestured)
        this.setState({hasUserGestured:true});
    });

    document.addEventListener('drag', (e) => e.preventDefault());
    document.addEventListener('dragend', (e) => e.preventDefault());
    document.addEventListener('dragenter', (e) => e.preventDefault());
    document.addEventListener('dragexit', (e) => e.preventDefault());
    document.addEventListener('dragleave', (e) => e.preventDefault());
    document.addEventListener('dragover', (e) => e.preventDefault());
    document.addEventListener('dragstart', (e) => e.preventDefault());
    document.addEventListener('drop', (e) => e.preventDefault());
  }


  initializeSoundEngine = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();

    this.osc1 = this.audioContext.createOscillator();
    this.osc1.type = "sawtooth";

    this.osc1Gain = this.audioContext.createGain(0);
    this.osc1Gain.gain.value = 0;
    this.osc1.connect(this.osc1Gain);

    this.osc1Attack = this.osc1Decay = this.osc1Release = 0.05;
    this.osc1Sustain = 1;
    
    this.masterGain = this.audioContext.createGain();
    this.destination = this.audioContext.destination;

    this.osc1Gain.connect(this.masterGain);
    this.masterGain.connect(this.destination);
    this.osc1.start(0);
  }

  resumeAudioContext = () => {
    this.audioContext.resume();
  }

  resetControlState = () => {
    this.setState({
      activeControl: null,
      alternateControl: false
    })
  }

  startPlayingKey = (key) => {
    console.log("START " + KEYS_MAP[key].freq, this.osc1Gain);

    const now = this.audioContext.currentTime;
    this.osc1.frequency.setValueAtTime(KEYS_MAP[key].freq.toFixed(2) * 4, now);
    this.osc1Gain.gain.linearRampToValueAtTime(1, now + this.osc1Attack);
    // this.osc1Gain.gain.linearRampToValueAtTime(this.osc1Sustain, now + this.osc1Attack + this.osc1Decay);
  }

  stopPlayingKey = (key) => {
    console.log("STOP " + key)

    const now = this.audioContext.currentTime;
    this.osc1Gain.gain.linearRampToValueAtTime(0, now + this.osc1Release);
  }

  handleKeyboardKeyDown = (e) => {
    // console.log(e);
    if (!this.state.hasUserGestured)
        this.setState({hasUserGestured:true});

    const computerKey = e.key.toLowerCase();

    if (computerKey === "control" || computerKey === "command")
      this.setState({alternateControl: true});

    const pianoKey = this.state.layoutMap[computerKey];
    if (pianoKey)
      this.activateKey(pianoKey);
  }

  handleKeyboardKeyUp = (e) => {
    // console.log(e);
    const computerKey = e.key.toLowerCase();

    if (computerKey === "control" || computerKey === "command")
      this.setState({alternateControl: false});

    const pianoKey = this.state.layoutMap[computerKey];
    this.deactivateKey(pianoKey);
  }

  handleMouseDownKey = (e) => {
    this.setState({ mouseDown: true });
    this.activateKey(e.target.title)
  };

  handleMouseUpKey = (e) => {
    this.setState({ mouseDown: false });
    this.deactivateKeys()
  };

  handleMouseOverKey = (e) => {
    if (this.state.mouseDown)
      this.setState({ activeKeys: [e.target.title] })
  }

  activateKey = (key) => {
    const activeKeys = this.state.activeKeys;

    if (!activeKeys.includes(key)){
      this.startPlayingKey(key);
      activeKeys.push(key);
      this.setState({ activeKeys });
    }
  }

  deactivateKey = (key) => {
    this.stopPlayingKey(key);
    const activeKeys = this.state.activeKeys;

    for (var i = activeKeys.length - 1; i >= 0; i--) {
      if (activeKeys[i] === key) {
        activeKeys.splice(i, 1);
        break;
      }
    }
    this.setState({ activeKeys });
  }

  deactivateKeys = (e = null) => {
    if (e)
      e.preventDefault()

    this.setState({ activeKeys: [] });
  }

  handleMouseDownControl = (activeControl, activeControlType, e) => {
    if (this.state.alternateControl){
      const newVal = CONTROLS[activeControl].defaultValue;
      const newState = {...this.state}
      newState[activeControl] = newVal;
      this.setState(newState);
    } else {
      this.setState({
        activeControl,
        activeControlType,
        activeScreenY: e.screenY
      })
    }
  }

  handleMouseUpControl = (activeControl, e) => {
    this.setState({ activeControl: null })
  }

  handleMouseMove = (event) => {
    const {
      alternateControl,
      activeControl,
      activeControlType,
      activeScreenY
    } = this.state;

    if (activeControl) {
      let pixelStep = CONTROL_TYPES[activeControlType].pixelStep || 5;
      let valueStep = CONTROL_TYPES[activeControlType].valueStep || 1;

      if (alternateControl){
        pixelStep = pixelStep * 8;
        valueStep = 1;
      }
        
      let change = 0;
      if ((event.screenY - pixelStep) > activeScreenY)
        change = -valueStep;
      else if ((event.screenY + pixelStep) < activeScreenY)
        change = valueStep;

      if (change !== 0) {
        const newState = {...this.state};
        const newVal = newState[this.state.activeControl] + change;

        const min = CONTROLS[this.state.activeControl].range.min;
        const max = CONTROLS[this.state.activeControl].range.max;

        if (newVal >= min && newVal <= max){
          newState[activeControl] = newVal;
          newState["activeScreenY"] = event.screenY;
          this.setState(newState);
        }
      }
    }
  }

  changeLayout = (layout) => {
    this.setState({ layout })
  }

  changeOctave = (octave) => {
    this.setState({ octave })
  }

  changeTransposition = (transpose) => {
    this.setState({ transpose })
  }


  render() {
    return (
      <div
        id="pr-container"
      >
        <Piano
          layout={this.state.layout}
          octaves={this.state.octaves}
          transpose={this.state.transpose}
          octave={this.state.octave}

          master={this.state.master}

          activeKeys={this.state.activeKeys}
          activeControl={this.state.activeControl}

          handleMouseDownKey={this.handleMouseDownKey}
          handleMouseUpKey={this.handleMouseUpKey}
          handleMouseOverKey={this.handleMouseOverKey}

          handleMouseDownControl={this.handleMouseDownControl}
          handleMouseUpControl={this.handleMouseUpControl}
        />
      </div>
    )
  }
}

export default PianoRoll;
