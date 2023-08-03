/**
 * Defines application color settings and definitions
 * We will define constant colors for all mode usage
 */
import { ThemeMode } from './types';

const WHITE = '#ffffff';
const WHITE_SHADE = '#F4F5F6';
const BLACK = '#000000';
const BLACK_TINT = '#ffffff';
const GRAY = '';
const LIGHT_GRAY = '';

interface ColorPalette {
  // primary: string;
  // secondary: string;
  background: string;
  // text: string;
  // success: string;
  // error: string;
  whiteShade: string;
}

type Theme = {
  light: typeof lightColor;
  dark: typeof darkColor;
};

const lightColor: ColorPalette = {
  // primary: '#007bff',
  // secondary: '#6c757d',
  background: WHITE,
  // text: '#333',
  // success: '#28a745',
  // error: '#dc3545',
  whiteShade: WHITE_SHADE
};

const darkColor: ColorPalette = {
  // primary: '#007bff',
  // secondary: '#6c757d',
  background: BLACK_TINT,
  // text: '#333',
  // success: '#28a745',
  // error: '#dc3545',
  whiteShade: WHITE_SHADE
};

const color: Theme = {
  light: lightColor,
  dark: darkColor
};

/**
 * export color based on the system mode
 * TODO: get this from system settings
 */
const prefersDarkMode = window.matchMedia(
  `(prefers-color-scheme: ${ThemeMode.DARK})`
).matches;
const themeMode = prefersDarkMode ? ThemeMode.DARK : ThemeMode.LIGHT;

const colorMode: ColorPalette = color[themeMode];
export default colorMode;
