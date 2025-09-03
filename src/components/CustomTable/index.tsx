import styles from "./index.module.scss";
import { type ReactNode, isValidElement } from "react";
import classNames from "classnames";
import { ReactComponent as ArrowIcon } from "@/assets/icons/arrow_icon.svg";
import Table from "../Table";
import Spinner from "@/components/Spinner";
import EllipsisText from "../EllipsisText";
import Pagination from "../Pagination";
import { getValue } from "@/utils";

export type SortType = "asc" | "desc" | undefined;

export type ColumnProps<T> = {
  key: Extract<keyof T, string>;
  header: string;
  width?: number;
  sortable?: boolean;
  sortValue?: SortType;
  sortCallback?: (direction: SortType) => void;
  render?: (item: T) => ReactNode;
  format?: (value: T[keyof T]) => ReactNode;
};

interface CustomTableProps<T> {
  data?: T[];
  columns: ColumnProps<T>[];
  selectedRowId?: string;
  onClickRow?: (id: string) => void;
  isLoading?: boolean;
  emptyText?: string;
  emptyStateComponent?: ReactNode;
  rowKey: keyof T;
  className?: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export default function CustomTable<T>({
  data = [],
  columns,
  selectedRowId,
  onClickRow,
  isLoading,
  emptyText = "데이터가 없습니다.",
  rowKey,
  className,
  emptyStateComponent,
  currentPage,
  onPageChange,
  totalPages,
}: CustomTableProps<T>) {
  const totalColSpan = columns.length;

  const renderValue = (item: T, column: ColumnProps<T>): ReactNode => {
    const rawValue = getValue<T>(item, column.key) as T[keyof T];

    if (column.render) {
      return column.render(item);
    }

    if (typeof rawValue === "object" && !isValidElement(rawValue)) {
      console.warn(`⚠️ Invalid object at column "${column.key}"`, rawValue);
      return "⚠️ Invalid";
    }

    const formatted =
      rawValue !== undefined && column.format
        ? column.format(rawValue)
        : rawValue;

    if (
      formatted === null ||
      formatted === undefined ||
      (typeof formatted === "string" && formatted.trim() === "")
    ) {
      return "-";
    }

    return column.format ? column.format(rawValue) : (rawValue as ReactNode);
  };

  const handleSortClick = (
    currentDirection: SortType,
    next: SortType,
    callback?: (dir: SortType) => void
  ) => {
    if (!callback) return;
    callback(currentDirection === next ? undefined : next);
  };

  return (
    <>
      <Table className={classNames(styles.tableWrapper, className)}>
        <colgroup>
          {columns.map((col) => (
            <col
              key={col.key}
              style={col.width ? { width: `${col.width}px` } : {}}
            />
          ))}
        </colgroup>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={styles.headerCell}>
                <div className={styles.headerContent}>
                  {col.header}
                  {col.sortable && (
                    <div className={styles.sortBtnContainer}>
                      <button
                        className={classNames(styles.sortBtn, styles.sortUp, {
                          [styles.selectedSortBtn]: col.sortValue === "asc",
                        })}
                        onClick={() =>
                          handleSortClick(
                            col.sortValue,
                            "asc",
                            col.sortCallback
                          )
                        }
                      >
                        <ArrowIcon />
                      </button>
                      <button
                        className={classNames(styles.sortBtn, {
                          [styles.selectedSortBtn]: col.sortValue === "desc",
                        })}
                        onClick={() =>
                          handleSortClick(
                            col.sortValue,
                            "desc",
                            col.sortCallback
                          )
                        }
                      >
                        <ArrowIcon />
                      </button>
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {isLoading && (
            <tr className={styles.emptyRow}>
              <td colSpan={totalColSpan}>
                <div className={styles.centeredCell}>
                  <Spinner width={25} height={25} />
                </div>
              </td>
            </tr>
          )}

          {!isLoading && data.length === 0 && (
            <tr className={styles.emptyRow}>
              <td colSpan={totalColSpan}>
                <div className={styles.centeredCell}>
                  {emptyStateComponent ?? emptyText}
                </div>
              </td>
            </tr>
          )}

          {!isLoading &&
            data.map((item, rowIndex) => (
              <tr
                key={String(item[rowKey])}
                onClick={() => onClickRow?.(String(item[rowKey]))}
                className={classNames({
                  [styles.selectedRow]: selectedRowId === String(item[rowKey]),
                })}
              >
                {columns.map((col) => (
                  <td key={col.key} className={styles.bodyCell}>
                    {isValidElement(renderValue(item, col)) ? (
                      renderValue(item, col)
                    ) : (
                      <EllipsisText
                        id={`${item[rowKey]}_${col.key}_${rowIndex}`}
                        text={String(renderValue(item, col) ?? "")}
                        showToggle
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </Table>
      {!isLoading && totalPages && totalPages > 1 && onPageChange && (
        <div className={styles.paginationWrapper}>
          <Pagination
            currentPage={currentPage ?? 1}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </>
  );
}
