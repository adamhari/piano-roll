import React, { Component } from "react";
import {
  CONTROL_TYPES,
  CONTROLS,
  KEYS_MAP,
  LAYOUTS,
} from "./statics";
import Piano from "./components/Piano";
import Voice from "./Voice.js";

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
      gain: CONTROLS["gain"].defaultValue,
      shape: CONTROLS["shape"].defaultValue,
      transpose: CONTROLS["transpose"].defaultValue,
      octave: CONTROLS["octave"].defaultValue,
      master: CONTROLS["master"].defaultValue,
      mouseDownOnKey: false
    }

    this.initializeSoundEngine();
    this.registerEvents();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.hasUserGestured)
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
      if (this.state.mouseDownOnKey)
        this.stopPlayingKeys();
    });

    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mousedown', () => {
      if (!this.state.hasUserGestured)
        this.setState({ hasUserGestured: true });
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
    this.masterGain = this.audioContext.createGain();
    this.destination = this.audioContext.destination;
    this.masterGain.connect(this.destination);

    this.generateVoices();
  }

  generateVoices = () => {
    this.voices = {};
    Object.keys(KEYS_MAP).forEach(key => {
      this.voices[key] = new Voice(this.audioContext, KEYS_MAP[key].freq);
    });
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
    // console.log("START " + KEYS_MAP[key].freq);

    if (!this.voices[key].active)
      this.voices[key].start(
        this.state.gain,
        this.state.shape,
        this.state.octave,
        this.state.transpose
      );
  }

  stopPlayingKey = (key) => {
    if (this.voices[key]) {
      this.voices[key].stop();
      // delete this.voices[key];
    }
  }

  stopPlayingKeys = () => {
    Object.keys(this.voices).forEach((key) => {
      this.voices[key].stop()
      // delete this.voices[key];
    });
  }

  handleKeyboardKeyDown = (e) => {
    // console.log(e);

    const computerKey = e.key.toLowerCase();
    const pianoKey = this.state.layoutMap[computerKey];
    if (pianoKey)
      this.activateKey(pianoKey)

    if (computerKey === "control" || computerKey === "command")
      this.setState({ alternateControl: true });
  }

  handleKeyboardKeyUp = (e) => {
    // console.log(e);
    const computerKey = e.key.toLowerCase();

    if (computerKey === "control" || computerKey === "command")
      this.setState({ alternateControl: false });

    const pianoKey = this.state.layoutMap[computerKey];
    this.deactivateKey(pianoKey);
  }

  handleMouseDownKey = (e) => {
    this.setState({ mouseDownOnKey: true });
    this.activateKey(e.target.title)
  };

  handleMouseUpKey = (e) => {
    this.setState({ mouseDownOnKey: false });
    this.deactivateKeys()
  };

  handleMouseOverKey = (e) => {
    if (this.state.mouseDownOnKey)
      this.setState({ activeKeys: [e.target.title] })
  }

  activateKey = (key) => {
    const activeKeys = this.state.activeKeys;

    this.startPlayingKey(key);

    if (!activeKeys.includes(key)) {
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
    if (this.state.alternateControl) {
      const newVal = CONTROLS[activeControl].defaultValue;
      const newState = { ...this.state }
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

      if (alternateControl) {
        pixelStep *= 8;
      }

      const movement = Math.abs(event.screenY - activeScreenY) * valueStep;
      let change = 0;
      if ((event.screenY - pixelStep) > activeScreenY) {
        change = Math.round(-movement / pixelStep);
      } else if ((event.screenY + pixelStep) < activeScreenY) {
        change = Math.round(movement / pixelStep);
      }


      // console.log(change);


      if (change !== 0) {
        const newState = { ...this.state };

        const min = CONTROLS[this.state.activeControl].range.min;
        const max = CONTROLS[this.state.activeControl].range.max;

        let newVal = newState[this.state.activeControl] + change;

        if (newVal > max)
          newVal = max;
        else if (newVal < min)
          newVal = min;

        newState[activeControl] = newVal;
        newState["activeScreenY"] = event.screenY;

        this.setState(newState, () => this.generateVoices());
      }
    }
  }

  changeLayout = (layout) => {
    this.setState({ layout })
  }

  changeShape = (shape) => {
    this.setState({ shape });
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
          octaves={this.state.octaves}
          layout={this.state.layout}

          gain={this.state.gain}
          shape={this.state.shape}
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
