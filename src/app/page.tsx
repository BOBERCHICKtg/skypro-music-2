import "./page.css";
import styles from "./page.module.css";
import Bar from "@/components/Bar/Bar";
import MainSidebar from "@/components/MainSidebar/MainSidebar";
import CenterBlock from "@/components/CenterBlock/CenterBlock";
import MainNav from "@/components/MainNav/MainNav";

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <div className={"container"}>
        <main className={"main"}>
          <MainNav />
          <CenterBlock />
          <MainSidebar />
          <Bar />
        </main>
        <footer className="footer"></footer>
      </div>
    </div>
  );
}
