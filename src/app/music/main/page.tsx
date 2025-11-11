'use client';

import "./page.css";
import styles from "./page.module.css";
import Bar from "@/components/Bar/Bar";
import MainSidebar from "@/components/MainSidebar/MainSidebar";
import MainNav from "@/components/MainNav/MainNav";
import CenterBlockLayout from "../Center/CenterBlock/CenterBlockLayout";
import CenterBlock from "../Center/CenterBlock/CenterBlock";
import MyPlaylistCenterBlock from '../Center/CenterBlock/MyPlaylistCenterBlock'

export default function Home() {
  // Для переключения между страницами
  const currentPage = "tracks"; // или "myPlaylist"

  return (
    <div className={styles.wrapper}>
      <div className={"container"}>
        <main className={"main"}>
          <MainNav />
          <CenterBlockLayout>
            {currentPage === "tracks" ? (
              <CenterBlock />
            ) : (
              <MyPlaylistCenterBlock />
            )}
          </CenterBlockLayout>
          <MainSidebar />
          <Bar />
        </main>
        <footer className="footer"></footer>
      </div>
    </div>
  );
}