import { Colors } from './types';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  glyph: glyphs;
  size?: number;
  glyphColor?: IconColor;
  containerStyle?: string
}

export type glyphs = 
  'add' | 
  'admin' |
  'arrow-right' |
  'arrow-left' |
  'arrow-down' |
  'arrow-up' |
  'download' |
  'dropdown' |
  'edit' |
  'export' |
  'filter' |
  'privilege' |
  'profile' |
  'people' |
  'rating' |
  'review' |
  'search' |
  'sort' |
  'subject' |
  'schedule' |
  'teacher' |
  'trash' |
  'institute' |
  'module';

type IconColor = keyof typeof Colors;
