import React, {useEffect, useRef} from 'react';
import WaveSurfer from 'wavesurfer.js';

const Waveform = ({audio}) => {
	const wavesurfer = useRef(null);

	useEffect(() => {
		wavesurfer.current = WaveSurfer.create({
			autoCenter: false,
			// barGap: 3,
			// barHeight: 3,
			// barRadius: 3,
			// barWidth: 3,
			container: '#waveform',
			cursorWidth: 0,
			hideScrollbar: true,
			normalize: true,
			interact: false,
			waveColor: '#ff2601',
		});

		return () => wavesurfer.current.destroy();
	}, []);

	useEffect(() => {
		if (audio) wavesurfer.current.load(audio);
		else wavesurfer.current.empty();
	}, [audio]);

	return (
		<div className='waveform-container'>
			<div id='waveform' className='waveform' />
		</div>
	);
};

export default Waveform;
