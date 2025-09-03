import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import { ReactComponent as ToastcamLogoWhite } from "@/assets/imgs/toastcam_logo_white.svg";
import styles from "./index.module.scss";

export interface HeaderProps {
  className?: string;
}

const Header = ({ className = "" }: HeaderProps) => {
  const location = useLocation();

  const handleLogoClick = () => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className={classNames(styles.headerContainer, className)}>
      <div className={styles.header}>
        <div className={styles.logoContainer}>
          <Link to="/" onClick={handleLogoClick}>
            <ToastcamLogoWhite width={160} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
