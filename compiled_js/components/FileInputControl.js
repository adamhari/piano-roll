"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Light_1 = require("./Light");
var FileInputControl = function (_a) {
    var active = _a.active, accept = _a.accept, blinking = _a.blinking, handleClickControl = _a.handleClickControl, label = _a.label, name = _a.name, size = _a.size, type = _a.type, value = _a.value;
    var inputRef = react_1.useRef(null);
    var handleClick = function (e) {
        inputRef.current.click();
    };
    var handleChange = function (e) {
        var file = inputRef.current.files[0];
        var fileUrl = URL.createObjectURL(file);
        console.log(file, fileUrl);
        handleClickControl(name, fileUrl);
    };
    var getClasses = function () {
        var classes = 'button ';
        if (active)
            classes += 'active ';
        if (blinking)
            classes += 'blinking ';
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
				<input ref={inputRef} onChange={handleChange} type={type} accept={accept} style={{ display: 'none' }}/>
			</div>
		</div>);
};
exports.default = FileInputControl;
