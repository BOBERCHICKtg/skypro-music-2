'use client';

import Bar from "@/components/Bar/Bar";
import MainSidebar from "@/components/MainSidebar/MainSidebar";
import MainNav from "@/components/MainNav/MainNav";
import CenterBlockLayout from "../CenterBlock/CenterBlockLayout";
import MyPlaylistCenterBlock from "../CenterBlock/MyPlaylistCenterBlock";

export default function MyPlaylistPage() {
  return (
    <div className="wrapper">
      <div className="container">
        <main className="main">
          <MainNav />
          <CenterBlockLayout>
            <MyPlaylistCenterBlock />
          </CenterBlockLayout>
          <MainSidebar />
          <Bar />
        </main>
        <footer className="footer"></footer>
      </div>
    </div>
  );
}