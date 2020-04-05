"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var tone_1 = require("tone");
var statics_1 = require("./js/statics");
var utils_1 = require("./js/utils");
var Instrument_1 = require("./components/Instrument");
var Output_1 = require("./js/classes/Output");
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    /** LIFECYCLE */
    function App(props) {
        var _this = _super.call(this, props) || this;
        _this.componentDidMount = function () {
            _this.initializeSoundEngine();
            _this.registerEventListeners();
        };
        _this.componentWillUnmount = function () { };
        /** INIT */
        _this.registerEventListeners = function () {
            // console.log("registerEvents");
            window.addEventListener('beforeunload', function (e) { return _this.terminateSoundEngine; });
            document.addEventListener('keydown', _this.handleKeyDown);
            document.addEventListener('keyup', _this.handleKeyUp);
            document.addEventListener('mousedown', _this.handleMouseDown);
            document.addEventListener('mouseup', _this.handleMouseUp);
            document.addEventListener('mouseleave', _this.handleMouseLeave);
            document.addEventListener('mouseout', _this.handleMouseOut);
            document.addEventListener('drag', function (e) { return e.preventDefault(); });
            document.addEventListener('dragend', function (e) { return e.preventDefault(); });
            document.addEventListener('dragenter', function (e) { return e.preventDefault(); });
            document.addEventListener('dragexit', function (e) { return e.preventDefault(); });
            document.addEventListener('dragleave', function (e) { return e.preventDefault(); });
            document.addEventListener('dragover', function (e) { return e.preventDefault(); });
            document.addEventListener('dragstart', function (e) { return e.preventDefault(); });
            document.addEventListener('drop', function (e) { return e.preventDefault(); });
        };
        _this.initializeSoundEngine = function () {
            // console.log('initializeSoundEngine');
            _this.audioContext = new tone_1.Context();
            // this.audioContext.latencyHint = 'fastest';
            _this.setOutputFromState();
        };
        _this.terminateSoundEngine = function () {
            _this.audioContext && _this.audioContext.dispose();
        };
        _this.setOutputFromState = function () {
            // console.log("setOutputFromState");
            var controlsState = statics_1.CONTROLS_NAMES.map(function (n) { return _this.state[n]; });
            _this.output = new (Output_1.default.bind.apply(Output_1.default, __spreadArrays([void 0, _this, _this.audioContext], controlsState)))();
        };
        _this.resumeAudioContext = function () {
            // console.log('resumeAudioContext');
            if (!_this.state.audioContextStarted) {
                _this.audioContext.resume();
                _this.setState({ audioContextStarted: true });
            }
        };
        /** GLOBAL EVENT HANDLERS */
        _this.handleKeyDown = function (e) {
            // console.log("handleKeyDown", e);
            e.preventDefault();
            var keyPressed = e.key.toLowerCase();
            var pianoKey = statics_1.LAYOUTS[_this.state.layout][keyPressed];
            if (pianoKey) {
                _this.activatePianoKey(pianoKey);
            }
            else if (keyPressed === 'control' || keyPressed === 'command') {
                _this.setState({ activeModifierKey: true });
            }
            _this.resumeAudioContext();
        };
        _this.handleKeyUp = function (e) {
            // console.log("handleKeyUp", e);
            var keyReleased = e.key.toLowerCase();
            if (keyReleased === 'control' || keyReleased === 'command')
                _this.setState({ activeModifierKey: false });
            var pianoKey = statics_1.LAYOUTS[_this.state.layout][keyReleased];
            if (pianoKey) {
                _this.deactivatePianoKey(pianoKey);
            }
        };
        _this.handleMouseDown = function (e) {
            // console.log('handleMouseDown', e);
            _this.resumeAudioContext();
        };
        _this.handleMouseUp = function (e) {
            // console.log('handleMouseUp', e);
            _this.mouseDownOnKeys = false;
            _this.state.activeControl &&
                _this.setState({
                    activeControl: null,
                    activeModifierKey: false,
                });
        };
        _this.handleMouseLeave = function (e) {
            // console.log("handleMouseLeave", e);
        };
        _this.handleMouseOut = function (e) {
            // console.log("handleMouseOut", e);
        };
        /** PIANO KEYS */
        _this.handleMouseDownPianoKey = function (e) {
            // console.log('handleMouseDownPianoKey', e);
            if (e.button === 0) {
                _this.activatePianoKey(e.target.title);
                _this.mouseDownOnKeys = true;
            }
        };
        _this.handleMouseUpPianoKey = function (e) {
            // console.log('handleMouseUpPianoKey', e);
            if (e.button === 0) {
                _this.mouseDownOnKeys = false;
                _this.deactivatePianoKey(e.target.title);
            }
        };
        _this.handleMouseOverPianoKey = function (e) {
            // console.log("handleMouseOverPianoKey", e);
            // this.mouseDownOnKeys && this.activatePianoKey(e.target.title);
        };
        _this.handleMouseLeavePianoKey = function (e) {
            // console.log("handleMouseLeavePianoKey", e);
            _this.mouseDownOnKeys && _this.deactivatePianoKey(e.target.title);
        };
        _this.activatePianoKey = function (key) {
            // console.log('activatePianoKey', key);
            if (!_this.state.activeKeys.includes(key)) {
                _this.output.playKey(statics_1.KEYS_MAP[key].freq);
                _this.setState(function (prevState) { return ({
                    activeKeys: __spreadArrays(prevState.activeKeys, [key]),
                }); });
            }
        };
        _this.deactivatePianoKey = function (key) {
            // console.log('deactivatePianoKey', key);
            if (_this.state.activeKeys.includes(key)) {
                _this.output.stopKey(statics_1.KEYS_MAP[key].freq);
                _this.setState(function (prevState) { return ({
                    activeKeys: prevState.activeKeys.filter(function (k) { return k !== key; }),
                }); });
            }
        };
        /** SYNTH CONTROLS */
        _this.handleClickControl = function (control, value) {
            // console.log(`handleClickControl(${control}, ${value})`);
            _this.setControlValue(control, value);
        };
        _this.handleMouseDownControl = function (activeControl, activeControlType, e) {
            // console.log('handleMouseDownControl', activeControl, activeControlType, e);
            if (e.button === 0) {
                // left click
                if (_this.state.activeModifierKey) {
                    // holding ctrl
                    _this.resetControlValue(activeControl);
                }
                else {
                    _this.activateControl(activeControl, activeControlType, e.screenY);
                }
            }
        };
        _this.handleMouseUpControl = function (activeControl, e) {
            // console.log('handleMouseUpControl', activeControl, e);
            if (e.button === 0) {
                _this.deactivateControl(activeControl);
            }
        };
        _this.handleMouseMoveControl = function (event) {
            // console.log("handleMouseMoveControl", event, this.state);
            var _a = _this.state, activeModifierKey = _a.activeModifierKey, activeControl = _a.activeControl, activeControlType = _a.activeControlType, activeScreenY = _a.activeScreenY;
            if (activeControl) {
                var pixelStep = statics_1.CONTROL_TYPES[activeControlType].pixelStep || 5;
                if (activeModifierKey) {
                    pixelStep *= 10;
                }
                var movement = Math.abs(event.screenY - activeScreenY);
                var change = 0;
                if (event.screenY - pixelStep > activeScreenY) {
                    change = Math.round(-movement / pixelStep);
                }
                else if (event.screenY + pixelStep < activeScreenY) {
                    change = Math.round(movement / pixelStep);
                }
                if (change) {
                    var newState = __assign({}, _this.state);
                    newState['activeScreenY'] = event.screenY;
                    _this.setState(newState);
                    _this.changeControlValue(activeControl, change);
                }
            }
        };
        _this.handleMouseWheelControl = function (activeControl, activeControlType, e) {
            // console.log('handleMouseWheelControl', activeControl, activeControlType, e.deltaY);
            // const {pixelStep} = CONTROL_TYPES[activeControlType];
            // const change = e.deltaY > 0 ? -1 : 1;
            // const value = change * Math.round(5 / pixelStep);
            // this.changeControlValue(activeControl, value);
            return false;
        };
        _this.activateControl = function (activeControl, activeControlType, screenY) {
            // console.log('activateControl', activeControl, activeControlType, screenY);
            document.addEventListener('mousemove', _this.handleMouseMoveControl);
            _this.setState({
                activeControl: activeControl,
                activeControlType: activeControlType,
                activeScreenY: screenY,
            });
        };
        _this.deactivateControl = function (activeControl) {
            // console.log('deactiveControl', activeControl);
            document.removeEventListener('mousemove', _this.handleMouseMoveControl);
            _this.setState({ activeControl: null });
        };
        _this.changeControlValue = function (control, change) {
            // console.log('changeControlValue', control, change);
            var range = statics_1.CONTROLS[control].range;
            var value = Number.isInteger(_this.state[control]) ? _this.state[control] + change : 0;
            if (range) {
                value = utils_1.getValueFromRange(value, range);
            }
            _this.setControlValue(control, value);
        };
        _this.setControlValue = function (control, value) {
            var _a;
            console.log('setControlValue', control, value);
            _this.output.set(control, value);
            _this.setState((_a = {}, _a[control] = value, _a));
        };
        _this.resetControlValue = function (control) {
            var _a;
            console.log('resetControlValue', control);
            _this.setState((_a = {}, _a[control] = statics_1.CONTROLS[control].defaultValue, _a));
        };
        _this.layout = props.layout || 0;
        _this.octaves = props.octaves;
        if (!_this.octaves || !Number.isInteger(_this.octaves) || _this.octaves > 10 || _this.octaves < 4) {
            _this.octaves = 6;
        }
        _this.state = __assign({ activeKeys: [], activeControl: null, activeControlType: null, activeScreenY: null, activeModifierKey: false, audioContextStarted: false, octaves: _this.octaves, layout: _this.layout }, statics_1.CONTROLS_DEFAULT_VALUES);
        return _this;
    }
    App.prototype.render = function () {
        // console.log("State:", this.state);
        return (<div id="container">
				<Instrument_1.default {...this.state} handleMouseDownPianoKey={this.handleMouseDownPianoKey} handleMouseUpPianoKey={this.handleMouseUpPianoKey} handleMouseOverPianoKey={this.handleMouseOverPianoKey} handleMouseLeavePianoKey={this.handleMouseLeavePianoKey} handleClickControl={this.handleClickControl} handleMouseDownControl={this.handleMouseDownControl} handleMouseUpControl={this.handleMouseUpControl} handleMouseWheelControl={this.handleMouseWheelControl}/>
			</div>);
    };
    return App;
}(react_1.Component));
exports.default = App;
