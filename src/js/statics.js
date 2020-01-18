// Musical
export const BASE_FREQ = 16.3516;
export const FREQ_MULTIPLIER = 1.0594630943593;
export const NOTES = [
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


export const KEYS = [];
export const KEYS_MAP = {};
for (let i = 0; i < 10; i++) {
  NOTES.forEach(note => {
    const key = {
      name: note.name + i,
      freq: note.freq * Math.pow(2, i),
      octave: i
    };
    KEYS.push(key);
    KEYS_MAP[key.name] = key;
  });
};


export const LAYOUTS = [
  { // MAJOR
    'z': 'C0',
    'x': 'D0',
    'c': 'E0',
    'v': 'F0',
    'b': 'G0',
    'n': 'A0',
    'm': 'B0',
    'a': 'C1',
    's': 'D1',
    'd': 'E1',
    'f': 'F1',
    'g': 'G1',
    'h': 'A1',
    'j': 'B1',
    'k': 'C2',
    'l': 'D2',
    ';': 'E2',
    "'": 'F2',
    ',': 'C1',
    '.': 'D1',
    '/': 'E1',
    'q': 'C2',
    'w': 'D2',
    'e': 'E2',
    'r': 'F2',
    't': 'G2',
    'y': 'A2',
    'u': 'B2',
    'i': 'C3',
    'o': 'D3',
    'p': 'E3',
    '[': 'F3',
    ']': 'G3',
    '\\': 'A3',
    'delete' : 'B3'
  },
  { // MINOR
    'z': 'C0',
    's': 'C♯0',
    'x': 'D0',
    'd': 'D♯0',
    'c': 'E0',
    'v': 'F0',
    'g': 'F♯0',
    'b': 'G0',
    'h': 'G♯0',
    'n': 'A0',
    'j': 'A♯0',
    'm': 'B0',
    ',': 'C1',
    'l': 'C♯1',
    '.': 'D1',
    ';': 'D♯1',
    '/': 'E1',
    'q': 'C1',
    '2': 'C♯1',
    'w': 'D1',
    '3': 'D♯1',
    'e': 'E1',
    'r': 'F1',
    '5': 'F♯1',
    't': 'G1',
    '6': 'G♯1',
    'y': 'A1',
    '7': 'A♯1',
    'u': 'B1',
    'i': 'C2',
    '9': 'C♯2',
    'o': 'D2',
    '0': 'D♯2',
    'p': 'E2',
    '[': 'F2',
    '=': 'F♯2',
    ']': 'G2',
    'backspace': 'G♯2',
    '\\': 'A2',
    'insert': 'A♯2',
    'delete': 'B2'
  }
]

export const OSC_SHAPES = [
  "sawtooth",
  "square",
  "triangle",
  "sine"
]


export const CONTROL_TYPES = {
  digital: {
    name: 'digital',
    pixelStep: 10,
  },
  knob: {
    name: 'knob',
    pixelStep: 1,
  }
}

export const CONTROLS = {
  layout: {
    defaultValue: 0,
    range: {
      min: 0,
      max: 1,
    }
  },
  master: {
    defaultValue: 50,
    range: {
      min: 0,
      max: 100
    }
  },
  attack: {
    defaultValue: 50,
    range: {
      min: 0,
      max: 100
    }
  },
  decay: {
    defaultValue: 50,
    range: {
      min: 0,
      max: 100
    }
  },
  sustain: {
    defaultValue: 50,
    range: {
      min: 0,
      max: 100
    }
  },
  release: {
    defaultValue: 50,
    range: {
      min: 0,
      max: 100
    }
  },
  shape: {
    defaultValue: 0,
    range: {
      min: 0,
      max: 3
    }
  },
  octave: {
    defaultValue: 5,
    range: {
      min: 0,
      max: 9
    }
  },
  transpose: {
    defaultValue: 0,
    range: {
      min: -9,
      max: 9
    }
  },
  detune: {
    defaultValue: 0,
    range: {
      min: -100,
      max: 100
    }
  },
  gain: {
    defaultValue: 50,
    range: {
      min: 0,
      max: 100
    }
  },
}