import React, { useEffect, useRef, useState } from "react";
import { CONTROL_TYPES, CONTROLS, KEYS_MAP, LAYOUTS } from "./js/statics";
import Piano from "./components/Piano";
import Voice from "./js/classes/Voice";

const App = props => {

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContext = useRef(new AudioContext());
  const voices = {};

  const [hasUserGestured, setHasUserGestured] = useState(false);
  const [octaves, setOctaves] = useState(props.octaves || 4);
  const [mouseDownOnKeys, setMouseDownOnKeys] = useState(false);
  const [activeKeys, setActiveKeys] = useState([]);
  const [activeControl, setActiveControl] = useState(null);
  const [activeControlType, setActiveControlType] = useState(null);
  const [activeScreenY, setActiveScreenY] = useState(null);
  const [alternateControl, setAlternateControl] = useState(false);

  const [controls, setControls] = useState({
    layout: props.layout || 0,
    master: CONTROLS["master"].defaultValue,
    gain: CONTROLS["gain"].defaultValue,
    shape: CONTROLS["shape"].defaultValue,
    octave: CONTROLS["octave"].defaultValue,
    transpose: CONTROLS["transpose"].defaultValue
  });

  const {
    layout,
    master,
    gain,
    shape,
    octave,
    transpose
  } = controls;





  /** INIT */

  useEffect(() => {
    console.log("initializeSoundEngine");
    const masterGain = audioContext.current.createGain();
    const destination = audioContext.current.destination;
    masterGain.connect(destination);

    console.log("initializeVoices");
    Object.keys(KEYS_MAP).forEach(key => {
      voices[key] = new Voice(audioContext.current, KEYS_MAP[key].freq);
    });

    /** GLOBAL EVENT HANDLERS */

    document.addEventListener("keydown", e => {
      console.log("handleKeyDown", e);

      const keyPressed = e.key.toLowerCase();

      (keyPressed === "control" || keyPressed === "command") && setAlternateControl(true);
      const pianoKey = LAYOUTS[layout][keyPressed];
      !!pianoKey && activatePianoKey(pianoKey);
    });

    document.addEventListener("keyup", e => {
      console.log("handleKeyUp", e);

      const keyReleased = e.key.toLowerCase();

      (keyReleased === "control" || keyReleased === "command") && setAlternateControl(false);
      const pianoKey = LAYOUTS[layout][keyReleased];
      deactivatePianoKey(pianoKey);
    });

    document.addEventListener("mousedown", e => {
      console.log("handleMouseDown", e);

      !hasUserGestured && setHasUserGestured(true);
    });

    document.addEventListener("mouseup", e => {
      console.log("handleMouseUp", e);

      setMouseDownOnKeys(false);

      if (activeControl) {
        setActiveControl(null);
        setAlternateControl(false);
      }
    });

    document.addEventListener("mouseleave", e => {
      // console.log("handleMouseLeave", e);
      // deactivatePianoKeys();
      // handleMouseUpControl();
    });

    document.addEventListener("mouseout", e => {
      // console.log("handleMouseOut", e);
      // deactivatePianoKeys();
    });

    document.addEventListener("drag", e => e.preventDefault());
    document.addEventListener("dragend", e => e.preventDefault());
    document.addEventListener("dragenter", e => e.preventDefault());
    document.addEventListener("dragexit", e => e.preventDefault());
    document.addEventListener("dragleave", e => e.preventDefault());
    document.addEventListener("dragover", e => e.preventDefault());
    document.addEventListener("dragstart", e => e.preventDefault());
    document.addEventListener("drop", e => e.preventDefault());

    return () => {};
  }, []);

  useEffect(() => {
    audioContext.current && audioContext.current.resume();
    return () => {};
  }, [audioContext, hasUserGestured]);





  /** PIANO KEYS */

  const handleMouseDownPianoKey = e => {
    console.log("handleMouseDownPianoKey", e);

    if (e.button === 0) {
      activatePianoKey(e.target.title);
      setMouseDownOnKeys(true);
    }
  };

  const handleMouseUpPianoKey = e => {
    console.log("handleMouseUpPianoKey", e);

    if (e.button === 0) {
      setMouseDownOnKeys(false);
      deactivatePianoKey(e.target.title);
    }
  };

  const handleMouseOverPianoKey = e => {
    // console.log("handleMouseOverPianoKey", e);

    mouseDownOnKeys && activatePianoKey(e.target.title);
  };

  const handleMouseLeavePianoKey = e => {
    // console.log("handleMouseLeavePianoKey", e);

    mouseDownOnKeys && deactivatePianoKey(e.target.title);
  };

  const activatePianoKey = key => {
    console.log("activatePianoKey", key);

    if (!activeKeys.includes(key)) {
      startPlayingKey(key);
      setActiveKeys(prevActiveKeys => [...prevActiveKeys, key]);
    }
  };

  const deactivatePianoKey = key => {
    console.log("deactivatePianoKey", key);

    stopPlayingKey(key);
    setActiveKeys(prevActiveKeys => prevActiveKeys.filter(k => k !== key));
  };

  // const deactivatePianoKeys = (e = null) => {
  //   console.log("deactivatePianoKeys", e);

  //   e && e.preventDefault();

  //   setActiveKeys([]);
  // };

  const startPlayingKey = key => {
    console.log("startPlayingKey", KEYS_MAP[key]);

    if (voices[key] && !voices[key].active) {
      voices[key].start(gain, shape,octave, transpose);
    }
  };

  const stopPlayingKey = key => {
    console.log("stopPlayingKey", KEYS_MAP[key]);

    voices[key] && voices[key].stop();
  };

  // const stopPlayingKeys = () => {
  //   console.log("stopPlayingKeys");

  //   Object.keys(voices).forEach(key => voices[key].stop());
  // };





  /** SYNTH CONTROLS */

  const handleMouseDownControl = (activeControl, activeControlType, e) => {
    console.log("handleMouseDownControl", activeControl, activeControlType, e);

    if (e.button === 0) {
      // left click
      if (alternateControl) {
        // holding ctrl
        resetControlValue(activeControl);
      } else {
        activateControl(activeControl, activeControlType, e.screenY);
      }
    }
  };

  const handleMouseUpControl = (activeControl, e) => {
    console.log("handleMouseUpControl", activeControl, e);

    if (e.button === 0) {
      deactivateControl(activeControl);
    }
  };

  const handleMouseMoveControl = e => {
    // console.log("handleMouseMoveControl", e);

    if (activeControl) {
      let pixelStep = CONTROL_TYPES[activeControlType].pixelStep || 5;
      let valueStep = CONTROL_TYPES[activeControlType].valueStep || 1;

      if (alternateControl) {
        pixelStep *= 10;
      }

      const movement = Math.abs(e.screenY - activeScreenY) * valueStep;
      let change = 0;
      if (e.screenY - pixelStep > activeScreenY) {
        change = Math.round(-movement / pixelStep);
      } else if (e.screenY + pixelStep < activeScreenY) {
        change = Math.round(movement / pixelStep);
      }

      // console.log(change);

      if (change !== 0) {
        setActiveScreenY(e.screenY);
        changeControlValue(activeControl, change);
      }
    }
  };

  const activateControl = (activeControl, activeControlType, screenY) => {
    console.log("activateControl", activeControl, activeControlType, screenY);

    document.addEventListener("mousemove", handleMouseMoveControl);

    setActiveControl(activeControl);
    setActiveControlType(activeControlType);
    setActiveScreenY(screenY);
  };

  const deactivateControl = activeControl => {
    console.log("deactiveControl", activeControl);

    document.removeEventListener("mousemove", handleMouseMoveControl);

    setActiveControl(null);
  };

  const changeControlValue = (control, change) => {
    console.log("changeControlValue", control, change);

    const minValue = CONTROLS[control].range.min;
    const maxValue = CONTROLS[control].range.max;

    let value = controls[control] + change;

    if (value > maxValue) value = maxValue;
    else if (value < minValue) value = minValue;

    setControlValue(control, value);
  };

  const resetControlValue = control => {
    setControlValue(control, CONTROLS[control].defaultValue);
  };

  const setControlValue = (control, value) => {
    console.log("setControlValue", value);

    setControls(prevControls => ({
      ...prevControls,
      [control]: value
    }));
  };

  return (
    <div id="pr-container" onContextMenu={e => e.preventDefault()}>
      <Piano
        octaves={octaves}
        layout={layout}
        gain={gain}
        shape={shape}
        transpose={transpose}
        octave={octave}
        master={master}
        activeKeys={activeKeys}
        activeControl={activeControl}
        handleMouseDownPianoKey={handleMouseDownPianoKey}
        handleMouseUpPianoKey={handleMouseUpPianoKey}
        handleMouseOverPianoKey={handleMouseOverPianoKey}
        handleMouseLeavePianoKey={handleMouseLeavePianoKey}
        handleMouseDownControl={handleMouseDownControl}
        handleMouseUpControl={handleMouseUpControl}
      />
    </div>
  );
};

export default App;
