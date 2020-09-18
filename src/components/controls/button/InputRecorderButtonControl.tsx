import React, {useEffect, useRef, useState} from 'react';
import ButtonControl from './ButtonControl';
import {ButtonMouseEvents, Size} from '../../../types';
import ButtonLight from './ButtonLight';

type Props = ButtonMouseEvents & {
	name: string;
	label?: string;
	light?: boolean;
	size: Size;
};

const InputRecorderControl = ({handleClickControl, label, light, name, size}: Props) => {
	const [recording, setRecording] = useState(false);
	const mediaRecorder = useRef<MediaRecorder | null>(null);

	useEffect(() => {
		navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
			mediaRecorder.current = new MediaRecorder(stream);
		});
	}, []);

	useEffect(() => {
		if (recording) {
			mediaRecorder.current?.start();
		} else if (!recording) {
			mediaRecorder.current?.stop();
			mediaRecorder.current?.addEventListener('dataavailable', (e: BlobEvent) => {
				handleClickControl(name, URL.createObjectURL(e.data));
			});
		}
	}, [name, handleClickControl, recording]);

	const toggleRecording = () => setRecording(!recording);

	return (
		<ButtonControl
			name={'inputRecorder'}
			active={recording}
			label={label}
			light={light}
			handleClickControl={handleClickControl}
			onClick={toggleRecording}
			renderButtonLight={() => <ButtonLight active={false} blinking={recording} size={size} />}
			size={size}
			value={Number(recording)}
		/>
	);
};

export default InputRecorderControl;
