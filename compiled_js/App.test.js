"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_dom_1 = require("react-dom");
var PianoRoll_1 = require("./PianoRoll");
it('renders without crashing', function () {
    var div = document.createElement('div');
    react_dom_1.default.render(<PianoRoll_1.default />, div);
    react_dom_1.default.unmountComponentAtNode(div);
});
