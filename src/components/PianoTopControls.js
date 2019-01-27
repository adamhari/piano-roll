import React, { Component } from 'react';

export default class PianoTopControls extends Component {

  positionFix = (val) => {
    const styles = {};
    if (val === 1)
      styles.left = "0.625rem";
    if (val > 1)
      styles.left = "0.375rem";
    if (val === -1){
      styles.left = "0.1875rem";
      styles.letterSpacing = "0.5625rem";
    }
    return styles;
  }

  renderTransposer = () => {
    return (
      <div className="pr-control">
        <label
          id="pr-transposer-label"
          className="pr-control-label"
          for="pr-transposer"
        >
          Transposer
        </label>
        <div
          id="pr-transposer"
          className="pr-control-input"
        >
        {8}
          <div
            id="pr-transposer-background"
            className="pr-control-input pr-control-input-background"
            children={-8}
          />
          <div
            id="pr-transposer-foreground"
            className="pr-control-input pr-control-input-foreground"
            children={this.props.transposition}
            style={this.positionFix(this.props.transposition)}
          />
        </div>
      </div>

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