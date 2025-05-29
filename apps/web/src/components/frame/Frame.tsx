import type { CSSProperties } from "react";
import "./frame.css";

interface FrameProps {
  className?: string;
  style?: CSSProperties;
  children: React.ReactNode;
}

/**
 * Frame component to wrap content with a styled frame.
 * @example
 * <Frame>
 *   <p>Your content here</p>
 * </Frame>
 */
export default function Frame({ className, style, children }: FrameProps) {
  return (
    <div className={`${className ? `${className} ` : ""}frame`} style={style}>
      <span>{children}</span>
    </div>
  );
}
