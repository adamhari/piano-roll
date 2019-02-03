import React, { Component } from "react";
import {
  CONTROL_PIXEL_STEP,
  LAYOUT_RANGE,
  OCTAVE_RANGE,
  TRANSPOSITION_RANGE
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
      keyMap: {
        'z': 'C0',
        'x': 'D0',
        'c': 'E0',
        'v': 'F0',
        'b': 'G0',
        'n': 'A0',
        'm': 'B0',
        'a': 'C1',
        's': 'D1',
        'd': 'E1',
        'f': 'F1',
        'g': 'G1',
        'h': 'A1',
        'j': 'B1',
        'k': 'C2',
        'l': 'D2',
        ';': 'E2',
        "'": 'F2',
        ',': 'C1',
        '.': 'D1',
        '/': 'E1',
        'q': 'C2',
        'w': 'D2',
        'e': 'E2',
        'r': 'F2',
        't': 'G2',
        'y': 'A2',
        'u': 'B2',
        'i': 'C3',
        'o': 'D3',
        'p': 'E3',
        '[': 'F3',
        ']': 'G3',
        '\\': 'A3'
      },
      hasUserGestured: false,
      activeKeys: [],
      activeControl: null,
      transpose: 0,
      octave: 5,
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

    document.addEventListener('mouseleave', () => {
      this.deactivateKeys();
      this.handleMouseUpControl();
    });
    document.addEventListener('mouseout', () => {
      this.deactivateKeys();
    });
    document.addEventListener('mouseup', () => {
      this.handleMouseUpKey();
      this.handleMouseUpControl();
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

  }

  resumeAudioContext = () => {

  }



  handleKeyboardKeyDown = (e) => {
    if (!this.state.hasUserGestured)
        this.setState({hasUserGestured:true});

    // console.log(e);
    const computerKey = e.key.toLowerCase();
    const pianoKey = this.state.keyMap[computerKey];

    this.activateKey(pianoKey);
  }

  handleKeyboardKeyUp = (e) => {
    // console.log(e);
    const computerKey = e.key.toLowerCase();
    const pianoKey = this.state.keyMap[computerKey];
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

    if (!activeKeys.includes(key))
      activeKeys.push(key);

    this.setState({ activeKeys });
  }

  deactivateKey = (key) => {
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

  handleMouseDownControl = (activeControl, e) => {
    this.setState({
      activeControl,
      activeScreenY: e.screenY
    })
  }

  handleMouseUpControl = (activeControl, e) => {
    this.setState({ activeControl: null })
  }

  handleMouseMove = (event) => {

    if (this.state.activeControl) {
      let change = 0;
      if ((event.screenY - CONTROL_PIXEL_STEP) > this.state.activeScreenY)
        change = -1;
      else if ((event.screenY + CONTROL_PIXEL_STEP) < this.state.activeScreenY)
        change = 1;

      if (change !== 0) {
        const newVal = this.state[this.state.activeControl] + change;
        switch (this.state.activeControl) {
          case 'keyMap':
            break;
          case 'octave':
            if (newVal >= OCTAVE_RANGE.min && newVal <= OCTAVE_RANGE.max) {
              this.setState({
                octave: newVal,
                activeScreenY: event.screenY
              });
            }
            break;
          case 'transpose':
            if (newVal >= TRANSPOSITION_RANGE.min && newVal <= TRANSPOSITION_RANGE.max) {
              this.setState({
                transpose: newVal,
                activeScreenY: event.screenY
              })
            }
            break;
          default:
            break;
        }
      }
    }
  }

  changeMap = (keyMap) => {
    this.setState({ keyMap })
  }

  changeOctave = (octave) => {
    this.setState({ octave })
  }

  changeTransposition = (transpose) => {
    this.setState({ transpose })
  }

  // handleTranspositionChange = (event) => {
  //   const oldTransposition = this.state.transposition;
  //   const transposition = event.target.value;
  //   const difference = transposition - oldTransposition;

  //   let keyMap = this.state.keyMap;

  //   for (let i = 0; i < Math.abs(difference); i++) {
  //     let keys = Object.keys(keyMap);
  //     keyMap = Object.assign(...keys.map((k, i) => ({ [k]: keyMap[keys[(i + 1) % keys.length]] })));
  //   }

  //   this.setState({
  //     transposition,
  //     keyMap,
  //     activeKeys: []
  //   });
  // }



  render() {
    return (
      <div
        id="pr-container"
      >
        <Piano
          octaves={this.state.octaves}
          transpose={this.state.transpose}
          octave={this.state.octave}
          activeKeys={this.state.activeKeys}

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
