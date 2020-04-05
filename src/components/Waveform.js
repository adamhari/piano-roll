import React, {useEffect, useRef} from 'react';
import WaveSurfer from 'wavesurfer.js';

const Waveform = ({audio}) => {
	let wavesurfer = useRef(null);

	useEffect(() => {
		wavesurfer.current = WaveSurfer.create({
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

		return () => wavesurfer.current.destroy();
	}, []);

	useEffect(() => {
		if (audio) wavesurfer.current.load(audio);
		else wavesurfer.current.empty();
	}, [audio]);

	return (
		<div className="waveform-container">
			<div id="waveform" className="waveform" />
		</div>
	);
};

export default Waveform;
