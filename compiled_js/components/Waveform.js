"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var wavesurfer_js_1 = require("wavesurfer.js");
var Waveform = function (_a) {
    var audio = _a.audio;
    var wavesurfer = react_1.useRef(null);
    react_1.useEffect(function () {
        wavesurfer.current = wavesurfer_js_1.default.create({
            barGap: 0,
            barRadius: 1,
            barWidth: 4,
            container: '.waveform',
            cursorWidth: 0,
            hideScrollbar: true,
            interact: false,
            normalize: true,
            waveColor: '#ff2601',
        });
        return function () { return wavesurfer.current.destroy(); };
    }, []);
    react_1.useEffect(function () {
        if (audio)
            wavesurfer.current.load(audio);
        else
            wavesurfer.current.empty();
    }, [audio]);
    return (<div className="waveform-container">
			<div id="waveform" className="waveform"/>
		</div>);
};
exports.default = Waveform;
