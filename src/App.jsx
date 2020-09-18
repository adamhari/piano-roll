import React, {Component} from 'react';
import styled from 'styled-components/macro';
import {
	CONTROL_TYPES,
	CONTROLS,
	CONTROLS_NAMES,
	CONTROLS_DEFAULT_VALUES,
	KEYS_MAP,
	LAYOUTS,
	MODIFIER_KEYS,
} from './js/statics';
import {getValueFromRange} from './js/utils';
import {audioContext} from './js/globals';
import Instrument from './components/Instrument';
import Output from './js/classes/Output';
import GlobalStyle from './styles/global';

const Container = styled.div`
	display: flex;
	flex: 1;
	justify-content: center;
	padding: 1rem;
`;

class App extends Component {
	/** LIFECYCLE */

	constructor(props) {
		super(props);
		this.state = {
			octaves: 6,
			activeKeys: [],
			activeControl: null,
			activeControlType: null,
			activeScreenY: null,
			activeModifierKey: false,
			audioContextStarted: false,
			...CONTROLS_DEFAULT_VALUES,
		};
	}

	componentDidMount = () => {
		this.initializeSoundEngine();
		this.registerEventListeners();
	};

	componentWillUnmount = () => {};

	/** INIT */

	registerEventListeners = () => {
		// console.log("registerEvents");

		window.addEventListener('beforeunload', this.terminateSoundEngine);
		window.addEventListener('blur', this.handleBlur);

		document.addEventListener('keydown', this.handleKeyDown);
		document.addEventListener('keyup', this.handleKeyUp);

		document.addEventListener('mousedown', this.handleMouseDown);
		document.addEventListener('mouseup', this.handleMouseUp);
		document.addEventListener('mouseleave', this.handleMouseLeave);
		document.addEventListener('mouseout', this.handleMouseOut);

		document.addEventListener('drag', (e) => e.preventDefault());
		document.addEventListener('dragend', (e) => e.preventDefault());
		document.addEventListener('dragenter', (e) => e.preventDefault());
		document.addEventListener('dragexit', (e) => e.preventDefault());
		document.addEventListener('dragleave', (e) => e.preventDefault());
		document.addEventListener('dragover', (e) => e.preventDefault());
		document.addEventListener('dragstart', (e) => e.preventDefault());
		document.addEventListener('drop', (e) => e.preventDefault());
	};

	initializeSoundEngine = () => {
		// console.log('initializeSoundEngine');
		this.setOutputFromState();
	};

	terminateSoundEngine = () => {
		audioContext && audioContext.dispose();
	};

	setOutputFromState = () => {
		// console.log("setOutputFromState");

		const controlsState = CONTROLS_NAMES.map((n) => this.state[n]);
		this.output = new Output(this, audioContext, ...controlsState);
	};

	resumeAudioContext = () => {
		// console.log('resumeAudioContext');

		if (!this.state.audioContextStarted) {
			audioContext.resume();
			this.setState({audioContextStarted: true});
		}
	};

	/** GLOBAL EVENT HANDLERS */

	handleBlur = (e) => {
		// console.log('handleBlur', e);

		this.setState({activeModifierKey: false});
	};

	handleKeyDown = (e) => {
		// console.log('handleKeyDown', e);

		e.preventDefault();
		const keyPressed = e.key.toLowerCase();
		const pianoKey = LAYOUTS[this.state.layout][keyPressed];

		if (pianoKey) {
			this.activatePianoKey(pianoKey);
		} else if (MODIFIER_KEYS.includes(keyPressed)) {
			this.setState({activeModifierKey: true});
		}

		this.resumeAudioContext();
	};

	handleKeyUp = (e) => {
		// console.log("handleKeyUp", e);

		const keyReleased = e.key.toLowerCase();

		if (MODIFIER_KEYS.includes(keyReleased)) {
			this.setState({activeModifierKey: false});
		}

		const pianoKey = LAYOUTS[this.state.layout][keyReleased];
		if (pianoKey) {
			this.deactivatePianoKey(pianoKey);
		}
	};

	handleMouseDown = (e) => {
		// console.log('handleMouseDown', e);

		this.resumeAudioContext();
	};

	handleMouseUp = (e) => {
		// console.log('handleMouseUp', e);

		this.mouseDownOnKeys = false;
		this.state.activeControl &&
			this.setState({
				activeControl: null,
				activeModifierKey: false,
			});
	};

