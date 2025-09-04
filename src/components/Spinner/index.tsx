import { ReactComponent as SpinnerIcon } from "@/assets/icons/spinner_icon.svg";
import classNames from "classnames";

interface SpinnerProps {
  className?: string;
  width?: number;
  height?: number;
  color?: string;
}

export default function Spinner({
  className = "",
  width = 20,
  height = 20,
  color = "#000",
}: SpinnerProps) {
  return (
    <div
      data-testid="spinner"
      className={classNames(className)}
      style={{ color: color }}
    >
      <SpinnerIcon width={width} height={height} />
    </div>
  );
}
