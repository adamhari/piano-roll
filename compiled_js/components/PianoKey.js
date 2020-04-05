"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var PianoKey = function (_a) {
    var active = _a.active, disabled = _a.disabled, handleMouseDownPianoKey = _a.handleMouseDownPianoKey, handleMouseUpPianoKey = _a.handleMouseUpPianoKey, handleMouseOverPianoKey = _a.handleMouseOverPianoKey, handleMouseLeavePianoKey = _a.handleMouseLeavePianoKey, name = _a.name, note = _a.note;
    var getClassNames = function () {
        var classNames = [
            'piano-key',
            "piano-key-" + note,
            name.includes('♯') ? 'piano-key-black' : 'piano-key-white',
            active ? 'piano-key-active' : disabled ? 'piano-key-disabled' : 'piano-key-inactive'
        ];
        return classNames.join(' ');
    };
    return (<div title={name} className={getClassNames()} id={"piano-key-" + name} tabIndex="0" onMouseDown={handleMouseDownPianoKey} onMouseUp={handleMouseUpPianoKey} onMouseOver={handleMouseOverPianoKey} onMouseLeave={handleMouseLeavePianoKey}/>);
};
exports.default = PianoKey;
