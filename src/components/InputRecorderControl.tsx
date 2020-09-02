import React, {useEffect, useRef, useState} from 'react';
import {usePrevious} from '../js/hooks';
import ButtonControl from './ButtonControl';
import {ButtonMouseEvents, Size} from '../types';

type Props = ButtonMouseEvents & {
	label?: string;
	light?: boolean;
	size: Size;
};

let mediaRecorder: any;

const InputRecorderControl = ({handleClickControl, label, light, size}: Props) => {
	const [recording, setRecording] = useState(false);
	const prevRecording = usePrevious(recording);

	useEffect(() => {
		navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
			mediaRecorder = new MediaRecorder(stream);
		});
	}, []);

	useEffect(() => {
		if (!prevRecording && recording) {
			mediaRecorder.start();
		} else if (prevRecording && !recording) {
			mediaRecorder.stop();
			mediaRecorder.addEventListener('dataavailable', (e: BlobEvent) => {
				handleClickControl('sample', URL.createObjectURL(e.data));
			});
		}
	}, [handleClickControl, prevRecording, recording]);

	const toggleRecording = () => setRecording(!recording);

	return (
		<ButtonControl
			name={'inputRecorder'}
			active={recording}
			label={label}
			light={light}
			handleClickControl={handleClickControl}
			onClick={toggleRecording}
			size={size}
			value={recording ? 1 : 0}
		/>
	);
};

export default InputRecorderControl;
