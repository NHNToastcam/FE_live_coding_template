import { forwardRef, type InputHTMLAttributes } from "react";
import classNames from "classnames";
import styles from "./index.module.scss";
import { ReactComponent as SearchIcon } from "@/assets/icons/search_icon.svg";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  iconSize?: number;
  isIconForward?: boolean;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      placeholder = "",
      value,
      onChange,
      className,
      iconSize = 24,
      isIconForward = true,
      ...rest
    },
    ref
  ) => {
    return (
      <div className={classNames(styles.inputContainer, className)}>
        {isIconForward ? (
          <div className={styles.icon}>
            <SearchIcon width={iconSize} height={iconSize} />
          </div>
        ) : (
          ""
        )}

        <input
          ref={ref}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={styles.input}
          {...rest}
        />
        {!isIconForward ? (
          <div className={styles.icon}>
            <SearchIcon width={iconSize} height={iconSize} />
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
