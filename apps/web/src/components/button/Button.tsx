import "./button.css";

interface ButtonProps {
  disabled?: boolean;
  color?: string;
  reverseFont?: boolean;
  children: React.ReactNode;
}

export default function Button({
  disabled,
  color,
  reverseFont,
  children,
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
      >
        {children}
      </button>
    </div>
  );
}
