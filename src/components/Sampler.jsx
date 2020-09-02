import React from 'react';
import DigitalControl from './DigitalControl';
import FileInputControl from './FileInputControl';
import InputRecorderControl from './InputRecorderControl';
import KnobControl from './KnobControl';
import Waveform from './Waveform';

const Sampler = (props) => {
	const {sample, samplePitch, sampleLoading, sampleLoaded} = props;

	return (
		<div id='sampler' className='control-section'>
			<div className='control-wrapper vertical'>
				<div className='controls-container-label'>SAMPLER</div>
				<div className='controls-container'>
					<div style={{display: 'flex'}}>
						{/* <DigitalControl {...props} name='sample' label='select' value={sample} /> */}
						<FileInputControl
							{...props}
							name='sample'
							label='load'
							value={'load'}
							blinking={sampleLoading}
							active={sampleLoaded}
							size='small'
						/>
						<InputRecorderControl {...props} label='record' size='small' light={true} />
					</div>
					<Waveform {...props} audio={sample} label={'waveform'} />
					<div className='controls-sub-container'>
						<KnobControl
							{...props}
							name='samplePitch'
							label='pitch'
							value={samplePitch}
							size='small'
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Sampler;
