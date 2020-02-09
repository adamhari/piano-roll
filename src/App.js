import React, {Component} from 'react';
import {Context} from 'tone';
import {CONTROL_TYPES, CONTROLS, CONTROLS_DEFAULT_VALUES, KEYS_MAP, LAYOUTS} from './js/statics';
import Synth from './components/Synth';
import Output from './js/classes/Output';

class App extends Component {
	/** LIFECYCLE */

	constructor(props) {
		super(props);

		this.layout = props.layout || 0;
		this.octaves = props.octaves;
		this.voices = {};

		if (!this.octaves || !Number.isInteger(this.octaves) || this.octaves > 10 || this.octaves < 4) {
			this.octaves = 5;
		}

		this.state = {
			activeKeys: [],
			activeControl: null,
			activeControlType: null,
			activeScreenY: null,
			activeModifierKey: false,
			audioContextStarted: false,
			octaves: this.octaves,
			layout: this.layout,
			...CONTROLS_DEFAULT_VALUES
		};
	}

	componentDidMount = () => {
		this.initializeSoundEngine();
		this.registerEvents();
	};

	/** INIT */

	registerEvents = () => {
		// console.log("registerEvents");

		document.addEventListener('keydown', this.handleKeyDown);
		document.addEventListener('keyup', this.handleKeyUp);

		document.addEventListener('mousedown', this.handleMouseDown);
		document.addEventListener('mouseup', this.handleMouseUp);
		document.addEventListener('mouseleave', this.handleMouseLeave);
		document.addEventListener('mouseout', this.handleMouseOut);

		document.addEventListener('drag', e => e.preventDefault());
		document.addEventListener('dragend', e => e.preventDefault());
		document.addEventListener('dragenter', e => e.preventDefault());
		document.addEventListener('dragexit', e => e.preventDefault());
		document.addEventListener('dragleave', e => e.preventDefault());
		document.addEventListener('dragover', e => e.preventDefault());
		document.addEventListener('dragstart', e => e.preventDefault());
		document.addEventListener('drop', e => e.preventDefault());
	};

	initializeSoundEngine = () => {
		// console.log('initializeSoundEngine');

		this.audioContext = new Context();

		this.output = new Output(
			this.audioContext,
			this.state.volume,
			this.state.attack,
			this.state.decay,
			this.state.sustain,
			this.state.release,
			this.state.osc1Shape,
			this.state.osc1Octave,
			this.state.osc1Transpose,
			this.state.osc1Detune,
			this.state.osc1Gain,
			this.state.osc2Shape,
			this.state.osc2Octave,
			this.state.osc2Transpose,
			this.state.osc2Detune,
			this.state.osc2Gain,
			this.state.filter1Type,
			this.state.filter1Freq,
			this.state.filter1Q,
			this.state.filter2Type,
			this.state.filter2Freq,
			this.state.filter2Q
		);
	};

	resumeAudioContext = () => {
		// console.log('resumeAudioContext');

		if (!this.state.audioContextStarted) {
			this.audioContext.resume();
			this.setState({audioContextStarted: true});
		}
	};

	/** GLOBAL EVENT HANDLERS */

	handleKeyDown = e => {
		// console.log("handleKeyDown", e);

		e.preventDefault();
		const keyPressed = e.key.toLowerCase();
		const pianoKey = LAYOUTS[this.state.layout][keyPressed];

		if (pianoKey) {
			this.activatePianoKey(pianoKey);
		} else if (keyPressed === 'control' || keyPressed === 'command') {
			this.setState({activeModifierKey: true});
		}

		this.resumeAudioContext();
	};

	handleKeyUp = e => {
		// console.log("handleKeyUp", e);

		const keyReleased = e.key.toLowerCase();

		if (keyReleased === 'control' || keyReleased === 'command')
			this.setState({activeModifierKey: false});

		const pianoKey = LAYOUTS[this.state.layout][keyReleased];
		if (pianoKey) {
			this.deactivatePianoKey(pianoKey);
		}
	};

	handleMouseDown = e => {
		// console.log('handleMouseDown', e);

		this.resumeAudioContext();
	};

	handleMouseUp = e => {
		// console.log('handleMouseUp', e);

		this.mouseDownOnKeys = false;
		this.state.activeControl &&
			this.setState({
				activeControl: null,
				activeModifierKey: false
			});
	};

	handleMouseLeave = e => {
		// console.log("handleMouseLeave", e);
	};

	handleMouseOut = e => {
		// console.log("handleMouseOut", e);
	};

	/** PIANO KEYS */

	handleMouseDownPianoKey = e => {
		// console.log('handleMouseDownPianoKey', e);

		if (e.button === 0) {
			this.activatePianoKey(e.target.title);
			this.mouseDownOnKeys = true;
		}
	};

