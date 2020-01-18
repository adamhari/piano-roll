import React, { Component } from "react";
import { CONTROL_TYPES, CONTROLS, KEYS_MAP, LAYOUTS } from "./js/statics";
import Piano from "./components/Piano";
import Voice from "./js/classes/Voice";

class App extends Component {

  /** LIFECYCLE */

  constructor(props) {
    super(props);

    this.layout = props.layout || 0;
    this.octaves = props.octaves;
    this.voices = {};

    if (!this.octaves || this.octaves > 10 || !Number.isInteger(this.octaves)) {
      this.octaves = 4;
    }

    this.state = {
      audioContextStarted: false,
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
  }

  componentDidMount = () => {
    this.initializeSoundEngine();
    this.registerEvents();
  }

  /** INIT */

  registerEvents = () => {
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);

    document.addEventListener("mousedown", this.handleMouseDown);
    document.addEventListener("mouseup", this.handleMouseUp);
    document.addEventListener("mouseleave", this.handleMouseLeave);
    document.addEventListener("mouseout", this.handleMouseOut);

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

    console.log("LATENCY", this.audioContext.baseLatency, this.audioContext.outputLatency)

    // console.log("initializeVoices");

    // Object.keys(KEYS_MAP).forEach(key => {
    //   this.voices[key] = new Voice(this.audioContext, KEYS_MAP[key].freq);
    // });
  };

  startAudioContext = () => {
    console.log("startAudioContext");

    if (!this.state.audioContextStarted) {
      this.audioContext.resume();
      this.setState({audioContextStarted: true});
    }
  };

  /** GLOBAL EVENT HANDLERS */

  handleKeyDown = e => {
    console.log("handleKeyDown", e);

    const keyPressed = e.key.toLowerCase();
    const pianoKey = LAYOUTS[this.state.layout][keyPressed];
    !!pianoKey && this.activatePianoKey(pianoKey);

    if (keyPressed === "control" || keyPressed === "command")
      this.setState({ alternateControl: true });

    this.startAudioContext();
  };

  handleKeyUp = e => {
    console.log("handleKeyUp", e);

    const keyReleased = e.key.toLowerCase();

    if (keyReleased === "control" || keyReleased === "command")
      this.setState({ alternateControl: false });

    const pianoKey = LAYOUTS[this.state.layout][keyReleased];
    this.deactivatePianoKey(pianoKey);
  };

  handleMouseDown = e => {
    console.log("handleMouseDown", e);

    this.startAudioContext();
  };

  handleMouseUp = e => {
    console.log("handleMouseUp", e);

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

  /** PIANO KEYS */

  handleMouseDownPianoKey = e => {
    console.log("handleMouseDownPianoKey", e);

    if (e.button === 0) {
      this.activatePianoKey(e.target.title);
      this.mouseDownOnKeys = true;
    }
  };

  handleMouseUpPianoKey = e => {
    console.log("handleMouseUpPianoKey", e);

    if (e.button === 0) {
      this.mouseDownOnKeys = false;
      this.deactivatePianoKey(e.target.title);
    }
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

    if (!this.state.activeKeys.includes(key)) {
      this.startPlayingKey(key);
      this.setState(prevState => ({
        activeKeys: [...prevState.activeKeys, key]
      }));
    }
  };

  deactivatePianoKey = key => {
    console.log("deactivatePianoKey", key);

    this.stopPlayingKey(key);

    this.setState(prevState => ({
      activeKeys: prevState.activeKeys.filter(k => k !== key)
    }));
  };

  deactivatePianoKeys = (e = null) => {
    console.log("deactivatePianoKeys", e);

    e && e.preventDefault();

    this.setState({ activeKeys: [] });
  };

  startPlayingKey = key => {
    console.log("startPlayingKey", KEYS_MAP[key]);

    this.voices[key] = new Voice(
      this.audioContext,
      KEYS_MAP[key].freq,
      this.state.gain,
      this.state.shape,
      this.state.octave,
      this.state.transpose
    );
  };

  stopPlayingKey = key => {
    console.log("stopPlayingKey", KEYS_MAP[key]);

    this.voices[key] && this.voices[key].stop();
  };

  stopPlayingKeys = () => {
    console.log("stopPlayingKeys");

    Object.keys(this.voices).forEach(key => this.voices[key].stop());
  };

  /** SYNTH CONTROLS */

  handleMouseDownControl = (activeControl, activeControlType, e) => {
    console.log("handleMouseDownControl", activeControl, activeControlType, e);

    if (e.button === 0) {
      // left click
      if (this.state.alternateControl) {
        // holding ctrl
        this.resetControlValue(activeControl);
      } else {
        this.activateControl(activeControl, activeControlType, e.screenY);
      }
    }
  };

  handleMouseUpControl = (activeControl, e) => {
    console.log("handleMouseUpControl", activeControl, e);

    if (e.button === 0) {
      this.deactivateControl(activeControl);
    }
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
        newState["activeScreenY"] = event.screenY;
        this.setState(newState);
        this.changeControlValue(activeControl, change);
      }
    }
  };

  activateControl = (activeControl, activeControlType, screenY) => {
    console.log("activateControl", activeControl, activeControlType, screenY);

    document.addEventListener("mousemove", this.handleMouseMoveControl);

    this.setState({
      activeControl,
      activeControlType,
      activeScreenY: screenY
    });
  }

  deactivateControl = (activeControl) => {
    console.log("deactiveControl", activeControl);

    document.removeEventListener("mousemove", this.handleMouseMoveControl);

    this.setState({ activeControl: null });
  };

  changeControlValue = (control, change) => {
    // console.log("changeControlValue", control, change);

    const newState = { ...this.state };

    const minValue = CONTROLS[control].range.min;
    const maxValue = CONTROLS[control].range.max;

    let newVal = newState[control] + change;

    if (newVal > maxValue) newVal = maxValue;
    else if (newVal < minValue) newVal = minValue;

    newState[control] = newVal;

    this.setState(newState);
  };

  resetControlValue = (control) => {
    const newState = { ...this.state };
    const newVal = CONTROLS[control].defaultValue;
    newState[control] = newVal;

    this.setState(newState);
  };

  render() {
    console.log("State:", this.state);

    return (
      <div id="pr-container" onContextMenu={(e) => {e.preventDefault()}}>
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
