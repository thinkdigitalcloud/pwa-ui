import 'styled-components';
import type { AppTheme } from './types';

declare module 'styled-components' {
  // Makes `props.theme` fully typed inside every styled component.
  export interface DefaultTheme extends AppTheme {}
}
