import "./frame.css";

interface FrameProps {
  children: React.ReactNode;
}

/**
 * Frame component to wrap content with a styled frame.
 * @example
 * <Frame>
 *   <p>Your content here</p>
 * </Frame>
 */
export default function Frame({ children }: FrameProps) {
  return (
    <div className="frame">
      <span>{children}</span>
    </div>
  );
}
