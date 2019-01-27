import React, { Component } from "react";
import Piano from "./components/Piano";

class PianoRoll extends Component {
  constructor(props) {
    super(props);

    this.state = {
      keyMap: {
        'n' : 'A4',
        'm' : 'B4',
        ',' : 'C5',
        '<' : 'C5',
        '.' : ''
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
      activeKeys.push(e.key.toLowerCase());

    this.setState({ activeKeys });
  }

  handleKeyboardOutput = (e) => {
    console.log(e);
    const activeKeys = this.state.activeKeys;

    for (var i = activeKeys.length - 1; i >= 0; i--) {
      if (activeKeys[i] === e.key) {
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
