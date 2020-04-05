"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var statics_1 = require("../js/statics");
var KnobControl = function (_a) {
    var activeControl = _a.activeControl, handleMouseDownControl = _a.handleMouseDownControl, handleMouseUpControl = _a.handleMouseUpControl, handleMouseWheelControl = _a.handleMouseWheelControl, label = _a.label, name = _a.name, size = _a.size, value = _a.value;
    var _b = statics_1.CONTROLS[name].range, min = _b.min, max = _b.max;
    var handleMouseDown = function (e) { return handleMouseDownControl(name, statics_1.CONTROL_TYPES.knob.name, e); };
    var handleMouseUp = function (e) { return handleMouseUpControl(name, statics_1.CONTROL_TYPES.knob.name, e); };
    var handleMouseWheel = function (e) { return handleMouseWheelControl(name, statics_1.CONTROL_TYPES.knob.name, e); };
    var getKnobStyle = function () {
        var style = {};
        var valueAsPercent = ((value - min) * 100) / (max - min);
        var valueAsDeg = valueAsPercent * 3.6;
        var valueForRotate = (valueAsDeg + 180) * 0.875 + 45;
        style.transform = "rotate(" + valueForRotate + "deg)";
        return style;
        //min: 0, 0
        //max: 30, 50
        //input: 5, 15
        // (5 - 0) * 100 / (30 - 0) = 16.667
        // (15 - 0) * 100 / (50 - 0) = 30
    };
    var getValueStyles = function () {
        var styles = {
            opacity: activeControl === name ? 1 : 0
        };
        return styles;
    };
    return (<div className={'knob-control-container control-container ' + (size || '')}>
			<div className="control-label">{label || name}</div>
			<div className="knob-container">
				<div className="knob" style={getKnobStyle()} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onWheel={handleMouseWheel}/>
				<div className="knob-control-value" style={getValueStyles()}>
					{value}
				</div>
			</div>
		</div>);
};
exports.default = KnobControl;