	handleMouseLeave = (e) => {
		// console.log("handleMouseLeave", e);
	};

	handleMouseOut = (e) => {
		// console.log("handleMouseOut", e);
	};

	/** PIANO KEYS */

	handleMouseDownPianoKey = (e) => {
		// console.log('handleMouseDownPianoKey', e);

		if (e.button === 0) {
			this.activatePianoKey(e.target.title);
			this.mouseDownOnKeys = true;
		}
	};

	handleMouseUpPianoKey = (e) => {
		// console.log('handleMouseUpPianoKey', e);

		if (e.button === 0) {
			this.mouseDownOnKeys = false;
			this.deactivatePianoKey(e.target.title);
		}
	};

	handleMouseOverPianoKey = (e) => {
		// console.log("handleMouseOverPianoKey", e);
		// this.mouseDownOnKeys && this.activatePianoKey(e.target.title);
	};

	handleMouseLeavePianoKey = (e) => {
		// console.log("handleMouseLeavePianoKey", e);

		this.mouseDownOnKeys && this.deactivatePianoKey(e.target.title);
	};

	activatePianoKey = (key) => {
		// console.log('activatePianoKey', key);

		if (!this.state.activeKeys.includes(key)) {
			this.output.playKey(KEYS_MAP[key].freq);
			this.setState((prevState) => ({
				activeKeys: [...prevState.activeKeys, key],
			}));
		}
	};

	deactivatePianoKey = (key) => {
		// console.log('deactivatePianoKey', key);

		if (this.state.activeKeys.includes(key)) {
			this.output.stopKey(KEYS_MAP[key].freq);
			this.setState((prevState) => ({
				activeKeys: prevState.activeKeys.filter((k) => k !== key),
			}));
		}
	};

	/** SYNTH CONTROLS */

	handleClickControl = (control, value) => {
		// console.log(`handleClickControl(${control}, ${value})`);

		this.setControlValue(control, value);
	};

	handleMouseDownControl = (activeControl, activeControlType, e) => {
		console.log('handleMouseDownControl', activeControl, activeControlType, e);

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

	handleMouseMoveControl = (event) => {
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

		// const {pixelStep} = CONTROL_TYPES[activeControlType];

		// const change = e.deltaY > 0 ? -1 : 1;
		// const value = change * Math.round(5 / pixelStep);
		// this.changeControlValue(activeControl, value);
		return false;
	};

	activateControl = (activeControl, activeControlType, screenY) => {
		// console.log('activateControl', activeControl, activeControlType, screenY);

		document.addEventListener('mousemove', this.handleMouseMoveControl);

		this.setState({
			activeControl,
			activeControlType,
			activeScreenY: screenY,
		});
	};

	deactivateControl = (activeControl) => {
		// console.log('deactiveControl', activeControl);

		document.removeEventListener('mousemove', this.handleMouseMoveControl);

		this.setState({activeControl: null});
	};

	changeControlValue = (control, change) => {
		// console.log('changeControlValue', control, change);

		const {range} = CONTROLS[control];

		let value = Number.isInteger(this.state[control]) ? this.state[control] + change : 0;

		if (range) {
			value = getValueFromRange(value, range);
		}

		this.setControlValue(control, value);
	};

	setControlValue = (control, value) => {
		console.log('setControlValue', control, value);

		this.output.set(control, value);
		this.setState({[control]: value});
	};

	resetControlValue = (control) => {
		console.log('resetControlValue', control);
		this.setState({[control]: CONTROLS[control].defaultValue});
	};

	render() {
		// console.log("State:", this.state);

		return (
			<>
				<GlobalStyle />
				<Container
				// onContextMenu={(e) => {
				// 	e.preventDefault();
				// }}
				>
					<Instrument
						{...this.state}
						handleMouseDownPianoKey={this.handleMouseDownPianoKey}
						handleMouseUpPianoKey={this.handleMouseUpPianoKey}
						handleMouseOverPianoKey={this.handleMouseOverPianoKey}
						handleMouseLeavePianoKey={this.handleMouseLeavePianoKey}
						handleClickControl={this.handleClickControl}
						handleMouseDownControl={this.handleMouseDownControl}
						handleMouseUpControl={this.handleMouseUpControl}
						handleMouseWheelControl={this.handleMouseWheelControl}
						handleMidiKeyDown={this.activatePianoKey}
						handleMidiKeyUp={this.deactivatePianoKey}
					/>
				</Container>
			</>
		);
	}
}

export default App;
