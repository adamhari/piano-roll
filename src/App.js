import React, { Component } from "react";
import { CONTROL_TYPES, CONTROLS, KEYS_MAP, LAYOUTS } from "./statics";
import Piano from "./components/Piano";
import Voice from "./Voice.js";

class App extends Component {

  constructor(props) {
    super(props);

    this.layout = props.layout || 0;
    this.octaves = props.octaves;

    if (!this.octaves || this.octaves > 10 || !Number.isInteger(this.octaves)) {
      this.octaves = 4;
    }

    this.state = {
      hasUserGestured: false,
      octaves: this.octaves,
      layout: this.layout,
      activeKeys: [],
      activeControl: null,
      activeControlType: null,
      activeScreenY: null,
      alternateControl: false,
      gain: CONTROLS["gain"].defaultValue,
      shape: CONTROLS["shape"].defaultValue,
      transpose: CONTROLS["transpose"].defaultValue,
      octave: CONTROLS["octave"].defaultValue,
      master: CONTROLS["master"].defaultValue
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

    document.addEventListener("mouseleave", this.handleMouseLeave);
    document.addEventListener("mouseout", this.handleMouseOut);
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
    const pianoKey = LAYOUTS[this.state.layout][keyPressed];
    !!pianoKey && this.activatePianoKey(pianoKey);

    if (keyPressed === "control" || keyPressed === "command")
      this.setState({ alternateControl: true });
  };

  handleKeyboardKeyUp = e => {
    console.log("handleKeyboardKeyUp", e);

    const keyReleased = e.key.toLowerCase();

    if (keyReleased === "control" || keyReleased === "command")
      this.setState({ alternateControl: false });

    const pianoKey = LAYOUTS[this.state.layout][keyReleased];
    this.deactivatePianoKey(pianoKey);
  };

  handleMouseDown = e => {
    console.log("handleMouseDown", e);

    !this.state.hasUserGestured && this.setState({ hasUserGestured: true });
  };

  handleMouseUp = e => {
    console.log("handleMouseUp", e);

    this.state.activeKeys.length > 0 && this.stopPlayingKeys();
    this.mouseDownOnKeys = false;
    this.state.activeControl && this.setState({
      activeControl: null,
      alternateControl: false
    });
  };

  handleMouseLeave = e => {
    // console.log("handleMouseLeave", e);
    // this.deactivatePianoKeys();
    // this.handleMouseUpControl();
  };

  handleMouseOut = e => {
    // console.log("handleMouseOut", e);
    // this.deactivatePianoKeys();
  };

  handleMouseDownPianoKey = e => {
    console.log("handleMouseDownPianoKey", e);

    this.activatePianoKey(e.target.title);
    this.mouseDownOnKeys = true;
  };

  handleMouseUpPianoKey = e => {
    console.log("handleMouseUpPianoKey", e);

    this.mouseDownOnKeys = false;
    this.deactivatePianoKey(e.target.title);
  };

  handleMouseOverPianoKey = e => {
    // console.log("handleMouseOverPianoKey", e);

    this.mouseDownOnKeys && this.activatePianoKey(e.target.title);
  };

  handleMouseLeavePianoKey = e => {
    // console.log("handleMouseLeavePianoKey", e);

    this.mouseDownOnKeys && this.deactivatePianoKey(e.target.title);
  };

  activatePianoKey = key => {
    console.log("activatePianoKey", key);

    const { activeKeys } = this.state;

    if (!activeKeys.includes(key)) {
      this.startPlayingKey(key);
      this.setState(prevState => ({
        activeKeys: [...prevState.activeKeys, key]
      }));
    }
  };

  deactivatePianoKey = key => {
    console.log("deactivatePianoKey", key);

    this.stopPlayingKey(key);
    const activeKeys = [...this.state.activeKeys];

    for (var i = activeKeys.length - 1; i >= 0; i--) {
      if (activeKeys[i] === key) {
        activeKeys.splice(i, 1);
        break;
      }
    }

    this.setState({ activeKeys });
  };

  deactivatePianoKeys = (e = null) => {
    console.log("deactivatePianoKeys", e);

    e && e.preventDefault();

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

        const minValue = CONTROLS[this.state.activeControl].range.min;
        const maxValue = CONTROLS[this.state.activeControl].range.max;

        let newVal = newState[this.state.activeControl] + change;

        if (newVal > maxValue) newVal = maxValue;
        else if (newVal < minValue) newVal = minValue;

        newState[activeControl] = newVal;
        newState["activeScreenY"] = event.screenY;

        this.setState(newState);
      }
    }
  };

  handleChangeLayout = layout => {
    console.log("handleChangeLayout", layout);

    this.setState({ layout });
  };

  handleChangeShape = shape => {
    console.log("handleChangeShape", shape);

    this.setState({ shape });
  };

  handleChangeOctave = octave => {
    console.log("handleChangeOctave", octave);

    this.setState({ octave });
  };

  handleChangeTransposition = transpose => {
    console.log("handleChangeTransposition", transpose);

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
          handleMouseDownPianoKey={this.handleMouseDownPianoKey}
          handleMouseUpPianoKey={this.handleMouseUpPianoKey}
          handleMouseOverPianoKey={this.handleMouseOverPianoKey}
          handleMouseLeavePianoKey={this.handleMouseLeavePianoKey}
          handleMouseDownControl={this.handleMouseDownControl}
          handleMouseUpControl={this.handleMouseUpControl}
        />
      </div>
    );
  }
}

export default App;
