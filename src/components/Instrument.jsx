import React from 'react';
import PianoKeys from './PianoKeys';
import Sampler from './Sampler';
import ButtonControl from './ButtonControl';
import DigitalControl from './DigitalControl';
import KnobControl from './KnobControl';
import {CONTROLS, MODES} from '../js/statics';

const Instrument = (props) => {
	const {
		activeControl,
		handleClickControl,
		handleMouseDownControl,
		handleMouseUpControl,
		handleMouseWheelControl,

		sampleLoading,
		sampleLoaded,

		layout,
		volume,
		polyphony,
		portamento,
		attack,
		decay,
		sustain,
		release,
		mode,
		sample,
		samplePitch,
		osc1Shape,
		osc1Octave,
		osc1Transpose,
		osc1Detune,
		osc1Gain,
		osc2Shape,
		osc2Octave,
		osc2Transpose,
		osc2Detune,
		osc2Gain,
		modOscShape,
		modOscFreq,
		modOscGain,
		filter1Type,
		filter1Rolloff,
		filter1Freq,
		filter1Q,
		filter2Type,
		filter2Rolloff,
		filter2Freq,
		filter2Q,
		vibratoDepth,
		vibratoFreq,
		vibratoWet,
		chorusSpread,
		chorusDepth,
		chorusDelay,
		chorusWet,
		crusherBits,
		crusherWet,
		distOver,
		distAmount,
		distWet,
		pitcherPitch,
		pitcherWindow,
		pitcherWet,
		reverbSize,
		reverbDampening,
		reverbWet,
	} = props;

	const sharedControlProps = {
		activeControl,
		handleClickControl,
		handleMouseDownControl,
		handleMouseUpControl,
		handleMouseWheelControl,
	};

	const renderGlobalSection = () => (
		<div id='global-section'>
			{renderLogo()}
			{renderGlobalControls()}
		</div>
	);

	const renderLogo = () => (
		<div id='logo-section'>
			<svg id='logo' viewBox='304.103 332.216 470.661 104.256'>
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
			</svg>
			<div id='logo-subtext'>
				<span id='logo-subtext-bold'>
					<span>Re</span>
					<span style={{letterSpacing: '-0.15625rem'}}>a</span>
					<span>ct</span>
				</span>
				<span style={{marginLeft: '0.5rem'}}>Instrument</span>
			</div>
		</div>
	);

	const renderLeftControls = () => (
		<div id='instr-top-left'>
			<DigitalControl
				{...sharedControlProps}
				name='polyphony'
				label='poly'
				control={CONTROLS.polyphony}
				value={polyphony}
			/>
			<br />
			{/* <KnobControl
        {...sharedControlProps}
        name="portamento"
        label="porta"
        value={portamento}
        size="medium"
      />
      <br /> */}
			<DigitalControl
				{...sharedControlProps}
				name='layout'
				control={CONTROLS.layout}
				value={layout}
				outline={true}
			/>
		</div>
	);

	const renderGlobalControls = () => (
		<div id='global-controls'>
			{renderVolumeControl()}
			{renderEnvelopeControls()}
		</div>
	);

	const renderVolumeControl = () => (
		<div>
			<KnobControl {...sharedControlProps} name='volume' value={volume} size='large' />
		</div>
	);

	const renderEnvelopeControls = () => (
		<div id='envelope-controls'>
			<div>
				<KnobControl {...sharedControlProps} name='attack' value={attack} size='small' />
			</div>
			<div>
				<KnobControl {...sharedControlProps} name='decay' value={decay} size='small' />
			</div>
			<div>
				<KnobControl {...sharedControlProps} name='sustain' value={sustain} size='small' />
			</div>
			<div>
				<KnobControl {...sharedControlProps} name='release' value={release} size='small' />
			</div>
		</div>
	);

	const renderModeSelector = () => (
		<div id='mode-selector' className='control-section'>
			<div className='control-wrapper vertical'>
				<div className='controls-container-label'>MODE</div>
				<div className='controls-container'>
					<ButtonControl
						{...sharedControlProps}
						name='mode'
						value='sampler'
						active={mode === 'sampler'}
						size='large'
						light={true}
					/>
					<ButtonControl
						{...sharedControlProps}
						name='mode'
						value='synth'
						active={mode === 'synth'}
						size='large'
						light={true}
					/>
				</div>
			</div>
		</div>
	);

	const renderSampler = () =>
		mode === MODES.SAMPLER && (
			<Sampler
				{...sharedControlProps}
				sample={sample}
				sampleLoading={sampleLoading}
				sampleLoaded={sampleLoaded}
				samplePitch={samplePitch}
			/>
		);

	const renderSynth = () =>
		mode === MODES.SYNTH && (
			<>
				{renderOscillators()}
				{renderModOscillator()}
			</>
		);

	const renderOscillators = () => (
		<div id='oscillators' className='control-section'>
			<div className='control-wrapper horizontal'>
				<div className='controls-container-label'>OSC 1</div>
				<div className='controls-container'>
					<DigitalControl
						{...sharedControlProps}
						name='osc1Shape'
						label='shape'
						value={osc1Shape}
					/>
					<DigitalControl
						{...sharedControlProps}
						name='osc1Octave'
						label='octave'
						value={osc1Octave}
					/>
					<DigitalControl
						{...sharedControlProps}
						name='osc1Transpose'
						label='trans'
						value={osc1Transpose}
					/>
					<KnobControl
						{...sharedControlProps}
						name='osc1Detune'
						label='tune'
						value={osc1Detune}
						size='medium'
					/>
					<KnobControl
						{...sharedControlProps}
						name='osc1Gain'
						label='vol'
						value={osc1Gain}
						size='medium'
					/>
				</div>
			</div>
			<div className='control-wrapper horizontal'>
				<div className='controls-container-label'>OSC 2</div>
				<div className='controls-container'>
					<DigitalControl
						{...sharedControlProps}
						name='osc2Shape'
						label='shape'
						value={osc2Shape}
						type='single-digit'
					/>
					<DigitalControl
						{...sharedControlProps}
						name='osc2Octave'
						label='octave'
						value={osc2Octave}
					/>
					<DigitalControl
						{...sharedControlProps}
						name='osc2Transpose'
						label='trans'
						value={osc2Transpose}
					/>
					<KnobControl
						{...sharedControlProps}
						name='osc2Detune'
						label='tune'
						value={osc2Detune}
						size='medium'
					/>
					<KnobControl
						{...sharedControlProps}
						name='osc2Gain'
						label='vol'
						value={osc2Gain}
						size='medium'
					/>
				</div>
			</div>
		</div>
	);

	const renderModOscillator = () => (
		<div id='mod-oscillator' className='control-section'>
			<div className='control-wrapper vertical'>
				<div className='controls-container-label'>MOD OSC</div>
				<div className='controls-container'>
					<DigitalControl
						{...sharedControlProps}
						name='modOscShape'
						label='shape'
						value={modOscShape}
						type='single-digit'
					/>
					<KnobControl
						{...sharedControlProps}
						name='modOscFreq'
						label='freq'
						value={modOscFreq}
						size='small'
					/>
					<KnobControl
						{...sharedControlProps}
						name='modOscGain'
						label='vol'
						value={modOscGain}
						size='small'
					/>
				</div>
			</div>
		</div>
	);

	const renderFilters = () => (
		<div id='filters' className='control-section'>
			<div className='control-wrapper horizontal'>
				<div className='controls-container-label'>FILTER 1</div>
				<div className='controls-container'>
					<DigitalControl
						{...sharedControlProps}
						name='filter1Type'
						label='type'
						value={filter1Type}
					/>
					<DigitalControl
						{...sharedControlProps}
						name='filter1Rolloff'
						label='steep'
						value={filter1Rolloff}
					/>
					<KnobControl
						{...sharedControlProps}
						name='filter1Freq'
						label='cutoff'
						value={filter1Freq}
						size='medium'
					/>
					<KnobControl
						{...sharedControlProps}
						name='filter1Q'
						label='res'
						value={filter1Q}
						size='medium'
					/>
				</div>
			</div>
			<div className='control-wrapper horizontal'>
				<div className='controls-container-label'>FILTER 2</div>
				<div className='controls-container'>
					<DigitalControl
						{...sharedControlProps}
						name='filter2Type'
						label='type'
						value={filter2Type}
					/>
					<DigitalControl
						{...sharedControlProps}
						name='filter2Rolloff'
						label='steep'
						value={filter2Rolloff}
					/>
					<KnobControl
						{...sharedControlProps}
						name='filter2Freq'
						label='cutoff'
						value={filter2Freq}
						size='medium'
					/>
					<KnobControl
						{...sharedControlProps}
						name='filter2Q'
						label='res'
						value={filter2Q}
						size='medium'
					/>
				</div>
			</div>
		</div>
	);

	const renderVibrato = () => (
		<div id='vibrato' className='control-section'>
			<div className='control-wrapper vertical'>
				<div className='controls-container-label'>VIBRATO</div>
				<div className='controls-container'>
					<KnobControl
						{...sharedControlProps}
						name='vibratoDepth'
						label='depth'
						value={vibratoDepth}
						size='small'
					/>
					<KnobControl
						{...sharedControlProps}
						name='vibratoFreq'
						label='freq'
						value={vibratoFreq}
						size='small'
					/>
					<KnobControl
						{...sharedControlProps}
						name='vibratoWet'
						label='wet'
						value={vibratoWet}
						size='small'
					/>
				</div>
			</div>
		</div>
	);

	const renderChorus = () => (
		<div id='chorus' className='control-section'>
			<div className='control-wrapper vertical'>
				<div className='controls-container-label'>CHORUS</div>
				<div className='controls-container'>
					<KnobControl
						{...sharedControlProps}
						name='chorusSpread'
						label='spread'
						value={chorusSpread}
						size='small'
					/>
					<KnobControl
						{...sharedControlProps}
						name='chorusDepth'
						label='depth'
						value={chorusDepth}
						size='small'
					/>
					{/* <KnobControl
						{...sharedControlProps}
						name="chorusDelay"
						label="delay"
						value={chorusDelay}
						size="small"
          /> */}
					<KnobControl
						{...sharedControlProps}
						name='chorusWet'
						label='wet'
						value={chorusWet}
						size='small'
					/>
				</div>
			</div>
		</div>
	);

	const renderBitcrusher = () => (
		<div id='distortion' className='control-section'>
			<div className='control-wrapper vertical'>
				<div className='controls-container-label'>BITCRUSHER</div>
				<div className='controls-container'>
					<DigitalControl
						{...sharedControlProps}
						name='crusherBits'
						label='bits'
						value={crusherBits}
					/>
					<KnobControl
						{...sharedControlProps}
						name='crusherWet'
						label='wet'
						value={crusherWet}
						size='small'
					/>
				</div>
			</div>
		</div>
	);

	const renderDistortion = () => (
		<div id='distortion' className='control-section'>
			<div className='control-wrapper vertical'>
				<div className='controls-container-label'>DISTORTION</div>
				<div className='controls-container'>
					{/* <DigitalControl
            {...sharedControlProps}
            name="distOver"
            label="over"
            value={distOver}
          /> */}
					<KnobControl
						{...sharedControlProps}
						name='distAmount'
						label='amount'
						value={distAmount}
						size='small'
					/>
					<KnobControl
						{...sharedControlProps}
						name='distWet'
						label='wet'
						value={distWet}
						size='small'
					/>
				</div>
			</div>
		</div>
	);

	const renderPitcher = () => (
		<div id='pitcher' className='control-section'>
			<div className='control-wrapper vertical'>
				<div className='controls-container-label'>PITCHER</div>
				<div className='controls-container'>
					<KnobControl
						{...sharedControlProps}
						name='pitcherPitch'
						label='pitch'
						value={pitcherPitch}
						size='small'
					/>
					<KnobControl
						{...sharedControlProps}
						name='pitcherWindow'
						label='slice'
						value={pitcherWindow}
						size='small'
					/>
					<KnobControl
						{...sharedControlProps}
						name='pitcherWet'
						label='wet'
						value={pitcherWet}
						size='small'
					/>
				</div>
			</div>
		</div>
	);

	const renderReverb = () => (
		<div id='reverb' className='control-section'>
			<div className='control-wrapper vertical'>
				<div className='controls-container-label'>REVERB</div>
				<div className='controls-container'>
					<KnobControl
						{...sharedControlProps}
						name='reverbSize'
						label='size'
						value={reverbSize}
						size='small'
					/>
					<KnobControl
						{...sharedControlProps}
						name='reverbDampening'
						label='damp'
						value={reverbDampening}
						size='small'
					/>
					<KnobControl
						{...sharedControlProps}
						name='reverbWet'
						label='wet'
						value={reverbWet}
						size='small'
					/>
				</div>
			</div>
		</div>
	);

	const renderPianoKeys = () => <PianoKeys {...props} />;

	return (
		<div id='instr'>
			<div id='instr-left'>{renderLeftControls()}</div>
			<div id='instr-right'>
				<div id='instr-right-top'>
					{renderGlobalSection()}
					{renderModeSelector()}
					{renderSampler()}
					{renderSynth()}
					{renderFilters()}
					{renderVibrato()}
					{renderChorus()}
					{/* {renderBitcrusher()}
					{renderDistortion()} */}
					{renderPitcher()}
					{renderReverb()}
				</div>
				<div id='instr-right-bottom'>{renderPianoKeys()}</div>
			</div>
		</div>
	);
};

export default Instrument;
