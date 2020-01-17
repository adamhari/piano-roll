import React, { Component } from "react";
import { CONTROL_TYPES, CONTROLS, KEYS_MAP, LAYOUTS } from "./statics";
import Piano from "./components/Piano";
import Voice from "./Voice.js";

class PianoRoll extends Component {
  constructor(props) {
    super(props);

    this.octaves = props.octaves;

    if (!this.octaves || this.octaves > 10 || !Number.isInteger(this.octaves)) {
      this.octaves = 4;
    }

    this.state = {
      octaves: this.octaves,
      layout: 1,
      layoutMap: LAYOUTS["major"],
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
    };

    this.initializeSoundEngine();
    this.registerEvents();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.hasUserGestured) this.resumeAudioContext();
  }

  registerEvents = () => {
    document.addEventListener("keydown", this.handleKeyboardKeyDown);
    document.addEventListener("keyup", this.handleKeyboardKeyUp);

    document.addEventListener('mouseleave', this.handleMouseLeave);
    document.addEventListener('mouseout', this.handleMouseOut);
    document.addEventListener("mousedown", this.handleMouseDown);
    document.addEventListener("mouseup", this.handleMouseUp);

    document.addEventListener("drag", e => e.preventDefault());
    document.addEventListener("dragend", e => e.preventDefault());
    document.addEventListener("dragenter", e => e.preventDefault());
    document.addEventListener("dragexit", e => e.preventDefault());
    document.addEventListener("dragleave", e => e.preventDefault());
    document.addEventListener("dragover", e => e.preventDefault());
    document.addEventListener("dragstart", e => e.preventDefault());
    document.addEventListener("drop", e => e.preventDefault());
  };

  initializeSoundEngine = () => {
    console.log("initializeSoundEngine");

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();
    this.masterGain = this.audioContext.createGain();
    this.destination = this.audioContext.destination;
    this.masterGain.connect(this.destination);

    this.initializeVoices();
  };

  initializeVoices = () => {
    console.log("initializeVoices");

    this.voices = {};
    Object.keys(KEYS_MAP).forEach(key => {
      this.voices[key] = new Voice(this.audioContext, KEYS_MAP[key].freq);
    });
  };

  resumeAudioContext = () => {
    console.log("resumeAudioContext");

    this.audioContext.resume();
  };

  resetControlState = () => {
    console.log("resetControlState");

    this.setState({
      activeControl: null,
      alternateControl: false
    });
  };

  startPlayingKey = key => {
    console.log("startPlayingKey", KEYS_MAP[key]);

    if (!this.voices[key].active)
      this.voices[key].start(
        this.state.gain,
        this.state.shape,
        this.state.octave,
        this.state.transpose
      );
  };

  stopPlayingKey = key => {
    console.log("stopPlayingKey", KEYS_MAP[key]);

    if (this.voices[key]) {
      this.voices[key].stop();
      // delete this.voices[key];
    }
  };

  stopPlayingKeys = () => {
    console.log("stopPlayingKeys");

    Object.keys(this.voices).forEach(key => {
      this.voices[key].stop();
      // delete this.voices[key];
    });
  };

  handleKeyboardKeyDown = e => {
    console.log("handleKeyboardKeyDown", e);

    const keyPressed = e.key.toLowerCase();
    const pianoKey = this.state.layoutMap[keyPressed];
    if (pianoKey) this.activateKey(pianoKey);

    if (keyPressed === "control" || keyPressed === "command")
      this.setState({ alternateControl: true });
  };

  handleKeyboardKeyUp = e => {
    console.log("handleKeyboardKeyUp", e);

    const keyReleased = e.key.toLowerCase();

    if (keyReleased === "control" || keyReleased === "command")
      this.setState({ alternateControl: false });

    const pianoKey = this.state.layoutMap[keyReleased];
    this.deactivateKey(pianoKey);
  };

  handleMouseDown = e => {
    console.log("handleMouseDown", e);

    !this.state.hasUserGestured && this.setState({ hasUserGestured: true });
  };

  handleMouseUp = e => {
    console.log("handleMouseUp", e);

    this.resetControlState();
    this.state.mouseDownOnKey && this.stopPlayingKeys();
  };

  handleMouseLeave = e => {
    // console.log("handleMouseLeave", e);

    // this.deactivateKeys();
    // this.handleMouseUpControl();
  };

  handleMouseOut = e => {
    // console.log("handleMouseOut", e);

    // this.deactivateKeys();
  };

  handleMouseDownKey = e => {
    console.log("handleMouseDownKey", e);

    this.setState({ mouseDownOnKey: true });
    this.activateKey(e.target.title);
  };

  handleMouseUpKey = e => {
    console.log("handleMouseUpKey", e);

    this.setState({ mouseDownOnKey: false });
    this.deactivateKeys();
  };

  handleMouseOverKey = e => {
    // console.log("handleMouseOverKey", e);

    if (this.state.mouseDownOnKey)
      this.setState({ activeKeys: [e.target.title] });
  };

  activateKey = key => {
    console.log("activateKey", key);

    const activeKeys = this.state.activeKeys;

    this.startPlayingKey(key);

    if (!activeKeys.includes(key)) {
      activeKeys.push(key);
      this.setState({ activeKeys });
    }
  };

  deactivateKey = key => {
    console.log("deactivateKey", key);

    this.stopPlayingKey(key);
    const activeKeys = this.state.activeKeys;

    for (var i = activeKeys.length - 1; i >= 0; i--) {
      if (activeKeys[i] === key) {
        activeKeys.splice(i, 1);
        break;
      }
    }
    this.setState({ activeKeys });
  };

  deactivateKeys = (e = null) => {
    console.log("deactivateKeys", e);

    if (e) e.preventDefault();

    this.setState({ activeKeys: [] });
  };

  handleMouseDownControl = (activeControl, activeControlType, e) => {
    console.log("handleMouseDownControl", activeControl, activeControlType, e);

    document.addEventListener("mousemove", this.handleMouseMoveControl);

    if (this.state.alternateControl) {
      const newVal = CONTROLS[activeControl].defaultValue;
      const newState = { ...this.state };
      newState[activeControl] = newVal;
      this.setState(newState);
    } else {
      this.setState({
        activeControl,
        activeControlType,
        activeScreenY: e.screenY
      });
    }
  };

  handleMouseUpControl = (activeControl, e) => {
    console.log("handleMouseUpControl", activeControl, e);

    document.removeEventListener("mousemove", this.handleMouseMoveControl);

    this.setState({ activeControl: null });
  };

  handleMouseMoveControl = event => {
    // console.log("handleMouseMove", event);

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
        pixelStep *= 10;
      }

      const movement = Math.abs(event.screenY - activeScreenY) * valueStep;
      let change = 0;
      if (event.screenY - pixelStep > activeScreenY) {
        change = Math.round(-movement / pixelStep);
      } else if (event.screenY + pixelStep < activeScreenY) {
        change = Math.round(movement / pixelStep);
      }

      // console.log(change);

      if (change !== 0) {
        const newState = { ...this.state };

        const min = CONTROLS[this.state.activeControl].range.min;
        const max = CONTROLS[this.state.activeControl].range.max;

        let newVal = newState[this.state.activeControl] + change;

        if (newVal > max) newVal = max;
        else if (newVal < min) newVal = min;

        newState[activeControl] = newVal;
        newState["activeScreenY"] = event.screenY;

        this.setState(newState, () => this.initializeVoices());
      }
    }
  };

  changeLayout = layout => {
    console.log("changeLayout", layout);

    this.setState({ layout });
  };

  changeShape = shape => {
    console.log("changeShape", shape);

    this.setState({ shape });
  };

  changeOctave = octave => {
    console.log("changeOctave", octave);

    this.setState({ octave });
  };

  changeTransposition = transpose => {
    console.log("changeTransposition", transpose);

    this.setState({ transpose });
  };

  render() {
    return (
      <div id="pr-container">
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
    );
  }
}

export default PianoRoll;
