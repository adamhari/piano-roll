import React, { Component } from "react";
import Piano from "./components/Piano";

class PianoRoll extends Component {
  constructor(props) {
    super(props);

    this.state = {
      keyMap: {
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
        '{': 'F3',
        ']': 'G3',
        '}': 'G3',
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
        ':': 'E2',
        "'": 'F2',
        '"': 'F2',
        'z': 'C0',
        'x': 'D0',
        'c': 'E0',
        'v': 'F0',
        'b': 'G0',
        'n': 'A0',
        'm': 'B0',
        ',': 'C1',
        '<': 'C1',
        '.': 'D1',
        '>': 'D1',
        '/': 'E1',
        '?': 'E1'
      },
      activeKeys: []
    }

    this.octaves = this.props.octaves;
    if (!this.octaves || this.octaves > 10 || !Number.isInteger(this.octaves))
      this.octaves = 4;

    this.registerEvents();
  }

  componentDidUpdate(newProps, newState) {
    // console.log(newState);
  }

  registerEvents = () => {
    document.addEventListener('keydown', this.handleKeyboardInput);
    document.addEventListener('keyup', this.handleKeyboardOutput);
  }

  handleKeyboardInput = (e) => {
    // console.log(e);
    const activeKeys = this.state.activeKeys;
    const computerKey = e.key.toLowerCase();
    const pianoKey = this.state.keyMap[computerKey];


    if (!activeKeys.includes(pianoKey))
      activeKeys.push(pianoKey);

    this.setState({ activeKeys });
  }

  handleKeyboardOutput = (e) => {
    // console.log(e);
    const activeKeys = this.state.activeKeys;
    const computerKey = e.key.toLowerCase();
    const pianoKey = this.state.keyMap[computerKey];

    for (var i = activeKeys.length - 1; i >= 0; i--) {
      if (activeKeys[i] === pianoKey) {
        activeKeys.splice(i, 1);
        break;
      }
    }

    this.setState({ activeKeys });
  }



  render() {
    return (
      <div
        id="pr-container"
      >
        <Piano
          octaves={this.octaves}
          activeKeys={this.state.activeKeys}
        />
      </div>
    )
  }
}

export default PianoRoll;
