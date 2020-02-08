import React from "react";
import {CONTROL_TYPES} from "../js/statics";

const PianoDigitalControl = ({
  handleMouseDownControl,
  handleMouseUpControl,
  handleMouseWheelControl,
  name,
  label,
  control,
  outline,
  value
}) => {

  const getDigits = () => {
    let typeOfDigits = "";
    const {min, max} = control.range;
    if (max > 9) typeOfDigits = "multi-digit"
    else typeOfDigits = "single-digit";
    if (min < 0) typeOfDigits += "-negative";
    return typeOfDigits;
  };

  const digits = getDigits();

  const handleMouseDown = (e) => handleMouseDownControl(name, CONTROL_TYPES.digital.name, e);

  const handleMouseUp = (e) => handleMouseUpControl(name, CONTROL_TYPES.digital.name, e);

  const handleMouseWheel = (e) => handleMouseWheelControl(name, CONTROL_TYPES.digital.name, e);

  const digitTypes = {
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

  return (
    <div className={"pr-digital-control " + (outline ? "pr-digital-control-outlined" : "")}>
      <label
        id={"pr-" + name + "-label"}
        className="pr-control-label"
        htmlFor={"pr-" + name}
      >
        {label || name}
      </label>
      <div className="pr-digital-control-input-container">
        <div
          id={"pr-" + name}
          className={"pr-digital-control-input " + digits}
        >
          {8}
          <div
            id={"pr-" + name + "-background"}
            className={"pr-digital-control-input pr-digital-control-input-background " + digits}
            children={digitTypes[digits].backgroundValue}
          />
          <div
            id={"pr-" + name + "-foreground"}
            className={"pr-digital-control-input pr-digital-control-input-foreground " + digits}
            children={value}
            style={digitTypes[digits].style(value)}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onWheel={handleMouseWheel}
          />
        </div>
      </div>
    </div>
  );
};

export default PianoDigitalControl;