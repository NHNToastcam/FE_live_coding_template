import classNames from "classnames";
import styles from "./index.module.scss";
import { ReactComponent as CompanyLogoWhite } from "@/assets/imgs/company_logo_white.svg";

export interface FooterProps {
  className?: string;
}

const Footer = ({ className = "" }: FooterProps) => {
  return (
    <footer className={classNames(styles.footerContainer, className)}>
      <CompanyLogoWhite width={100} height={30} />
    </footer>
  );
};

export default Footer;
