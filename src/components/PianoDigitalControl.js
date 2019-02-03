import React, { Component } from "react";

export default class PianoDigitalControl extends Component {
  constructor(props) {
    super(props);

    this.controlTypes = {
      "single-digit": {
        backgroundValue: 8,
        style: val => {
          const styles = {};
          if (val === 1) styles.left = "-0.25rem";
          return styles;
        }
      },
      "single-digit-negative": {
        backgroundValue: -8,
        style: val => {
          const styles = {};
          if (val > 1 || val === 0) styles.left = "-0.0625rem";
          if (val === 1) styles.left = "0.245rem";
          if (val === -1) {
            styles.left = "-0.225rem";
            styles.letterSpacing = "0.5375rem";
          }
          return styles;
        }
      }
    };
  }

  renderControl = () => {
    return (
      <div className={"pr-digital-control " + (this.props.outline ? "pr-digital-control-outlined" : "")}>
        <label
          id={"pr-" + this.props.name +"-label"}
          className="pr-digital-control-label"
          htmlFor={"pr-" + this.props.name}
        >
          {this.props.name}
        </label>
        <div className="pr-digital-control-input-container">
          <div
            id={"pr-" + this.props.name}
            className={"pr-digital-control-input " + this.props.type}
          >
            {8}
            <div
              id={"pr-" + this.props.name + "-background"}
              className={"pr-digital-control-input pr-digital-control-input-background " + this.props.type}
              children={this.controlTypes[this.props.type].backgroundValue}
            />
            <div
              id={"pr-" + this.props.name + "-foreground"}
              className={"pr-digital-control-input pr-digital-control-input-foreground " + this.props.type}
              children={this.props.value}
              style={this.controlTypes[this.props.type].style(this.props.value)}
              onMouseDown={e =>
                this.props.handleMouseDownControl(this.props.name, "digital", e)
              }
              onMouseUp={e =>
                this.props.handleMouseUpControl(this.props.name, "digital", e)
              }
            />
          </div>
        </div>
      </div>
    );
  };

  render() {
    return this.renderControl();
  }
}
