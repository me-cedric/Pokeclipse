import "./button.css";

interface ButtonProps {
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
    <div className="pixel-corners--wrapper">
      <button
        type="button"
        style={buttonStyles}
        disabled={disabled || false}
        className="pixel-corners"
        onClick={onClick}
      >
        {children}
      </button>
    </div>
  );
}
