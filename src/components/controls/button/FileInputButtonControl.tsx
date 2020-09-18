import React, {FormEvent, useRef} from 'react';
import styled from 'styled-components/macro';
import ButtonControl from './ButtonControl';
import {ButtonMouseEvents, Size} from '../../../types';
import {SUPPORTED_SAMPLE_FORMATS} from '../../../js/statics';

const Input = styled.input`
	display: none;
`;

type Props = ButtonMouseEvents & {
	name: string;
	label?: string;
	size: Size;
	value: number | string;
};

const FileInputControl = ({handleClickControl, name, label, size, value}: Props) => {
	const inputRef = useRef<HTMLInputElement>(null);

	const handleClick = (e: FormEvent<HTMLInputElement>) => inputRef.current?.click();

	const handleChange = async (e: FormEvent<HTMLInputElement>) => {
		if (inputRef?.current) {
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
			<Input
				ref={inputRef}
				onChange={handleChange}
				type={'file'}
				accept={SUPPORTED_SAMPLE_FORMATS.join(', ')}
			/>
		</ButtonControl>
	);
};

export default FileInputControl;
