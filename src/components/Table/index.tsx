import { forwardRef, type ReactNode, type Ref } from "react";
import styles from "./index.module.scss";
import classNames from "classnames";

export interface TableProps {
  children: ReactNode;
  className?: string;
  onScroll?: () => void;
  hasFade?: boolean;
}

// 익명 함수 대신 이름 있는 함수로 감싸면 displayName이 자동 설정됩니다.
const Table = forwardRef<HTMLDivElement, TableProps>(function Table(
  { children, className, onScroll },
  ref: Ref<HTMLDivElement>
) {
  return (
    <div
      onScroll={() => onScroll?.()}
      ref={ref}
      className={classNames(styles.tableContainer, className)}
    >
      <table className={styles.table}>{children}</table>
    </div>
  );
});

export default Table;
