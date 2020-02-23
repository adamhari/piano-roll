import React, {useRef} from 'react';

const FileInputControl = ({
	active,
	accept,
	blinking,
	handleClickControl,
	label,
	name,
	size,
	type,
	value
}) => {
	let inputRef = useRef(null);

	const handleClick = e => {
		inputRef.current.click();
	};

	const handleChange = e => {
		const file = inputRef.current.files[0];
		const fileUrl = URL.createObjectURL(file);
		console.log(file, fileUrl);
		handleClickControl(name, fileUrl);
	};

	const getClasses = () => {
		let classes = 'button ';
		if (active) classes += 'active ';
		if (blinking) classes += 'blinking ';
		if (size) classes += `${size} `;
		return classes;
	};

	return (
		<div className={'button-control-container control-container'}>
			<div className="control-label">{label || value}</div>
			<div className={'button-container'}>
				<div onClick={handleClick} className={getClasses()} />
				<input
					ref={inputRef}
					onChange={handleChange}
					type={type}
					accept={accept}
					style={{display: 'none'}}
				/>
			</div>
		</div>
	);
};

export default FileInputControl;
