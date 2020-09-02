import React from 'react';
import DigitalControl from './DigitalControl';
import FileInputControl from './FileInputControl';
import InputRecorderControl from './InputRecorderControl';
import KnobControl from './KnobControl';
import Waveform from './Waveform';
import {ButtonMouseEvents, ControlMouseEvents} from '../types';

type Props = ButtonMouseEvents &
	ControlMouseEvents & {
		activeControl: string;
		sample: string;
		samplePitch: number;
		sampleLoading: boolean;
		sampleLoaded: boolean;
	};

const Sampler = (props: Props) => {
	const {sample, samplePitch} = props;

	return (
		<div id='sampler' className='control-section'>
			<div className='control-wrapper vertical'>
				<div className='controls-container-label'>SAMPLER</div>
				<div className='controls-container'>
					<div style={{display: 'flex'}}>
						{/* <DigitalControl {...props} name='sample' label='select' value={sample} /> */}
						<FileInputControl {...props} name='sample' label='load' value={'load'} size='small' />
						<InputRecorderControl {...props} label='record' size='small' light={true} />
					</div>
					<Waveform {...props} audio={sample} />
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
