import React, {useEffect, useRef} from 'react';
import {usePrevious} from '../js/hooks';
import WaveSurfer from 'wavesurfer.js';
import MicrophonePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.microphone';

const Waveform = ({audio, handleClickControl, recording}) => {
	const wavesurfer = useRef(null);

	// const recordingChunks = useRef([]);
	// const prevRecording = usePrevious(recording);

	// useEffect(() => {
	// 	const stopRecording = () => {
	// 		console.log('sup', recordingChunks.current);
	// 		wavesurfer.current.microphone.stop();
	// 		const microphoneAudioBlob = new Blob(recordingChunks.current);
	// 		const microphoneAudioUrl = URL.createObjectURL(microphoneAudioBlob);
	// 		const microphoneAudio = new Audio(microphoneAudioUrl);
	// 		handleClickControl('sample', microphoneAudio);
	// 	};

	// 	recording && !prevRecording && wavesurfer.current.microphone.start();
	// 	!recording && prevRecording && stopRecording();
	// }, [handleClickControl, recording, prevRecording]);

	useEffect(() => {
		wavesurfer.current = WaveSurfer.create({
			barGap: 3,
			barHeight: 3,
			barRadius: 3,
			barWidth: 3,
			container: '.waveform',
			cursorWidth: 0,
			hideScrollbar: true,
			interact: false,
			waveColor: '#ff2601',
			// plugins: [MicrophonePlugin.create()],
		});

		// wavesurfer.current.microphone.on('deviceReady', (stream) => {
		// 	console.log('yo', stream);
		// 	recordingChunks.current = [];
		// 	const mediaRecorder = new MediaRecorder(stream);
		// 	mediaRecorder.ondataavailable = (e) => {
		// 		console.log('da', e);
		// 		recordingChunks.current.push(e.data);
		// 	};

		// 	mediaRecorder.onstop = (e) => {
		// 		console.log('stop');
		// 	};

		// 	mediaRecorder.start();
		// });

		// 	wavesurfer.current.microphone.on('deviceError', (e) => {
		// 		console.log('wavesurfer microphone deviceError: ', e);
		// 	});

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
