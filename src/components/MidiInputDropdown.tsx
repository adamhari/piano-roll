import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import WebMidi, {Input, InputEventNoteon, InputEventNoteoff} from 'webmidi';
import {MidiKeyEvents} from '../types';

type Props = MidiKeyEvents & {};

const MidiInputDropdown = ({handleMidiKeyDown, handleMidiKeyUp}: Props) => {
	const [inputs, setInputs] = useState<Input[]>([]);
	const [activeInputName, setActiveInputName] = useState<string>();
	const activeInput = useRef<Input>();

	useEffect(() => {
		WebMidi.enable((err) => {
			if (!err) {
				WebMidi.addListener('connected', (e) => setInputs(WebMidi.inputs));
				WebMidi.addListener('disconnected', (e) => setInputs(WebMidi.inputs));

				setInputs(WebMidi.inputs);
				if (WebMidi.inputs.length > 0) activeInput.current = WebMidi.inputs[0];
			}
		});
	}, []);

	const getNoteFromEvent = (e: InputEventNoteon | InputEventNoteoff) =>
		`${e.note.name}${e.note.octave}`.replace('#', '♯');

	const handleNoteon = (e: InputEventNoteon) => {
		handleMidiKeyDown(getNoteFromEvent(e));
	};

	const handleNoteoff = (e: InputEventNoteoff) => {
		handleMidiKeyUp(getNoteFromEvent(e));
	};

	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		activeInput?.current?.removeListener();
		const selectedInput = inputs.find((x) => x.name === e.target.value);
		selectedInput?.addListener('noteon', 1, handleNoteon);
		selectedInput?.addListener('noteoff', 1, handleNoteoff);
		activeInput.current = selectedInput;
		setActiveInputName(selectedInput?.name);
	};

	if (inputs.length > 0) {
		return (
			<div id='midi-input-container'>
				<select value={activeInputName} onChange={handleChange} className={'midi-input-dropdown'}>
					{inputs.map((x, i) => (
						<option key={i}>{x.name}</option>
					))}
				</select>
			</div>
		);
	} else return null;
};

export default MidiInputDropdown;
