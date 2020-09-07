import React, {useEffect, useRef} from 'react';
import WaveSurfer from 'wavesurfer.js';

type Props = {
	sampleUrl: string;
};

const Waveform = ({sampleUrl}: Props) => {
	const wavesurfer = useRef<WaveSurfer | null>();

	useEffect(() => {
		wavesurfer.current = WaveSurfer.create({
			autoCenter: false,
			container: '#waveform',
			cursorWidth: 0,
			hideScrollbar: true,
			normalize: false,
			interact: false,
			waveColor: '#ff2601',
		});

		return () => {
			wavesurfer.current?.destroy();
		};
	}, []);

	useEffect(() => {
		if (sampleUrl) wavesurfer.current?.load(sampleUrl);
		else wavesurfer.current?.empty();
	}, [sampleUrl]);

	return (
		<div className='waveform-container'>
			<div id='waveform' className='waveform' />
		</div>
	);
};

export default Waveform;
