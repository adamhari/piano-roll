import React, {useEffect, useRef} from 'react';
import WaveSurfer from 'wavesurfer.js';

type Props = {
	audio: string;
};

const Waveform = ({audio}: Props) => {
	const wavesurfer = useRef<WaveSurfer | null>();

	useEffect(() => {
		wavesurfer.current = WaveSurfer.create({
			autoCenter: false,
			container: '#waveform',
			cursorWidth: 0,
			hideScrollbar: true,
			normalize: true,
			interact: false,
			waveColor: '#ff2601',
		});

		return () => {
			wavesurfer.current?.destroy();
		};
	}, []);

	useEffect(() => {
		if (audio) wavesurfer.current?.load(audio);
		else wavesurfer.current?.empty();
	}, [audio]);

	return (
		<div className='waveform-container'>
			<div id='waveform' className='waveform' />
		</div>
	);
};

export default Waveform;
