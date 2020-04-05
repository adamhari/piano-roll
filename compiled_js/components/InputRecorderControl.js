"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var InputRecorderControl = function (_a) {
    var active = _a.active, label = _a.label, size = _a.size;
    var getClasses = function () {
        var classes = 'button ';
        if (active)
            classes += 'active ';
        if (size)
            classes += size;
        return classes;
    };
    return (<div className={'button-control-container control-container'}>
			<div className="control-label">{label}</div>
			<div className={'button-container'}>
				<div className={getClasses()}/>
			</div>
		</div>);
};
exports.default = InputRecorderControl;
