import {createGlobalStyle} from 'styled-components';

const palette = {
	gray100: '#0b0b0b',
	gray150: '#0f0f0f',
	gray200: '#121212',
	gray250: '#141414',
	gray300: '#191718',
	gray400: '#231f20',
	gray500: '#303030',
	gray550: '#3a3a3a',
	gray600: '#666666',
	gray650: '#707071',
	gray700: '#ababab',
	gray750: '#cacaca',
	gray800: '#d7d7d7',
	gray900: '#eeeeee',

	white: '#ffffff',
	black: '#000000',

	primary: '#ff2601',
};

export const color = {
	instrumentBorder: palette.gray400,
	instrumentPlastic: palette.gray500,
	label: palette.gray700,
	keyBorder: palette.gray400,
	keyWhite: palette.gray800,
	keyWhiteActive: palette.white,
	keyBlack: palette.gray300,
	keyBlackActive: palette.gray600,
	buttonBackground: palette.gray250,
	buttonBackgroundActive: palette.gray200,
	buttonBorder: palette.gray150,
	buttonLightInactive: palette.gray500,
	buttonLightActive: palette.primary,
	digitalVerticalBorder: palette.gray400,
	digitalHorizontalBorder: palette.gray550,
	digitalBackground: palette.gray100,
	digitalText: palette.primary,
	knobRubber: palette.gray400,
	knobMetal: palette.gray750,
	knobDial: palette.gray650,
	tooltipBackground: palette.gray700,
};

export const border = {
	instrument: `solid ${color.instrumentBorder} 0.15rem`,
	key: `solid ${color.keyBorder} 0.075rem`,
	button: `solid ${color.buttonBorder} 0.15rem`,
	digitalDisplayVertical: `solid ${color.digitalVerticalBorder} 0.15rem`,
	digitalDisplayHorizontal: `solid ${color.digitalHorizontalBorder} 0.15rem`,
};

export const shadow = {
	pianoOutset: `0 0.25rem 0.25rem -0.0625rem rgba(0, 0, 0, 0.6)`,

	keyInsetTop: `inset 0rem 0.25rem 0.09375rem 0rem rgba(0, 0, 0, 0.15)`,
	keyInsetBottom: `inset 0 0.0625rem 0.5rem 0 rgba(0, 0, 0, 0.45)`,
	keyInsetLeft: `inset 0.15625rem 0 0.5rem 0rem rgba(0, 0, 0, 0.45)`,
	keyInsetRight: `inset -0.15625rem 0 0.5em 0rem rgba(0, 0, 0, 0.45)`,
	keyWhiteOutset: `0rem 0.1875rem 0.0625rem -0.0625rem rgba(0, 0, 0, 0.15)`,
	keyWhiteOutsetActive: `0rem 0.15rem 0.03125rem -0.0625rem rgba(0, 0, 0, 0.15)`,
	keyBlackOutset: `0 0.1rem 0.03125rem 0rem rgba(0, 0, 0, 0.3)`,
	keyBlackOutsetActive: `0 0.075rem 0.00625rem 0rem rgba(0, 0, 0, 0.3)`,

	buttonOutset: `0 0.0625rem 0.03125rem 0rem rgba(0, 0, 0, 0.3)`,
	buttonLightInset: `inset 0 0 0 0.125rem rgba(15, 15, 15, 0.3)`,
	buttonLightOutset: `0 0 1rem 0.125rem rgba(${color.buttonLightActive}, 0.6),
    0 0 0.25rem 0.0625rem rgba(${color.buttonLightActive}, 0.6)`,

	knobInset: `inset 0 0 0rem 0.125rem rgba(0, 0, 0, 0.15)`,
	knobOutset: `0 0.0625rem 0.0625rem 0rem rgba(0, 0, 0, 0.3)`,
};

export const font = {
	digital: 'DS Digital',
	label: 'Russo One',
};

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'DS Digital';
    src: url('../assets/fonts/ds-digital/DS-DIGIT.TTF');
  }

  @font-face {
    font-family: 'Russo One';
    src: url('../assets/fonts/russo-one/Russo_One.ttf');
  }

  @font-face {
    font-family: 'Heroic Avenger';
    src: url('../assets/fonts/heroic-avenger/AVENGEANCE\ HEROIC\ AVENGER.ttf');
  }

  @font-face {
    font-family: 'Segoe UI';
    src: url('../assets/fonts/segoe-ui/segoe-ui-light.ttf');
    font-weight: 100;
    font-style: normal;
  }

  @font-face {
    font-family: 'Segoe UI';
    src: url('../assets/fonts/segoe-ui/segoe-ui-semilight.ttf');
    font-weight: 300;
    font-style: normal;
  }

  @font-face {
    font-family: 'Segoe UI';
    src: url('../assets/fonts/segoe-ui/segoe-ui-normal.ttf');
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: 'Segoe UI';
    src: url('../assets/fonts/segoe-ui/segoe-ui-semibold.ttf');
    font-weight: 600;
    font-style: normal;
  }

  @font-face {
    font-family: 'Segoe UI';
    src: url('../assets/fonts/segoe-ui/segoe-ui-bold.ttf');
    font-weight: 700;
    font-style: normal;
  }

  @font-face {
    font-family: 'Segoe UI';
    src: url('../assets/fonts/segoe-ui/segoe-ui-black.ttf');
    font-weight: 800;
    font-style: normal;
  }
`;
