import React from 'react';

/**
 * Collabsphere Brand Logo
 * 
 * Recreates the exact brand logo:
 * - Slate-blue open bracket frame (#43577D)
 * - Terracotta brand wordmark "Collabsphere" (#B84B00) styled in Comfortaa font
 */
export const Logo = ({
  height = 34,
  mode = 'full', // 'full' | 'icon'
  variant = 'default', // 'default' | 'inverted' | 'monochrome'
  style = {},
  className = '',
  ...props
}) => {
  const isIconOnly = mode === 'icon';

  // Aspect ratio calculations:
  // Full logo bbox: 36, 120, 330, 164 (aspect ratio 330 : 164 = 2.012)
  // Icon-only bbox: 36, 120, 165, 164 (aspect ratio ~ 1.0)
  const viewBox = isIconOnly ? '36 120 165 164' : '36 120 330 164';
  const aspectRatio = isIconOnly ? 1 : 330 / 164;
  const calculatedWidth = typeof height === 'number' ? Math.round(height * aspectRatio) : undefined;

  // Colors based on variant
  const frameColor = variant === 'inverted' ? '#94A3B8' : variant === 'monochrome' ? 'currentColor' : '#43577D';
  const textColor = variant === 'inverted' ? '#FF7A45' : variant === 'monochrome' ? 'currentColor' : '#B84B00';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      height={height}
      width={calculatedWidth}
      className={`collabsphere-logo ${className}`}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        overflow: 'visible',
        ...style,
      }}
      aria-label="Collabsphere"
      role="img"
      {...props}
    >
      <title>Collabsphere</title>
      
      {/* Slate-blue open bracket frame */}
      <path
        d="M 196 153 L 196 124 L 41 124 L 41 280 L 196 280 L 196 251"
        fill="none"
        stroke={frameColor}
        strokeWidth="3.2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />

      {/* Brand wordmark styled in Comfortaa font */}
      {!isIconOnly && (
        <text
          x="119"
          y="214"
          fontFamily="'Comfortaa', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontSize="44"
          fontWeight="600"
          letterSpacing="-0.01em"
          fill={textColor}
        >
          Collabsphere
        </text>
      )}
    </svg>
  );
};

export default Logo;
