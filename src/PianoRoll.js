import React, { Component } from "react";
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


      },
      activeKeys: [],
      transposition: 3,
      mouseDown: false
    }

    this.registerEvents();
  }

  componentDidUpdate(newProps, newState) {
    // console.log(newState);
  }

  registerEvents = () => {
    document.addEventListener('keydown', this.handleKeyboardKeyDown);
    document.addEventListener('keyup', this.handleKeyboardKeyUp);

    document.addEventListener('mouseleave', this.deactivateKeys);
    document.addEventListener('mouseout', this.deactivateKeys);
    document.addEventListener('mouseup', this.handleMouseUpKey);

    document.addEventListener('drag', (e) => e.preventDefault());
    document.addEventListener('dragend', (e) => e.preventDefault());
    document.addEventListener('dragenter', (e) => e.preventDefault());
    document.addEventListener('dragexit', (e) => e.preventDefault());
    document.addEventListener('dragleave', (e) => e.preventDefault());
    document.addEventListener('dragover', (e) => e.preventDefault());
    document.addEventListener('dragstart', (e) => e.preventDefault());
    document.addEventListener('drop', (e) => e.preventDefault());
  }

  handleKeyboardKeyDown = (e) => {
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
      this.setState({activeKeys:[e.target.title]})
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

  handleTranspositionChange = (event) => {
    const oldTransposition = this.state.transposition;
    const transposition = event.target.value;
    const difference = transposition - oldTransposition;

    let keyMap = this.state.keyMap;

    for (let i = 0; i < Math.abs(difference); i++) {
      let keys = Object.keys(keyMap);
      keyMap = Object.assign(...keys.map((k, i) => ({ [k]: keyMap[keys[(i + 1) % keys.length]] })));
    }

    this.setState({
      transposition,
      keyMap,
      activeKeys: []
    });
  }



  render() {
    return (
      <div
        id="pr-container"
      >
        <Piano
          octaves={this.state.octaves}
          transposition={this.state.transposition}
          activeKeys={this.state.activeKeys}

          handleMouseDownKey={this.handleMouseDownKey}
          handleMouseUpKey={this.handleMouseUpKey}
          handleMouseOverKey={this.handleMouseOverKey}

          handleTranspositionChange={this.handleTranspositionChange}
        />
      </div>
    )
  }
}

export default PianoRoll;
