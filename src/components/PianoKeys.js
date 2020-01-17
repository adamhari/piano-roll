import React, { Component } from 'react';
import PianoKey from './PianoKey';
import {
  KEYS
} from '../js/statics';

export default class PianoKeys extends Component {

  renderKeys = () => {
    const blackKeys = [];
    const whiteKeys = [];

    const pianoKeys = KEYS.slice(0, (12 * this.props.octaves));

    pianoKeys.forEach((key, index) => {
      const keySet = key.name.includes('♯') ? blackKeys : whiteKeys;

      keySet.push(
        <PianoKey
          {...this.props}
          key={(key.octave * 12) + (index)}
          name={key.name}
          note={key.name.substring(0, key.name.length - 1)}
          freq={key.freq * Math.pow(2, key.octave)}
          active={this.props.activeKeys.includes(key.name)}
        />
      );
    });

    return (
      <div id="pr-piano-keys">
        <div id="pr-piano-black-keys">{blackKeys}</div>
        <div id="pr-piano-white-keys">{whiteKeys}</div>
      </div>
    );
  };

  render() {
    return this.renderKeys()
  }
}