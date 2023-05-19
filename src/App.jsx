import React, {Component} from 'react';
import styled, {css} from 'styled-components/macro';
import {
	CONTROL_TYPES,
	CONTROLS,
	CONTROLS_DEFAULT_VALUES,
	KEYS_MAP,
	LAYOUTS,
	MODIFIER_KEYS,
} from './js/statics';
import {getValueFromRange} from './js/utils';
import {audioContext} from './js/globals';
import Output from './js/classes/Output';
import GlobalStyle from './styles/global';
import {border, color, labelText, controlOutline} from './styles';
import PianoKeys from './components/PianoKeys';
import ButtonControl from './components/controls/button/ButtonControl';
import DigitalControl from './components/controls/DigitalControl';
import KnobControl from './components/controls/KnobControl';
import FileInputButtonControl from './components/controls/button/FileInputButtonControl';
import InputRecorderButtonControl from './components/controls/button/InputRecorderButtonControl';
import {MODES} from './js/statics';
import MidiInputDropdown from './components/MidiInputDropdown';
import Waveform from './components/Waveform';
import Meter from './components/Meter';

/* STYLING */

const Container = styled.div`
	display: flex;
	flex: 1;
	justify-content: center;
	padding: 1rem;
`;

const Instrument = styled.div`
	user-select: none;
	display: flex;
	background-color: ${color.instrumentPlastic};
	padding: 0rem 3rem 0.25rem 0rem;

	border: ${border.instrument};
	border-top-left-radius: 2.4rem 1.8rem;
	border-top-right-radius: 2.4rem 1.8rem;
	border-bottom-left-radius: 0.8rem 0.8rem;
	border-bottom-right-radius: 0.8rem 0.8rem;
`;

const InstrumentRight = styled.div``;

const InstrumentLeft = styled.div`
	display: flex;
	align-items: flex-end;
`;

const InstrumentBottomLeft = styled.div`
	padding: 4.4375rem 3rem;
`;

const InstrumentRightTop = styled.div`
	display: flex;
	height: 19rem;
	padding: 1rem 0;
`;

const InstrumentRightTopLeft = styled.div``;

const InstrumentRightTopRight = styled.div`
	display: flex;
	flex: 1;
	align-items: center;
`;

const InstrumentRightBottom = styled.div``;

const GlobalSection = styled.div`
	display: flex;
	height: 100%;
	flex-flow: column nowrap;
	justify-content: space-between;
	align-items: center;
	margin-top: 0.5rem;
`;

const LogoSection = styled.div`
	cursor: default;
	position: relative;
	color: ${color.label};
	width: 13rem;
	height: 4.375rem;
`;

const Logo = styled.svg`
	width: 12rem;
`;

const LogoSubtext = styled.div`
	position: absolute;
	left: -0.0625rem;
	line-height: 1.25;
	text-transform: uppercase;
	font-style: italic;
	font-weight: 400;
	letter-spacing: 0.125rem;
`;

const LogoSubtextBold = styled.span`
	display: inline-block;
	font-weight: 800;
	font-size: 1.0625rem;
	letter-spacing: -0.053125rem;
	padding-right: 0.0625rem;
`;

const GlobalControls = styled.div`
	display: flex;
`;

const VolumeSection = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
`;

const EnvelopeControls = styled.div`
	display: grid;
	grid-template-columns: auto auto;
	grid-template-rows: auto auto;
	height: 9rem;
	margin: 0 1rem;
`;

const ControlSection = styled.div`
	height: 100%;
	display: flex;
	flex-flow: column nowrap;
	justify-content: space-between;

	margin-left: 1rem;
`;

const ControlWrapper = styled.div`
	display: flex;
	flex-flow: column nowrap;

	&:not(:last-child) {
		margin-bottom: 1rem;
	}
`;

const ControlWrapperVertical = styled(ControlWrapper)`
	height: 100%;
`;

const ControlWrapperHorizontal = styled(ControlWrapper)`
	height: 50%;
`;

const ControlsContainer = styled.div`
	${controlOutline};
	height: 100%;
	display: flex;
	padding: 0.75rem 1rem;
	flex-flow: column nowrap;
	justify-content: space-between;
`;

const ControlsContainerHorizontal = styled(ControlsContainer)`
	flex-flow: row nowrap;
`;

const ControlsSubContainer = styled.div`
	display: flex;
	justify-content: center;
`;

const controlOutlineLabel = css`
	${labelText};
	color: ${color.instrumentPlastic};
	background-color: ${color.label};
	border-top-left-radius: 0.25rem;
	border-top-right-radius: 0.25rem;
