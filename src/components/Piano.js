import React, { Component } from "react";
import PianoTopControls from "./PianoTopControls";
import PianoKeys from "./PianoKeys";

export default class Piano extends Component {

  render() {
    return (
      <div id="pr-piano">
        <div id="pr-piano-top">
          <PianoTopControls 
            {...this.props}
          />
        </div>
        <div id="pr-piano-bottom">
          <PianoKeys 
            {...this.props}
          />
        </div>
      </div>
    );
  }
}
