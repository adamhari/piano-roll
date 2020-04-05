"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Light_1 = require("./Light");
var ButtonControl = function (_a) {
    var active = _a.active, handleClickControl = _a.handleClickControl, label = _a.label, name = _a.name, size = _a.size, value = _a.value;
    var handleClick = function (e) {
        handleClickControl(name, value);
    };
    var getClasses = function () {
        var classes = 'button ';
        if (active)
            classes += 'active ';
        if (size)
            classes += size + " ";
        return classes;
    };
    var renderLight = function () { return active !== null && <Light_1.default active={active} size={size}/>; };
    return (<div className={'button-control-container control-container'}>
			<div className="control-label">{label || value}</div>
			<div className={'button-container'}>
				<div onClick={handleClick} className={getClasses()}>
					{renderLight()}
				</div>
			</div>
		</div>);
};
exports.default = ButtonControl;
