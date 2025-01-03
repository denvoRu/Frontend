import { Colors } from './types';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  glyph: glyphs;
  size?: number;
  glyphColor?: IconColor;
  containerStyle?: string
}

export type glyphs = 
  'add' | 
  'arrow-right' |
  'arrow-left' |
  'arrow-down' |
  'arrow-up' |
  'download' |
  'edit' |
  'export' |
  'filter' |
  'privilege' |
  'rating' |
  'review' |
  'search' |
  'sort' |
  'subject' |
  'teacher' |
  'institute' |
  'dropdown' |
  'profile' |
  'trash';

type IconColor = keyof typeof Colors;
