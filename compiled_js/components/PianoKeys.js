"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var PianoKey_1 = require("./PianoKey");
var statics_1 = require("../js/statics");
var PianoKeys = function (props) {
    var activeKeys = props.activeKeys, octaves = props.octaves;
    var blackKeys = [];
    var whiteKeys = [];
    var pianoKeys = statics_1.KEYS.slice(0, 12 * octaves);
    pianoKeys.forEach(function (key, index) {
        var keySet = key.name.includes('♯') ? blackKeys : whiteKeys;
        keySet.push(<PianoKey_1.default {...props} key={key.octave * 12 + index} name={key.name} note={key.name.substring(0, key.name.length - 1)} freq={key.freq * Math.pow(2, key.octave)} active={activeKeys.includes(key.name)}/>);
    });
    return (<div id="piano-keys">
			<div id="piano-black-keys">{blackKeys}</div>
			<div id="piano-white-keys">{whiteKeys}</div>
		</div>);
};
exports.default = PianoKeys;
