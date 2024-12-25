import { forwardRef } from "react"
import { IconProps } from "./icon-props";
import { Colors } from './types';

const Icon = forwardRef<HTMLSpanElement, IconProps>(
  ({ 
    glyph = 'arrow-right', size = 24, 
    glyphColor = 'primary', containerStyle, className, ...props 
  }, ref) => {
    const iconStyle: React.CSSProperties = {
      maskImage: `url(/icons/${glyph}.svg)`,
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: Colors[glyphColor]
    };

    if (containerStyle) {
      return <div className={containerStyle}>
        <i
          className={`icon ${className}`}
          style={iconStyle}
          ref={ref}
          {...props}
        />
      </div>
    }

    return (
      <i 
        className={`icon ${className}`} 
        style={iconStyle} 
        ref={ref}
        {...props} 
      />
    );
  },
);
Icon.displayName = 'Icon'

export { Icon };
