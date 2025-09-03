import Footer from "../components/Footer";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import styles from "./index.module.scss";

const DefaultLayout = () => {
  return (
    <div className={styles.layoutWrapper}>
      <Header />
      <main id="mainContainer" className={styles.mainContent}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default DefaultLayout;
