import React, { Component } from 'react';

export default class PianoTopControls extends Component {

  renderTransposer = () => {
    return (
      <input 
        type="number" 
        className="pr-transposer"
        min={-64}
        max={64}
        step={1}
        value={this.props.transposition}
        onChange={this.props.handleTranspositionChange}
        onKeyPress={(e => e.preventDefault())}
      />
    )
  }

  render() {
    return (
      <div id="pr-piano-top-controls">
        {this.renderTransposer()}
      </div>
    )
  }
}