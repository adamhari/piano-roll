import React, {useEffect, useRef, useState} from 'react';
import {usePrevious} from '../js/hooks';
import ButtonControl from './ButtonControl';

const InputRecorderControl = ({handleClickControl, label, light, size}) => {
	const mediaRecorder = useRef(null);
	const [recording, setRecording] = useState(false);
	const prevRecording = usePrevious(recording);

	useEffect(() => {
		navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
			mediaRecorder.current = new MediaRecorder(stream);
		});
	}, []);

	useEffect(() => {
		if (!prevRecording && recording) {
			mediaRecorder.current.start();
		} else if (prevRecording && !recording) {
			mediaRecorder.current.stop();
			mediaRecorder.current.addEventListener('dataavailable', (e) => {
				handleClickControl('sample', URL.createObjectURL(e.data));
			});
		}
	}, [handleClickControl, prevRecording, recording]);

	const toggleRecording = () => setRecording(!recording);

	return (
		<ButtonControl
			active={recording}
			label={label}
			light={light}
			onClick={toggleRecording}
			size={size}
		/>
	);
};

export default InputRecorderControl;
