import { Colors } from './types';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  glyph: glyphs;
  size?: number;
  glyphColor?: IconColor;
}

type glyphs = 
  'add' | 
  'arrow-right' |
  'arrow-down' |
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
  'trash';

type IconColor = keyof typeof Colors;
