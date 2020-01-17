import React from "react";

const PianoKey = ({
  active,
  disabled,
  handleMouseDownPianoKey,
  handleMouseUpPianoKey,
  handleMouseOverPianoKey,
  handleMouseLeavePianoKey,
  name,
  note
}) => {

  const getClassNames = () => {
    let classNames = [
      'pr-piano-key',
      `pr-piano-key-${note}`,
      name.includes('♯') ? 'pr-piano-key-black' : 'pr-piano-key-white',
      active ? 'pr-piano-key-active' : disabled ? 'pr-piano-key-disabled' : 'pr-piano-key-inactive'
    ];

    return classNames.join(' ');
  }

  return (
    <div
      title={name}
      className={getClassNames()}
      id={`pr-piano-key-${name}`}
      tabIndex="0"
      onMouseDown={handleMouseDownPianoKey}
      onMouseUp={handleMouseUpPianoKey}
      onMouseOver={handleMouseOverPianoKey}
      onMouseLeave={handleMouseLeavePianoKey}
    />
  );
}

export default PianoKey;