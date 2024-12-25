import { forwardRef } from "react";
import { ButtonProps } from "./buton-props";
import { buttonVariants } from "./button-variants";

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, textColor, children, ...props }, ref) => {
    return (
      <button 
        className={buttonVariants({ variant, size, textColor, className })} 
        ref={ref}
        {...props} 
      >
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button'

export { Button };
