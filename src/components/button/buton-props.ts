import { VariantProps } from "class-variance-authority";
import { buttonVariants } from "./button-variants";

export interface ButtonProps 
  extends React.HTMLAttributes<HTMLButtonElement>, 
    VariantProps<typeof buttonVariants> {}