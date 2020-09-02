import React, {FormEvent, useRef} from 'react';
import ButtonControl from './ButtonControl';
import {ButtonMouseEvents, Size} from '../types';
import {SUPPORTED_SAMPLE_FORMATS} from '../js/statics';

type Props = ButtonMouseEvents & {
	accept: string;
	name: string;
	label?: string;
	size: Size;
	value: number | string;
};

const FileInputControl = ({accept, handleClickControl, name, label, size, value}: Props) => {
	const inputRef = useRef<HTMLInputElement>(null);

	const handleClick = (e: FormEvent<HTMLInputElement>) => inputRef.current?.click();

	const handleChange = (e: FormEvent<HTMLInputElement>) => {
		if (inputRef?.current) {
			// const file = inputRef && inputRef.current && inputRef.current.files && inputRef.current.files[0];
			const file = inputRef?.current?.files?.[0];

			if (file) {
				const fileUrl = URL.createObjectURL(file);
				handleClickControl(name, fileUrl);
			}
		}
	};

	return (
		<ButtonControl
			label={label}
			name={name}
			handleClickControl={handleClickControl}
			onClick={handleClick}
			size={size}
			value={value}
		>
			<input
				ref={inputRef}
				onChange={handleChange}
				type={'file'}
				accept={SUPPORTED_SAMPLE_FORMATS.join(', ')}
				style={{display: 'none'}}
			/>
		</ButtonControl>
	);
};

export default FileInputControl;
