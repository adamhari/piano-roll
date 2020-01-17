import React from 'react';
import ReactDOM from 'react-dom';
import PianoRoll from './PianoRoll';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PianoRoll />, div);
  ReactDOM.unmountComponentAtNode(div);
});
