"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var statics_1 = require("./statics");
exports.getValueFromRange = function (value, range) {
    var min = range.min, max = range.max;
    if (value > max)
        return max;
    else if (value < min)
        return min;
    return value;
};
// (base Hz, octave, transpose) --> (pitched Hz)
exports.getNoteFromValues = function (freq, octave, transpose) {
    var octavedFrequency = (freq * Math.pow(2, octave)) / 8;
    return octavedFrequency * Math.pow(statics_1.FREQ_MULTIPLIER, transpose);
};
// (0 - 100) --> (-Infinity - 0)
exports.getDecibelsFromValue = function (value) { return 20 * Math.log10(value / 100); };
// (0 - 100) --> (0 - 21031)
exports.getFrequencyFromValue = function (value) { return statics_1.BASE_FREQ * 4 * Math.pow(statics_1.FREQ_MULTIPLIER, value) - statics_1.BASE_FREQ * 4; };
// (0 - 100) --> (0.0001 - 4)
exports.getSecondsFromValue = function (value) { return Math.pow(value, 2) / 2500 || 0.0001; };
// (0 - 100) --> (0.03125 - 32)
exports.getHarmonicityFromValue = function (value) { return Math.pow(2, (value - 50) / 10); };