`;

const ControlsContainerLabel = styled.div`
	${controlOutlineLabel};
	text-align: center;
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
		this.output = new Output(this, audioContext);
	};

	terminateSoundEngine = () => {
		audioContext && audioContext.dispose();
	};

	resumeAudioContext = () => {
    if (audioContext.state !== 'running') {
      audioContext.resume();
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

	/* RENDER FUNCTIONS */

	renderLeftControls = () => (
		<InstrumentBottomLeft>
			<DigitalControl
				{...this.sharedControlProps}
				name='polyphony'
				label='poly'
				value={this.state.polyphony}
			/>
			<br />
			{/* <KnobControl
        {...this.sharedControlProps}
        name="portamento"
        label="porta"
        value={portamento}
        size="medium"
      />
      <br /> */}
			<DigitalControl
				{...this.sharedControlProps}
				name='layout'
				value={this.state.layout}
				outline={true}
			/>
		</InstrumentBottomLeft>
	);

	renderGlobalSection = () => (
		<GlobalSection>
			{this.renderLogo()}
			{this.renderInputDropdown()}
			{this.renderGlobalControls()}
		</GlobalSection>
	);

	renderLogo = () => (
		<LogoSection>
			<Logo viewBox='304.103 332.216 470.661 104.256'>
				<g>
					<path
						d='M 654.248 361.208 L 652.04 368.792 L 623.528 431 L 608.264 431 L 635.24 373.784 L 617.768 373.784 L 621.512 361.208 L 654.248 361.208 Z '
						fill='rgb(171,171,171)'
					/>
					<path
						d=' M 688.821 378.476 L 677.685 416.396 L 677.685 416.396 Q 676.725 419.564 675.093 422.54 L 675.093 422.54 L 675.093 422.54 Q 673.461 425.516 670.869 427.724 L 670.869 427.724 L 670.869 427.724 Q 668.277 429.932 664.533 431.228 L 664.533 431.228 L 664.533 431.228 Q 660.789 432.524 655.797 432.332 L 655.797 432.332 L 655.797 432.332 Q 652.917 432.236 649.845 431.324 L 649.845 431.324 L 649.845 431.324 Q 646.773 430.412 644.613 428.3 L 644.613 428.3 L 644.613 428.3 Q 642.453 426.188 641.685 422.732 L 641.685 422.732 L 641.685 422.732 Q 640.917 419.276 642.453 414.092 L 642.453 414.092 L 654.261 373.868 L 654.261 373.868 Q 656.565 366.188 661.845 363.02 L 661.845 363.02 L 661.845 363.02 Q 667.125 359.852 674.709 359.852 L 674.709 359.852 L 674.709 359.852 Q 684.021 359.852 687.813 364.364 L 687.813 364.364 L 687.813 364.364 Q 691.605 368.876 688.821 378.476 L 688.821 378.476 Z  M 662.901 417.548 L 675.189 375.596 L 675.189 375.596 Q 675.765 373.58 675.333 372.428 L 675.333 372.428 L 675.333 372.428 Q 674.901 371.276 672.693 371.276 L 672.693 371.276 L 672.693 371.276 Q 670.677 371.276 669.717 372.38 L 669.717 372.38 L 669.717 372.38 Q 668.757 373.484 668.277 375.308 L 668.277 375.308 L 655.893 417.164 L 655.893 417.164 Q 654.741 421.1 658.293 421.196 L 658.293 421.196 L 658.293 421.196 Q 660.213 421.292 661.269 420.428 L 661.269 420.428 L 661.269 420.428 Q 662.325 419.564 662.901 417.548 L 662.901 417.548 Z '
						fillRule='evenodd'
						fill='rgb(171,171,171)'
					/>
					<path
						d=' M 735.656 361.208 L 726.92 390.872 L 726.92 390.872 Q 725.288 396.248 717.992 396.152 L 717.992 396.152 L 717.992 396.152 Q 721.448 396.344 722.696 398.792 L 722.696 398.792 L 722.696 398.792 Q 723.944 401.24 722.984 404.312 L 722.984 404.312 L 715.112 431 L 700.52 431 L 708.584 403.736 L 708.584 403.736 Q 708.872 402.68 708.632 401.96 L 708.632 401.96 L 708.632 401.96 Q 708.392 401.24 706.76 401.24 L 706.76 401.24 L 704.552 401.24 L 704.552 401.24 Q 702.92 401.24 702.344 401.624 L 702.344 401.624 L 702.344 401.624 Q 701.768 402.008 701.384 403.256 L 701.384 403.256 L 693.128 431 L 678.536 431 L 686.6 403.64 L 686.6 403.64 Q 686.984 402.296 687.608 401 L 687.608 401 L 687.608 401 Q 688.232 399.704 689.192 398.648 L 689.192 398.648 L 689.192 398.648 Q 690.152 397.592 691.688 396.872 L 691.688 396.872 L 691.688 396.872 Q 693.224 396.152 695.528 396.056 L 695.528 396.056 L 695.528 396.056 Q 692.168 396.056 691.112 393.944 L 691.112 393.944 L 691.112 393.944 Q 690.056 391.832 690.92 388.952 L 690.92 388.952 L 699.08 361.208 L 713.672 361.208 L 705.608 388.76 L 705.608 388.76 Q 705.224 390.104 705.8 390.536 L 705.8 390.536 L 705.8 390.536 Q 706.376 390.968 707.528 390.968 L 707.528 390.968 L 710.12 390.968 L 710.12 390.968 Q 711.176 390.968 711.848 390.536 L 711.848 390.536 L 711.848 390.536 Q 712.52 390.104 713 388.472 L 713 388.472 L 721.064 361.208 L 735.656 361.208 Z '
						fill='rgb(171,171,171)'
					/>
					<path
						d=' M 720.296 431 L 740.84 361.208 L 768.488 361.208 L 768.488 361.208 Q 772.424 361.208 773.864 363.656 L 773.864 363.656 L 773.864 363.656 Q 775.304 366.104 774.44 369.08 L 774.44 369.08 L 758.984 421.592 L 758.984 421.592 Q 758.12 424.664 756.824 426.536 L 756.824 426.536 L 756.824 426.536 Q 755.528 428.408 753.56 429.416 L 753.56 429.416 L 753.56 429.416 Q 751.592 430.424 748.904 430.712 L 748.904 430.712 L 748.904 430.712 Q 746.216 431 742.472 431 L 742.472 431 L 720.296 431 Z  M 756.584 372.44 L 751.976 372.44 L 738.152 419.384 L 742.76 419.384 L 742.76 419.384 Q 744.488 419.384 745.16 418.808 L 745.16 418.808 L 745.16 418.808 Q 745.832 418.232 746.216 416.984 L 746.216 416.984 L 758.408 375.512 L 758.408 375.512 Q 758.888 373.976 758.552 373.208 L 758.552 373.208 L 758.552 373.208 Q 758.216 372.44 756.584 372.44 L 756.584 372.44 Z '
						fillRule='evenodd'
						fill='rgb(171,171,171)'
					/>
					<path
						d=' M 608.48 405.752 L 605.408 416.216 L 599.456 416.216 L 595.04 431 L 580.64 431 L 585.056 416.216 L 564.224 416.216 L 568.448 401.528 L 595.52 361.208 L 615.68 361.208 L 602.528 405.752 L 608.48 405.752 Z  M 580.544 405.752 L 588.032 405.752 L 595.424 380.408 L 580.928 404.504 L 580.544 405.752 Z '
						fillRule='evenodd'
						fill='rgb(171,171,171)'
					/>
					<path
						d=' M 403.136 361.208 L 382.592 431 L 368.192 431 L 376.832 401.528 L 369.536 401.528 L 360.8 431 L 346.4 431 L 366.944 361.208 L 381.344 361.208 L 373.184 389.144 L 380.48 389.144 L 388.736 361.208 L 403.136 361.208 Z '
						fill='rgb(171,171,171)'
					/>
					<path
						d=' M 414.944 362.208 L 435.872 362.208 L 435.872 362.208 Q 439.232 362.208 440.816 364.656 L 440.816 364.656 L 440.816 364.656 Q 442.4 367.104 441.536 370.176 L 441.536 370.176 L 425.504 424.608 L 425.504 424.608 Q 424.16 428.928 421.04 430.464 L 421.04 430.464 L 421.04 430.464 Q 417.92 432 414.272 432 L 414.272 432 L 397.088 432 L 397.088 432 Q 395.264 432 393.728 431.376 L 393.728 431.376 L 393.728 431.376 Q 392.192 430.752 391.184 429.504 L 391.184 429.504 L 391.184 429.504 Q 390.176 428.256 389.84 426.48 L 389.84 426.48 L 389.84 426.48 Q 389.504 424.704 390.176 422.496 L 390.176 422.496 L 405.92 369.024 L 405.92 369.024 Q 406.688 365.952 409.04 364.08 L 409.04 364.08 L 409.04 364.08 Q 411.392 362.208 414.944 362.208 L 414.944 362.208 Z  M 424.448 372.44 L 420.8 372.44 L 420.8 372.44 Q 419.744 372.44 419.264 372.92 L 419.264 372.92 L 419.264 372.92 Q 418.784 373.4 418.592 374.168 L 418.592 374.168 L 405.728 417.656 L 405.728 417.656 Q 405.248 419.384 407.072 419.384 L 407.072 419.384 L 410.816 419.384 L 410.816 419.384 Q 412.64 419.384 413.12 417.656 L 413.12 417.656 L 425.888 374.264 L 425.888 374.264 Q 426.368 372.44 424.448 372.44 L 424.448 372.44 Z '
						fillRule='evenodd'
						fill='rgb(171,171,171)'
					/>
					<path
						d=' M 456.032 361.208 L 480.032 361.208 L 476.288 373.784 L 461.312 373.784 L 461.312 373.784 Q 460.16 373.784 459.536 374.168 L 459.536 374.168 L 459.536 374.168 Q 458.912 374.552 458.528 375.896 L 458.528 375.896 L 446.528 416.6 L 446.528 416.6 Q 445.76 419.384 448.736 419.384 L 448.736 419.384 L 453.632 419.384 L 458.912 401.528 L 455.936 401.528 L 459.584 389.144 L 476.288 389.144 L 464.768 428.312 L 448.64 436.472 L 450.176 431 L 441.248 431 L 441.248 431 Q 438.752 431 436.64 430.28 L 436.64 430.28 L 436.64 430.28 Q 434.528 429.56 433.136 427.976 L 433.136 427.976 L 433.136 427.976 Q 431.744 426.392 431.312 423.944 L 431.312 423.944 L 431.312 423.944 Q 430.88 421.496 431.936 418.04 L 431.936 418.04 L 446.72 367.736 L 446.72 367.736 Q 447.872 363.8 450.224 362.504 L 450.224 362.504 L 450.224 362.504 Q 452.576 361.208 456.032 361.208 L 456.032 361.208 Z '
						fill='rgb(171,171,171)'
					/>
					<path
						d=' M 503.648 361.208 L 503.552 361.208 L 487.328 416.408 L 487.328 416.408 Q 486.848 418.04 487.472 418.664 L 487.472 418.664 L 487.472 418.664 Q 488.096 419.288 489.728 419.288 L 489.728 419.288 L 493.472 419.288 L 510.56 361.208 L 524.96 361.208 L 505.184 428.312 Q 505.17 428.341 504.62 428.413 Q 498.832 431.016 490.112 431 L 481.76 431 L 481.76 431 Q 479.072 431 476.912 430.28 L 476.912 430.28 L 476.912 430.28 Q 474.752 429.56 473.408 427.976 L 473.408 427.976 L 473.408 427.976 Q 472.064 426.392 471.728 423.944 L 471.728 423.944 L 471.728 423.944 Q 471.392 421.496 472.448 418.04 L 472.448 418.04 L 489.152 361.208 L 503.648 361.208 Z '
						fill='rgb(171,171,171)'
					/>
					<path
						d=' M 509.216 431 L 529.76 361.208 L 542.144 361.208 L 542.624 388.184 L 550.592 361.208 L 564.608 361.208 L 544.064 431 L 532.448 431 L 531.2 403.16 L 522.848 431 L 509.216 431 Z '
						fill='rgb(171,171,171)'
					/>
					<path
						d=' M 317.72 375.896 L 343.928 375.896 L 343.928 375.896 Q 346.712 375.896 348.872 376.664 L 348.872 376.664 L 348.872 376.664 Q 351.032 377.432 352.328 379.112 L 352.328 379.112 L 352.328 379.112 Q 353.624 380.792 353.864 383.384 L 353.864 383.384 L 353.864 383.384 Q 354.104 385.976 353.048 389.624 L 353.048 389.624 L 343.256 422.936 L 343.256 422.936 Q 342.488 425.528 341.096 427.112 L 341.096 427.112 L 341.096 427.112 Q 339.704 428.696 338.024 429.56 L 338.024 429.56 L 338.024 429.56 Q 336.344 430.424 334.472 430.712 L 334.472 430.712 L 334.472 430.712 Q 332.6 431 330.776 431 L 330.776 431 L 311.864 431 L 311.864 431 Q 307.736 431 305.48 428.024 L 305.48 428.024 L 305.48 428.024 Q 303.224 425.048 304.664 420.248 L 304.664 420.248 L 309.464 403.736 L 324.728 403.736 L 321.08 415.832 L 321.08 415.832 Q 320.696 417.08 321.272 417.416 L 321.272 417.416 L 321.272 417.416 Q 321.848 417.752 322.712 417.752 L 322.712 417.752 L 326.36 417.752 L 326.36 417.752 Q 327.704 417.752 328.376 417.32 L 328.376 417.32 L 328.376 417.32 Q 329.048 416.888 329.432 415.544 L 329.432 415.544 L 337.208 389.24 L 337.208 389.24 Q 337.4 388.664 337.256 388.28 L 337.256 388.28 L 337.256 388.28 Q 337.112 387.896 336.152 387.896 L 336.152 387.896 L 314.168 387.896 L 317.72 375.896 Z '
						fill='rgb(171,171,171)'
					/>
					<path
						d=' M 333.729 375.977 L 317.697 375.977 L 327.489 341.029 L 327.489 341.029 Q 328.257 338.294 329.505 336.572 L 329.505 336.572 L 329.505 336.572 Q 330.753 334.85 332.337 333.888 L 332.337 333.888 L 332.337 333.888 Q 333.921 332.925 335.745 332.621 L 335.745 332.621 L 335.745 332.621 Q 337.569 332.318 339.393 332.318 L 339.393 332.318 L 369.249 332.318 L 361.281 361.086 L 345.057 364.935 L 350.433 345.79 L 344.385 345.79 L 344.385 345.79 Q 343.041 345.79 342.417 346.246 L 342.417 346.246 L 342.417 346.246 Q 341.793 346.702 341.409 348.12 L 341.409 348.12 L 333.729 375.977 Z '
						fill='rgb(171,171,171)'
					/>
				</g>
			</Logo>
			<LogoSubtext>
				<LogoSubtextBold>
					<span>Re</span>
					<span style={{letterSpacing: '-0.15625rem'}}>a</span>
					<span>ct</span>
				</LogoSubtextBold>
				<span style={{marginLeft: '0.5rem'}}>Instrument</span>
			</LogoSubtext>
		</LogoSection>
	);

	renderInputDropdown = () => (
		<MidiInputDropdown
			handleMidiKeyDown={this.activatePianoKey}
			handleMidiKeyUp={this.deactivatePianoKey}
		/>
	);

	renderGlobalControls = () => (
		<GlobalControls>
			{this.renderVolumeSection()}
			{this.renderEnvelopeSection()}
		</GlobalControls>
	);

	renderVolumeSection = () => (
		<VolumeSection>
			<KnobControl
				{...this.sharedControlProps}
				name='volume'
				value={this.state.volume}
				size='large'
      />
      <Meter meter={this.output?.meter} />
		</VolumeSection>
	);

	renderEnvelopeSection = () => (
		<EnvelopeControls>
			<div>
				<KnobControl
					{...this.sharedControlProps}
					name='attack'
					value={this.state.attack}
					size='small'
				/>
			</div>
			<div>
				<KnobControl
					{...this.sharedControlProps}
					name='decay'
					value={this.state.decay}
					size='small'
				/>
			</div>
			<div>
				<KnobControl
					{...this.sharedControlProps}
					name='sustain'
					value={this.state.sustain}
					size='small'
				/>
			</div>
			<div>
				<KnobControl
					{...this.sharedControlProps}
					name='release'
					value={this.state.release}
					size='small'
				/>
			</div>
		</EnvelopeControls>
	);

	renderModeSelector = () => (
		<ControlSection>
			<ControlWrapperVertical>
				<ControlsContainerLabel>MODE</ControlsContainerLabel>
				<ControlsContainer>
					<ButtonControl
						{...this.sharedControlProps}
						name='mode'
						label={'SYNTH'}
						value={MODES.SYNTH}
						active={this.state.mode === MODES.SYNTH}
						size='large'
						light={true}
					/>
					<ButtonControl
						{...this.sharedControlProps}
						name='mode'
						label={'SAMPLER'}
						value={MODES.SAMPLER}
						active={this.state.mode === MODES.SAMPLER}
						size='large'
						light={true}
					/>
				</ControlsContainer>
			</ControlWrapperVertical>
		</ControlSection>
	);

	renderAudioSource = () =>
		this.state.mode === MODES.SAMPLER ? this.renderSampler() : this.renderSynth();

	renderSampler = () => (
		<ControlSection>
			<ControlWrapperVertical>
				<ControlsContainerLabel>SAMPLE</ControlsContainerLabel>
				<ControlsContainer>
					<ControlsSubContainer>
						{/* <DigitalControl {...props} name='sample' label='select' value={sample} /> */}
						<FileInputButtonControl
							handleClickControl={this.handleClickControl}
							name='sample'
							label='load'
							value={'load'}
							size='small'
						/>
						<InputRecorderButtonControl
							handleClickControl={this.handleClickControl}
							name={'sample'}
							label='record'
							size='small'
							light={true}
						/>
					</ControlsSubContainer>
					<Waveform sampleUrl={this.state.sample} />
					<ControlsSubContainer>
						<KnobControl
							{...this.sharedControlProps}
							name='samplePitch'
							label='pitch'
							value={this.state.samplePitch}
							size='small'
						/>
					</ControlsSubContainer>
				</ControlsContainer>
			</ControlWrapperVertical>
		</ControlSection>
	);

	renderSynth = () => (
		<>
			{this.renderOscillators()}
			{this.renderModOscillator()}
		</>
	);

	renderOscillators = () => (
		<ControlSection>
			<ControlWrapperHorizontal>
				<ControlsContainerLabel>OSC 1</ControlsContainerLabel>
				<ControlsContainerHorizontal>
					<DigitalControl
						{...this.sharedControlProps}
						name='osc1Shape'
						label='shape'
						value={this.state.osc1Shape}
					/>
					<DigitalControl
						{...this.sharedControlProps}
						name='osc1Octave'
						label='octave'
						value={this.state.osc1Octave}
					/>
					<DigitalControl
						{...this.sharedControlProps}
						name='osc1Transpose'
						label='trans'
						value={this.state.osc1Transpose}
					/>
					<KnobControl
						{...this.sharedControlProps}
						name='osc1Detune'
						label='tune'
						value={this.state.osc1Detune}
						size='medium'
					/>
					<KnobControl
						{...this.sharedControlProps}
						name='osc1Gain'
						label='vol'
						value={this.state.osc1Gain}
						size='medium'
					/>
				</ControlsContainerHorizontal>
			</ControlWrapperHorizontal>
			<ControlWrapperHorizontal>
				<ControlsContainerLabel>OSC 2</ControlsContainerLabel>
				<ControlsContainerHorizontal>
					<DigitalControl
						{...this.sharedControlProps}
						name='osc2Shape'
						label='shape'
						value={this.state.osc2Shape}
					/>
					<DigitalControl
						{...this.sharedControlProps}
						name='osc2Octave'
						label='octave'
						value={this.state.osc2Octave}
					/>
					<DigitalControl
						{...this.sharedControlProps}
						name='osc2Transpose'
						label='trans'
						value={this.state.osc2Transpose}
					/>
					<KnobControl
						{...this.sharedControlProps}
						name='osc2Detune'
						label='tune'
						value={this.state.osc2Detune}
						size='medium'
					/>
					<KnobControl
						{...this.sharedControlProps}
						name='osc2Gain'
						label='vol'
						value={this.state.osc2Gain}
						size='medium'
					/>
				</ControlsContainerHorizontal>
			</ControlWrapperHorizontal>
		</ControlSection>
	);

	renderModOscillator = () => (
		<ControlSection>
			<ControlWrapperVertical>
				<ControlsContainerLabel>MOD OSC</ControlsContainerLabel>
				<ControlsContainer>
					<DigitalControl
						{...this.sharedControlProps}
						name='modOscShape'
						label='shape'
						value={this.state.modOscShape}
					/>
					<KnobControl
						{...this.sharedControlProps}
						name='modOscFreq'
						label='freq'
						value={this.state.modOscFreq}
						size='small'
					/>
					<KnobControl
						{...this.sharedControlProps}
						name='modOscGain'
						label='vol'
						value={this.state.modOscGain}
						size='small'
					/>
				</ControlsContainer>
			</ControlWrapperVertical>
		</ControlSection>
	);

	renderFilters = () => (
		<ControlSection>
			<ControlWrapperHorizontal>
				<ControlsContainerLabel>FILTER 1</ControlsContainerLabel>
				<ControlsContainerHorizontal>
					<DigitalControl
						{...this.sharedControlProps}
						name='filter1Type'
						label='type'
						value={this.state.filter1Type}
					/>
					<DigitalControl
						{...this.sharedControlProps}
						name='filter1Rolloff'
						label='steep'
						value={this.state.filter1Rolloff}
					/>
					<KnobControl
						{...this.sharedControlProps}
						name='filter1Freq'
						label='cutoff'
						value={this.state.filter1Freq}
						size='medium'
					/>
					<KnobControl
						{...this.sharedControlProps}
						name='filter1Q'
						label='res'
						value={this.state.filter1Q}
						size='medium'
					/>
				</ControlsContainerHorizontal>
			</ControlWrapperHorizontal>
			<ControlWrapperHorizontal>
				<ControlsContainerLabel>FILTER 2</ControlsContainerLabel>
				<ControlsContainerHorizontal>
					<DigitalControl
						{...this.sharedControlProps}
						name='filter2Type'
						label='type'
						value={this.state.filter2Type}
					/>
					<DigitalControl
						{...this.sharedControlProps}
						name='filter2Rolloff'
						label='steep'
						value={this.state.filter2Rolloff}
					/>
					<KnobControl
						{...this.sharedControlProps}
						name='filter2Freq'
						label='cutoff'
						value={this.state.filter2Freq}
						size='medium'
					/>
					<KnobControl
						{...this.sharedControlProps}
						name='filter2Q'
						label='res'
						value={this.state.filter2Q}
						size='medium'
					/>
				</ControlsContainerHorizontal>
			</ControlWrapperHorizontal>
		</ControlSection>
	);

	renderVibrato = () => (
		<ControlSection>
			<ControlWrapperVertical>
				<ControlsContainerLabel>VIBRATO</ControlsContainerLabel>
				<ControlsContainer>
					<KnobControl
						{...this.sharedControlProps}
						name='vibratoDepth'
						label='depth'
						value={this.state.vibratoDepth}
						size='small'
					/>
					<KnobControl
						{...this.sharedControlProps}
						name='vibratoFreq'
						label='freq'
						value={this.state.vibratoFreq}
						size='small'
					/>
					<KnobControl
						{...this.sharedControlProps}
						name='vibratoWet'
						label='wet'
						value={this.state.vibratoWet}
						size='small'
					/>
				</ControlsContainer>
			</ControlWrapperVertical>
		</ControlSection>
	);

	renderChorus = () => (
		<ControlSection>
			<ControlWrapperVertical>
				<ControlsContainerLabel>CHORUS</ControlsContainerLabel>
				<ControlsContainer>
					<ControlsSubContainer>
						<KnobControl
							{...this.sharedControlProps}
							name='chorusSpread'
							label='spread'
							value={this.state.chorusSpread}
							size='small'
						/>
						<KnobControl
							{...this.sharedControlProps}
							name='chorusDepth'
							label='depth'
							value={this.state.chorusDepth}
							size='small'
						/>
					</ControlsSubContainer>
					<ControlsSubContainer>
						<KnobControl
							{...this.sharedControlProps}
							name='chorusDelay'
							label='delay'
							value={this.state.chorusDelay}
							size='small'
						/>
						<KnobControl
							{...this.sharedControlProps}
							name='chorusFreq'
							label='freq'
							value={this.state.chorusFreq}
							size='small'
						/>
					</ControlsSubContainer>
					<ControlsSubContainer>
						{/* <KnobControl
							{...this.sharedControlProps}
							name='chorusType'
							label='type'
							value={chorusType}
							size='small'
						/> */}
						<KnobControl
							{...this.sharedControlProps}
							name='chorusWet'
							label='wet'
							value={this.state.chorusWet}
							size='small'
						/>
					</ControlsSubContainer>
				</ControlsContainer>
			</ControlWrapperVertical>
		</ControlSection>
	);

	renderBitcrusher = () => (
		<ControlSection>
			<ControlWrapperVertical>
				<ControlsContainerLabel>BITCRUSHER</ControlsContainerLabel>
				<ControlsContainer>
					<DigitalControl
						{...this.sharedControlProps}
						name='crusherBits'
						label='bits'
						value={this.state.crusherBits}
					/>
					<KnobControl
						{...this.sharedControlProps}
						name='crusherWet'
						label='wet'
						value={this.state.crusherWet}
						size='small'
					/>
				</ControlsContainer>
			</ControlWrapperVertical>
		</ControlSection>
	);

	renderDistortion = () => (
		<ControlSection>
			<ControlWrapperVertical>
				<ControlsContainerLabel>DISTORTION</ControlsContainerLabel>
				<ControlsContainer>
					{/* <DigitalControl {...this.sharedControlProps} name='distOver' label='over' value={distOver} /> */}
					<KnobControl
						{...this.sharedControlProps}
						name='distAmount'
						label='amount'
						value={this.state.distAmount}
						size='small'
					/>
					<KnobControl
						{...this.sharedControlProps}
						name='distWet'
						label='wet'
						value={this.state.distWet}
						size='small'
					/>
				</ControlsContainer>
			</ControlWrapperVertical>
		</ControlSection>
	);

	renderFreqShifter = () => (
		<ControlSection>
			<ControlWrapperVertical>
				<ControlsContainerLabel>FREQ SHIFTER</ControlsContainerLabel>
				<ControlsContainer>
					<KnobControl
						{...this.sharedControlProps}
						name='freqShifterAmount'
						label='amount'
						value={this.state.freqShifterAmount}
						size='small'
					/>
					<KnobControl
						{...this.sharedControlProps}
						name='freqShifterWet'
						label='wet'
						value={this.state.freqShifterWet}
						size='small'
					/>
				</ControlsContainer>
			</ControlWrapperVertical>
		</ControlSection>
	);

	renderPitcher = () => (
		<ControlSection>
			<ControlWrapperVertical>
				<ControlsContainerLabel>PITCHER</ControlsContainerLabel>
				<ControlsContainer>
					<KnobControl
						{...this.sharedControlProps}
						name='pitcherPitch'
						label='pitch'
						value={this.state.pitcherPitch}
						size='small'
					/>
					<KnobControl
						{...this.sharedControlProps}
						name='pitcherWindow'
						label='slice'
						value={this.state.pitcherWindow}
						size='small'
					/>
					<KnobControl
						{...this.sharedControlProps}
						name='pitcherWet'
						label='wet'
						value={this.state.pitcherWet}
						size='small'
					/>
				</ControlsContainer>
			</ControlWrapperVertical>
		</ControlSection>
	);

	renderReverb = () => (
		<ControlSection>
			<ControlWrapperVertical>
				<ControlsContainerLabel>REVERB</ControlsContainerLabel>
				<ControlsContainer>
					<KnobControl
						{...this.sharedControlProps}
						name='reverbSize'
						label='size'
						value={this.state.reverbSize}
						size='small'
					/>
					<KnobControl
						{...this.sharedControlProps}
						name='reverbDampening'
						label='damp'
						value={this.state.reverbDampening}
						size='small'
					/>
					<KnobControl
						{...this.sharedControlProps}
						name='reverbWet'
						label='wet'
						value={this.state.reverbWet}
						size='small'
					/>
				</ControlsContainer>
			</ControlWrapperVertical>
		</ControlSection>
  );

	renderPianoKeys = () => (
		<PianoKeys
			activeKeys={this.state.activeKeys}
			octaves={this.state.octaves}
			handleMouseDownPianoKey={this.handleMouseDownPianoKey}
			handleMouseUpPianoKey={this.handleMouseUpPianoKey}
			handleMouseOverPianoKey={this.handleMouseOverPianoKey}
			handleMouseLeavePianoKey={this.handleMouseLeavePianoKey}
		/>
	);

	render() {
		// console.log("app state:", this.state);

		this.sharedControlProps = {
			activeControl: this.state.activeControl,
			handleClickControl: this.handleClickControl,
			handleMouseDownControl: this.handleMouseDownControl,
			handleMouseUpControl: this.handleMouseUpControl,
			handleMouseWheelControl: this.handleMouseWheelControl,
		};

		return (
			<>
				<GlobalStyle />
				<Container
				// onContextMenu={(e) => {
				// 	e.preventDefault();
				// }}
				>
					<Instrument>
						<InstrumentLeft>{this.renderLeftControls()}</InstrumentLeft>
						<InstrumentRight>
							<InstrumentRightTop>
								<InstrumentRightTopLeft>{this.renderGlobalSection()}</InstrumentRightTopLeft>
								<InstrumentRightTopRight>
									{this.renderModeSelector()}
									{this.renderAudioSource()}
									{this.renderFilters()}
									{this.renderVibrato()}
									{this.renderChorus()}
									{/* {this.renderBitcrusher()} */}
									{this.renderDistortion()}
									{this.renderFreqShifter()}
									{this.renderPitcher()}
                  {this.renderReverb()}
								</InstrumentRightTopRight>
							</InstrumentRightTop>
							<InstrumentRightBottom>{this.renderPianoKeys()}</InstrumentRightBottom>
						</InstrumentRight>
					</Instrument>
				</Container>
			</>
		);
	}
}

export default App;
