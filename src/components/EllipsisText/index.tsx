import { useRef } from "react";

export interface EllipsisTextProps {
  text: string;
  id: string;
  showToggle?: boolean;
  tooltipProps?: {
    place?: "top" | "bottom" | "left" | "right";
    style?: React.CSSProperties;
    offset?: number;
    [key: string]: any;
  };
  className?: string;
}

function EllipsisText({ id, text, className = "" }: EllipsisTextProps) {
  const textRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        ref={textRef}
        id={id}
        data-tooltip-id={id}
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        className={className}
      >
        {text}
      </div>
    </>
  );
}

export default EllipsisText;
