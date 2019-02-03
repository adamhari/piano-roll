import React, { Component } from "react";

export default class PianoDigitalControl extends Component {

  getKnobStyle = () => {
    const {min, max, value} = this.props;
    const style = {};

    const valueAsPercent = (value - min) * 100 / (max - min);
    const valueAsDeg = valueAsPercent * 3.6;
    const valueForRotate = ((valueAsDeg + 180) * 0.875) + 45;

    style.transform = `rotate(${valueForRotate}deg)`;

    return style;

    //min: 0, 0
    //max: 30, 50
    //input: 5, 15

    // (5 - 0) * 100 / (30 - 0) = 16.667
    // (15 - 0) * 100 / (50 - 0) = 30
  }

  renderControl = () => {
    return (
      <div className="pr-knob-container">
        <span className="pr-knob-control-label">{this.props.name}</span>
        <span className="pr-knob-control-value">{this.props.value}</span>
        <div
          className="pr-knob-control"
          style={this.getKnobStyle()}
          onMouseDown={e => this.props.handleMouseDownControl(this.props.name, "knob", e)}
          onMouseUp={e => this.props.handleMouseUpControl(this.props.name, "knob", e)}
        ></div>
      </div>
    );
  };

  render() {
    return this.renderControl();
  }
}
