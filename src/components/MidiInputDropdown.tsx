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

	const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		activeInput?.current?.removeListener();
		const selectedInput = inputs.find((x) => x.name === e.target.value);
		selectedInput?.addListener('noteon', 1, (e) => handleMidiKeyDown(getNoteFromEvent(e)));
		selectedInput?.addListener('noteoff', 1, (e) => handleMidiKeyUp(getNoteFromEvent(e)));
		activeInput.current = selectedInput;
		setActiveInputName(selectedInput?.name);
	};

	if (inputs.length > 0) {
		return (
			<div id='midi-input-container'>
				<svg id='midi-input-icon' viewBox='-50 -30 200 200'>
					<path
						fill='#adadad'
						d='M122.88,35.289L87.945,70.578v-17.58c-22.091-4.577-39.542,0.468-52.796,17.271 c2.301-34.558,25.907-51.235,52.795-52.339L87.945,0L122.88,35.289L122.88,35.289z'
					/>
					<path
						fill='#adadad'
						d='M6.908,23.746h35.626c-4.587,3.96-8.71,8.563-12.264,13.815H13.815v62.943h80.603V85.831l13.814-13.579v35.159 c0,3.814-3.093,6.907-6.907,6.907H6.908c-3.815,0-6.908-3.093-6.908-6.907V30.653C0,26.838,3.093,23.746,6.908,23.746L6.908,23.746 z'
					/>
				</svg>
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
