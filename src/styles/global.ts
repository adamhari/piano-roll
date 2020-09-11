import {createGlobalStyle} from 'styled-components/macro';
import DS_Digital from '../assets/fonts/ds-digital/DS-DIGIT.ttf';
import Russo_One from '../assets/fonts/russo-one/Russo_One.ttf';
import Segoe_UI_Black from '../assets/fonts/segoe-ui/segoe-ui-black.ttf';
import Segoe_UI_Bold from '../assets/fonts/segoe-ui/segoe-ui-bold.ttf';
import Segoe_UI_Light from '../assets/fonts/segoe-ui/segoe-ui-light.ttf';
import Segoe_UI_Normal from '../assets/fonts/segoe-ui/segoe-ui-normal.ttf';
import Segoe_UI_Semibold from '../assets/fonts/segoe-ui/segoe-ui-semibold.ttf';
import Segoe_UI_Semilight from '../assets/fonts/segoe-ui/segoe-ui-semilight.ttf';

// defining font faces in createGlobalStyle is troublesome, see: https://github.com/styled-components/styled-components/issues/1593
export default createGlobalStyle`
  html {
    font-size: 2em; /* global scale */
    -webkit-font-smoothing: antialiased;
  }

  body {
    font-family: 'Segoe UI', sans-serif;
  }

  #root {
    min-height: 98vh;
    display: flex;
    flex: 1;
    align-items: center;
  }

  /* @font-face {
    font-family: 'DS Digital';
    src: url(${DS_Digital})
  }

  @font-face {
    font-family: 'Russo One';
    src: url(${Russo_One});
  }

  @font-face {
    font-family: 'Segoe UI';
    src: url(${Segoe_UI_Light});
    font-weight: 100;
    font-style: normal;
  }

  @font-face {
    font-family: 'Segoe UI';
    src: url(${Segoe_UI_Semilight});
    font-weight: 300;
    font-style: normal;
  }

  @font-face {
    font-family: 'Segoe UI';
    src: url(${Segoe_UI_Normal});
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: 'Segoe UI';
    src: url(${Segoe_UI_Semibold});
    font-weight: 600;
    font-style: normal;
  }

  @font-face {
    font-family: 'Segoe UI';
    src: url(${Segoe_UI_Bold});
    font-weight: 700;
    font-style: normal;
  }

  @font-face {
    font-family: 'Segoe UI';
    src: url(${Segoe_UI_Black});
    font-weight: 800;
    font-style: normal;
  } */
`;
