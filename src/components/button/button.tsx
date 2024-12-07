import { forwardRef } from "react";
import { ButtonProps } from "./buton-props";
import { buttonVariants } from "./button-variants";

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <button 
        className={buttonVariants({ variant, size, className })} 
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
