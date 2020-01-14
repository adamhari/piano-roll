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


export const LAYOUTS = {
  major: {
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
  }
}

export const OSC_SHAPES = [
  "sawtooth",
  "square",
  "triangle",
  "sine",
  "custom"
]


export const CONTROL_TYPES = {
  digital: {
    pixelStep: 8,
    valueStep: 1
  },
  knob: {
    pixelStep: 1,
    valueStep: 1,
  }
}

export const CONTROLS = {
  layout: {
    defaultValue: 1,
    range: {
      min: 1,
      max: 1,
    }
  },
  gain: {
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
      max: 5
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
  master: {
    defaultValue: 79,
    range: {
      min: 0,
      max: 100
    }
  }
}