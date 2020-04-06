import React from 'react';
import {SUPPORTED_SAMPLE_FORMATS} from '../js/statics';
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
						<FileInputControl
							{...props}
							name='sample'
							label='load'
							value={'load'}
							blinking={sampleLoading}
							active={sampleLoaded}
							type='file'
							accept={SUPPORTED_SAMPLE_FORMATS.join(', ')}
							size='small'
						/>
						<InputRecorderControl {...props} label='record' size='small' light={true} />
						{/* <DigitalControl {...props} name="sample" label="select" value={sample} /> */}
					</div>
					<Waveform {...props} audio={sample} label={'waveform'} />
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
	);
};

export default Sampler;
