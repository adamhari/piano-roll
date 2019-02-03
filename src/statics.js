// Musical
export const BASE_FREQ = 16.3516;
export const FREQ_MULTIPLIER = 1.0594630943593;
export const KEYS = [
  {
    name: "C",
    freq: BASE_FREQ * Math.pow(FREQ_MULTIPLIER, 0)
  },
  {
    name: "C♯",
    freq: BASE_FREQ * Math.pow(FREQ_MULTIPLIER, 1)
  },
  {
    name: "D",
    freq: BASE_FREQ * Math.pow(FREQ_MULTIPLIER, 2)
  },
  {
    name: "D♯",
    freq: BASE_FREQ * Math.pow(FREQ_MULTIPLIER, 3)
  },
  {
    name: "E",
    freq: BASE_FREQ * Math.pow(FREQ_MULTIPLIER, 4)
  },
  {
    name: "F",
    freq: BASE_FREQ * Math.pow(FREQ_MULTIPLIER, 5)
  },
  {
    name: "F♯",
    freq: BASE_FREQ * Math.pow(FREQ_MULTIPLIER, 6)
  },
  {
    name: "G",
    freq: BASE_FREQ * Math.pow(FREQ_MULTIPLIER, 7)
  },
  {
    name: "G♯",
    freq: BASE_FREQ * Math.pow(FREQ_MULTIPLIER, 8)
  },
  {
    name: "A",
    freq: BASE_FREQ * Math.pow(FREQ_MULTIPLIER, 9)
  },
  {
    name: "A♯",
    freq: BASE_FREQ * Math.pow(FREQ_MULTIPLIER, 10)
  },
  {
    name: "B",
    freq: BASE_FREQ * Math.pow(FREQ_MULTIPLIER, 11)
  }
];


export const CONTROL_TYPES = {
  digital : {
    pixelStep: 10
  },
  knob: {
    pixelStep: 1
  }
}

export const CONTROLS = {
  map: {
    range: {
      min: 1,
      max: 2
    }
  },
  octave: {
    range : {
      min: 0, 
      max: 9
    }
  },
  transpose: {
    range: {
      min:-9,
      max:9
    }
  },
  master: {
    range: {
      min:0,
      max:100
    }
  }
}