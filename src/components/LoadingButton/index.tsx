import classNames from "classnames";
import styles from "./index.module.scss";
import Spinner from "../Spinner";

interface LoadingButtonProps {
  className?: string;
}

const LoadingButton = ({ className = "" }: LoadingButtonProps) => {
  return (
    <button className={classNames(styles.container, className)} disabled>
      <Spinner width={14} height={14} />
    </button>
  );
};

export default LoadingButton;
