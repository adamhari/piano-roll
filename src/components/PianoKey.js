import React, { Component } from "react";

export default class PianoKey extends Component {

  getClassNames = () => {
    let classNames = [
      'pr-piano-key',
      `pr-piano-key-${this.props.note}`,
      this.props.name.includes('♯') ? 'pr-piano-key-black' : 'pr-piano-key-white',
      this.props.active ? 'pr-piano-key-active' : this.props.disabled ? 'pr-piano-key-disabled' : 'pr-piano-key-inactive'
    ];

    return classNames.join(' ');
  }

  render() {
    return (
      <div
        title={this.props.name}
        className={this.getClassNames()}
        id={`pr-piano-key-${this.props.name}`}
        tabIndex="0"
        // onKeyDown={this.props.handleKeyDown}
        onMouseDown={this.props.handleMouseDownPianoKey}
        onMouseUp={this.props.handleMouseUpPianoKey}
        onMouseOver={this.props.handleMouseOverPianoKey}
        onMouseLeave={this.props.handleMouseLeavePianoKey}
      >
      </div>
    );
  }
}
