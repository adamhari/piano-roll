import React from "react";
import {CONTROL_TYPES} from "../js/statics";

const PianoKnobControl = ({
  activeControl,
  handleMouseDownControl,
  handleMouseUpControl,
  handleMouseWheelControl,
  label,
  name,
  control,
  size,
  value
}) => {

  const {min, max} = control.range;

  const handleMouseDown = (e) => handleMouseDownControl(name, CONTROL_TYPES.knob.name, e);

  const handleMouseUp = (e) => handleMouseUpControl(name, CONTROL_TYPES.knob.name, e);

  const handleMouseWheel = (e) => handleMouseWheelControl(name, CONTROL_TYPES.knob.name, e);

  const getKnobStyle = () => {
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

  const getValueStyles = () => {
    const styles = {
      opacity: activeControl === name ? 1 : 0
    };

    return styles;
  }

  return (
    <div className={"pr-knob-control-container " + (size || "")}>
      <div className="pr-control-label">{label || name}</div>
      <div
        className="pr-knob-control-value"
        style={getValueStyles()}
      >
        {value}
      </div>
      <div className="pr-knob-container">
        <div
          className="pr-knob"
          style={getKnobStyle()}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onWheel={handleMouseWheel}
        />
      </div>
    </div>
  );
}

export default PianoKnobControl;