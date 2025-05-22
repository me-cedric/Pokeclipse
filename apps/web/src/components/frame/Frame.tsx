import "./frame.css";

interface FrameProps {
  children: React.ReactNode;
}

export default function Frame({ children }: FrameProps) {
  return (
    <div className="frame">
      <span>{children}</span>
    </div>
  );
}
