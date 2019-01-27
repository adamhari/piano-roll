import React, { Component } from 'react';
import PianoKey from './PianoKey';
import { KEYS } from '../statics';

export default class PianoKeys extends Component {

  renderKeys = () => {
    const blackKeys = [];
    const whiteKeys = [];

    for (let i = 0; i < this.props.octaves; i++) {
        KEYS.forEach((key, index) => {
            const keySet = key.name.includes('♯') ?
              blackKeys : whiteKeys;

            const keyName = `${key.name}${i}`;

              keySet.push(
                <PianoKey
                  {...this.props}
                  key={(i * 12) + (index)}
                  name={keyName}
                  note={key.name}
                  freq={key.freq * Math.pow(2, i)}
                  active={this.props.activeKeys.includes(keyName)}
                />
              )
        });
    }

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