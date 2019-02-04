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

  getValueStyles = () => {
    const {activeControl, name} = this.props;
    const styles = {};
    if (activeControl === name)
      styles.display = "block";

    return styles;
  }

  renderControl = () => {
    return (
      <div className="pr-knob-container">
        <div className="pr-knob-control-label">{this.props.label || this.props.name}</div>
        <div 
          className="pr-knob-control-value"
          style={this.getValueStyles()}
        >
          {this.props.value}
        </div>
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
