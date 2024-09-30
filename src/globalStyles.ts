import { createGlobalStyle } from 'styled-components';
import './vendor/normalize.css';

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Roboto';
    font-weight: 400;
    src: url('./fonts/Roboto-Regular.woff2') format('woff2'),
         url('./fonts/Roboto-Regular.woff') format('woff');
  }

  @font-face {
    font-family: 'Roboto';
    font-weight: 500;
    src: url('./fonts/Roboto-Medium.woff2') format('woff2'),
         url('./fonts/Roboto-Medium.woff') format('woff');
  }

  * {
    font-family: 'Roboto', sans-serif;
    box-sizing: border-box;
    
  }


`;

export default GlobalStyle;
