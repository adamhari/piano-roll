import React, { Component } from 'react';

export default class PianoTopControls extends Component {

  renderLogo = () => {
    return (
      <div id="pr-logo-section">
        <div id="pr-logo">Shogun 470xd</div>
        <div id="pr-logo-subtext"><span id="pr-logo-subtext-bold">React</span> Synthesizer</div>
      </div>

    )
  }

  renderTransposer = () => {

    const overlayPositionFix = (val) => {
      const styles = {};
      if (val > 1 | val === 0)
        styles.left = "-0.0625rem";
      if (val === 1)
        styles.left = "0.1875rem";
      if (val === -1) {
        styles.left = "0.1875rem";
        styles.letterSpacing = "0.5625rem";
      }
      return styles;
    }

    return (
      <div className="pr-control">
        <label
          id="pr-transposer-label"
          className="pr-control-label"
          htmlFor="pr-transposer"
        >
          Transpose
        </label>
        <div className="pr-control-input-container">
          <div
            id="pr-transposer"
            className="pr-control-input single-digit-negative"
          >
            {8}
            <div
              id="pr-transposer-background"
              className="pr-control-input single-digit-negative pr-control-input-background"
              children={-8}
            />
            <div
              id="pr-transposer-foreground"
              className="pr-control-input single-digit-negative pr-control-input-foreground"
              children={this.props.transposition}
              style={overlayPositionFix(this.props.transposition)}
              onMouseDown={(e) => this.props.handleMouseDownControl("transposition", e)}
              onMouseUp={(e) => this.props.handleMouseUpControl("transposition", e)}
            />
          </div>
        </div>

      </div>
    )
  }

  renderOctaver = () => {

    const overlayPositionFix = (val) => {
      const styles = {};
      if (val === 1)
        styles.left = "-0.25rem";
      return styles;
    }

    return (
      <div className="pr-control pr-control-outlined">
        <label
          id="pr-octaver-label"
          className="pr-control-label"
          htmlFor="pr-octaver"
        >
          Octave
        </label>
        <div className="pr-control-input-container">
          <div
            id="pr-octaver"
            className="pr-control-input single-digit"
          >
            {8}
            <div
              id="pr-octaver-background"
              className="pr-control-input single-digit pr-control-input-background"
              children={8}
            />
            <div
              id="pr-octaver-foreground"
              className="pr-control-input single-digit pr-control-input-foreground"
              children={this.props.octave}
              style={overlayPositionFix(this.props.octave)}
              onMouseDown={(e) => this.props.handleMouseDownControl("octave", e)}
              onMouseUp={(e) => this.props.handleMouseUpControl("octave", e)}
            />
          </div>
        </div>

      </div>
    )
  }

  renderMapper = () => {

    const overlayPositionFix = (val) => {
      const styles = {};
      if (val === 1)
        styles.left = "-0.25rem";
      return styles;
    }

    return (
      <div className="pr-control">
        <label
          id="pr-mapper-label"
          className="pr-control-label"
          htmlFor="pr-mapper"
        >
          Layout
        </label>
        <div className="pr-control-input-container">
          <div
            id="pr-mapper"
            className="pr-control-input single-digit"
          >
            {8}
            <div
              id="pr-mapper-background"
              className="pr-control-input single-digit pr-control-input-background"
              children={8}
            />
            <div
              id="pr-mapper-foreground"
              className="pr-control-input single-digit pr-control-input-foreground"
              children={0}
              style={overlayPositionFix(0)}
              onMouseDown={(e) => this.props.handleMouseDownControl("keyMap", e)}
              onMouseUp={(e) => this.props.handleMouseUpControl("keyMap", e)}
            />
          </div>
        </div>

      </div>
    )
  }

  render() {
    return (
      <div id="pr-piano-top-controls">
        {this.renderLogo()}
        {this.renderMapper()}
        {this.renderOctaver()}
        {this.renderTransposer()}


      </div>
    )
  }
}