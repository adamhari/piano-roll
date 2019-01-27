import React, { Component } from "react";

export default class PianoKey extends Component {

  getClassNames = () => {
    let classNames = [
      'pr-piano-key',
      `pr-piano-key-${this.props.note}`,
      this.props.name.includes('♯') ? 'pr-piano-key-black' : 'pr-piano-key-white'
    ];

    return classNames.join(' ');
  }

  render() {
    return (
      <div
        title={this.props.name}
        className={this.getClassNames()}
        id={`pr-piano-key-${this.props.name}`}
      >
      </div>
    );
  }
}
