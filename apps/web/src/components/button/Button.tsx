import type { CSSProperties } from "react";
import "./button.css";

interface ButtonProps {
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  color?: string;
  reverseFont?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

/**
 * Button component with pixel corners and customizable styles.
 * @example
 * <Button
 *   disabled={false}
 *   color="#5da93c"
 *   reverseFont={true}
 *   onClick={() => console.log("Button clicked!")}
 * >
 *  Button
 * </Button>
 */
export default function Button({
  className,
  style,
  disabled,
  color,
  reverseFont,
  children,
  onClick,
}: ButtonProps) {
  const buttonStyles = {
    backgroundColor: color ?? undefined,
    color: reverseFont ? "white" : "black",
    WebkitTextStroke: reverseFont ? "5px black" : undefined,
    paintOrder: reverseFont ? "stroke fill" : undefined,
  };
  return (
    <div
      className={`${className ? `${className} ` : ""}pixel-corners--wrapper`}
      style={style}
      onClick={onClick}
    >
      <button
        type="button"
        style={buttonStyles}
        disabled={disabled || false}
        className="pixel-corners"
      >
        {children}
      </button>
    </div>
  );
}
