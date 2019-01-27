import React, { Component } from "react";
import Piano from "./components/Piano";

class PianoRoll extends Component {
  constructor(props) {
    super(props);

    this.state = {
      keyMap: {
        'q' : 'C6',
        'w' : 'D6',
        'e' : 'E6', 
        'r' : 'F6',
        't' : 'G6',
        'y' : 'A6',
        'u' : 'B6',
        'i' : 'C7',
        'o' : 'D7',
        'p' : 'E7',
        '[' : 'F7',
        '{' : 'F7',
        ']' : 'G7',
        '}' : 'G7',
        'a' : 'C5',
        's' : 'D5',
        'd' : 'E5',
        'f' : 'F5',
        'g' : 'G5',
        'h' : 'A5',
        'j' : 'B5',
        'k' : 'C6',
        'l' : 'D6',
        ';' : 'E6',
        ':' : 'E6',
        "'" : 'F6',
        '"' : 'F6',
        'n' : 'A4',
        'm' : 'B4',
        ',' : 'C5',
        '<' : 'C5',
        '.' : 'D5',
        '>' : 'D5',
        '/' : 'E5',
        '?' : 'E5'
      },
      activeKeys: []
    }

    this.octaves = this.props.octaves;
    if (!this.octaves || this.octaves > 10 || !Number.isInteger(this.octaves))
      this.octaves = 4;

    this.registerEvents();
  }

  componentDidUpdate(newProps, newState) {
    console.log(newState);
  }

  registerEvents = () => {
    document.addEventListener('keydown', this.handleKeyboardInput);
    document.addEventListener('keyup', this.handleKeyboardOutput);
  }

  handleKeyboardInput = (e) => {
    // console.log(e);

    const activeKeys = this.state.activeKeys;
    if (!activeKeys.includes(e.key))
      activeKeys.push(this.state.keyMap[e.key.toLowerCase()]);

    this.setState({ activeKeys });
  }

  handleKeyboardOutput = (e) => {
    console.log(e);
    const activeKeys = this.state.activeKeys;

    for (var i = activeKeys.length - 1; i >= 0; i--) {
      if (activeKeys[i] === this.state.keyMap[e.key]) {
        activeKeys.splice(i, 1);
        break;
      }
    }
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
