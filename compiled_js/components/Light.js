"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Light = function (_a) {
    var active = _a.active, size = _a.size;
    var getClasses = function () {
        var classes = 'light ';
        if (active)
            classes += 'active ';
        if (size)
            classes += size + " ";
        return classes;
    };
    return <div className={getClasses()}/>;
};
exports.default = Light;
