import React, {useRef} from 'react';
import ButtonControl from './ButtonControl';

const FileInputControl = ({accept, handleClickControl, label, name, size, type, value}) => {
	const inputRef = useRef(null);

	const handleClick = (e) => inputRef.current.click();

	const handleChange = (e) => {
		const file = inputRef.current.files[0];

		if (file) {
			const fileUrl = URL.createObjectURL(file);
			handleClickControl(name, fileUrl);
		}
	};

	return (
		<ButtonControl label={label} name={name} onClick={handleClick} size={size}>
			<input
				ref={inputRef}
				onChange={handleChange}
				type={type}
				accept={accept}
				style={{display: 'none'}}
			/>
		</ButtonControl>
	);
};

export default FileInputControl;
