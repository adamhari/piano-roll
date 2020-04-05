"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var statics_1 = require("../js/statics");
var DigitalControl = function (_a) {
    var handleMouseDownControl = _a.handleMouseDownControl, handleMouseUpControl = _a.handleMouseUpControl, handleMouseWheelControl = _a.handleMouseWheelControl, name = _a.name, label = _a.label, outline = _a.outline, value = _a.value;
    var _b = statics_1.CONTROLS[name].range, min = _b.min, max = _b.max;
    var getDigits = function () {
        var typeOfDigits = '';
        if (max > 9)
            typeOfDigits = 'multi-digit';
        else
            typeOfDigits = 'single-digit';
        if (min < 0)
            typeOfDigits += '-negative';
        return typeOfDigits;
    };
    var digits = getDigits();
    var handleMouseDown = function (e) { return handleMouseDownControl(name, statics_1.CONTROL_TYPES.digital.name, e); };
    var handleMouseUp = function (e) { return handleMouseUpControl(name, statics_1.CONTROL_TYPES.digital.name, e); };
    var handleMouseWheel = function (e) { return handleMouseWheelControl(name, statics_1.CONTROL_TYPES.digital.name, e); };
    var digitTypes = {
        'single-digit': {
            backgroundValue: 8,
            style: function (val) {
                var styles = {};
                if (val === 1)
                    styles.left = '-0.25rem';
                return styles;
            }
        },
        'single-digit-negative': {
            backgroundValue: -8,
            style: function (val) {
                var styles = {};
                if (val > 1 || val === 0)
                    styles.left = '-0.0625rem';
                if (val === 1)
                    styles.left = '0.245rem';
                if (val === -1) {
                    styles.left = '-0.225rem';
                    styles.letterSpacing = '0.5375rem';
                }
                return styles;
            }
        }
    };
    return (<div className={'digital-control ' + (outline ? 'digital-control-outlined' : '')}>
			<label id={'' + name + '-label'} className="control-label" htmlFor={'' + name}>
				{label || name}
			</label>
			<div className="digital-control-input-container control-container">
				<div id={'' + name} className={'digital-control-input ' + digits}>
					{8}
					<div id={'' + name + '-background'} className={'digital-control-input digital-control-input-background ' + digits} children={digitTypes[digits].backgroundValue}/>
					<div id={'' + name + '-foreground'} className={'digital-control-input digital-control-input-foreground ' + digits} children={Number.isInteger(value) ? value : '-'} style={digitTypes[digits].style(value)} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onWheel={handleMouseWheel}/>
				</div>
			</div>
		</div>);
};
exports.default = DigitalControl;
