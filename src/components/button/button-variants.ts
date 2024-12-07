import { cva } from "class-variance-authority";
import s from './button.module.scss';

export const buttonVariants = cva(
  s.button,
  {
    variants: {
      variant: {
        primary: s.button_primary,
        secondary: s.button_secondary,
        lightBlack: s.button_lightBlack,
        grey: s.button_grey,
        whiteMain: s.button_whiteMain,
        whiteDangerous: s.button_whiteDangerous,
      },
      size: {
        default: s.button_default,
        max: s.button_max,
        icon: s.button_icon,
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);