	handleMouseUpPianoKey = e => {
		// console.log('handleMouseUpPianoKey', e);

		if (e.button === 0) {
			this.mouseDownOnKeys = false;
			this.deactivatePianoKey(e.target.title);
		}
	};

	handleMouseOverPianoKey = e => {
		// console.log("handleMouseOverPianoKey", e);

		this.mouseDownOnKeys && this.activatePianoKey(e.target.title);
	};

	handleMouseLeavePianoKey = e => {
		// console.log("handleMouseLeavePianoKey", e);

		this.mouseDownOnKeys && this.deactivatePianoKey(e.target.title);
	};

	activatePianoKey = key => {
		// console.log('activatePianoKey', key);

		if (!this.state.activeKeys.includes(key)) {
			this.output.startPlayingKey(KEYS_MAP[key].freq);
			this.setState(prevState => ({
				activeKeys: [...prevState.activeKeys, key]
			}));
		}
	};

	deactivatePianoKey = key => {
		// console.log('deactivatePianoKey', key);

		this.output.stopPlayingKey(KEYS_MAP[key].freq);

		this.setState(prevState => ({
			activeKeys: prevState.activeKeys.filter(k => k !== key)
		}));
	};

	/** SYNTH CONTROLS */

	handleMouseDownControl = (activeControl, activeControlType, e) => {
		// console.log('handleMouseDownControl', activeControl, activeControlType, e);

		if (e.button === 0) {
			// left click
			if (this.state.activeModifierKey) {
				// holding ctrl
				this.resetControlValue(activeControl);
			} else {
				this.activateControl(activeControl, activeControlType, e.screenY);
			}
		}
	};

	handleMouseUpControl = (activeControl, e) => {
		// console.log('handleMouseUpControl', activeControl, e);

		if (e.button === 0) {
			this.deactivateControl(activeControl);
		}
	};

	handleMouseMoveControl = event => {
		// console.log("handleMouseMoveControl", event, this.state);

		const {activeModifierKey, activeControl, activeControlType, activeScreenY} = this.state;

		if (activeControl) {
			let pixelStep = CONTROL_TYPES[activeControlType].pixelStep || 5;

			if (activeModifierKey) {
				pixelStep *= 10;
			}

			const movement = Math.abs(event.screenY - activeScreenY);

			let change = 0;
			if (event.screenY - pixelStep > activeScreenY) {
				change = Math.round(-movement / pixelStep);
			} else if (event.screenY + pixelStep < activeScreenY) {
				change = Math.round(movement / pixelStep);
			}

			if (change) {
				const newState = {...this.state};
				newState['activeScreenY'] = event.screenY;
				this.setState(newState);
				this.changeControlValue(activeControl, change);
			}
		}
	};

	handleMouseWheelControl = (activeControl, activeControlType, e) => {
		// console.log('handleMouseWheelControl', activeControl, activeControlType, e.deltaY);

		const {pixelStep} = CONTROL_TYPES[activeControlType];

		const change = e.deltaY > 0 ? -1 : 1;
		const value = change * Math.round(5 / pixelStep);
		this.changeControlValue(activeControl, value);
		return false;
	};

	activateControl = (activeControl, activeControlType, screenY) => {
		// console.log('activateControl', activeControl, activeControlType, screenY);

		document.addEventListener('mousemove', this.handleMouseMoveControl);

		this.setState({
			activeControl,
			activeControlType,
			activeScreenY: screenY
		});
	};

	deactivateControl = activeControl => {
		// console.log('deactiveControl', activeControl);

		document.removeEventListener('mousemove', this.handleMouseMoveControl);

		this.setState({activeControl: null});
	};

	changeControlValue = (control, change) => {
		// console.log('changeControlValue', control, change);

		const newState = {...this.state};

		const minValue = CONTROLS[control].range.min;
		const maxValue = CONTROLS[control].range.max;

		let value = newState[control] + change;

		if (value > maxValue) value = maxValue;
		else if (value < minValue) value = minValue;

		newState[control] = value;

		this.output.set(control, value);

		this.setState(newState);
	};

	resetControlValue = control => {
		const newState = {...this.state};
		const newVal = CONTROLS[control].defaultValue;
		newState[control] = newVal;

		this.setState(newState);
	};

	render() {
		// console.log("State:", this.state);

		return (
			<div
				id="container"
				// onContextMenu={(e) => {e.preventDefault()}}
			>
				<Synth
					{...this.state}
					handleMouseDownPianoKey={this.handleMouseDownPianoKey}
					handleMouseUpPianoKey={this.handleMouseUpPianoKey}
					handleMouseOverPianoKey={this.handleMouseOverPianoKey}
					handleMouseLeavePianoKey={this.handleMouseLeavePianoKey}
					handleMouseDownControl={this.handleMouseDownControl}
					handleMouseUpControl={this.handleMouseUpControl}
					handleMouseWheelControl={this.handleMouseWheelControl}
				/>
			</div>
		);
	}
}

export default App;
