import React from "react";
import styles from "./index.module.scss";
import classNames from "classnames";

import { ReactComponent as Expand } from "@/assets/icons/expand.svg";
import { ReactComponent as DoubleExpand } from "@/assets/icons/double_expand.svg";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageGroupSize?: number; // 기본 10개씩
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageGroupSize = 10,
}) => {
  const currentGroup = Math.floor((currentPage - 1) / pageGroupSize);
  const startPage = currentGroup * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);
  const showExpand = totalPages > pageGroupSize;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, idx) => startPage + idx
  );

  return (
    <nav className={styles.paginationContainer}>
      {/* 맨 앞으로 */}
      <button
        className={classNames(styles.pageButton, styles.arrowButton)}
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        aria-label="First Page"
      >
        <DoubleExpand width={16} height={16} />
      </button>

      {/* 이전 그룹 */}
      {showExpand && (
        <button
          className={classNames(styles.pageButton, styles.arrowButton)}
          onClick={() => handlePageChange(startPage - 1)}
          disabled={startPage === 1}
          aria-label="Previous 10 Pages"
        >
          <Expand width={16} height={16} />
        </button>
      )}

      {/* 페이지 버튼 */}
      {pages.map((page) => (
        <button
          key={page}
          className={classNames(styles.pageButton, {
            [styles.active]: page === currentPage,
          })}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      ))}

      {/* 다음 그룹 */}
      {showExpand && (
        <button
          className={classNames(
            styles.pageButton,
            styles.arrowButton,
            styles.rightArrowButton
          )}
          onClick={() => handlePageChange(endPage + 1)}
          disabled={endPage === totalPages}
          aria-label="Next 10 Pages"
        >
          <Expand width={16} height={16} />
        </button>
      )}

      {/* 맨 뒤로 */}
      <button
        className={classNames(
          styles.pageButton,
          styles.arrowButton,
          styles.rightArrowButton
        )}
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        aria-label="Last Page"
      >
        <DoubleExpand width={16} height={16} />
      </button>
    </nav>
  );
};

export default Pagination;
