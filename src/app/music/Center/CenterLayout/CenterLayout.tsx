// components/CenterLayout/CenterLayout.tsx
"use client";

import { ReactNode } from "react";
import styles from "./layout.module.css"; // создайте этот CSS файл

interface CenterLayoutProps {
  children: ReactNode;
}

export default function CenterLayout({ children }: CenterLayoutProps) {
  const closeFilter = () => {
    // Логика закрытия фильтров, если нужна
  };

  return (
    <div className={styles.centerlayout} onClick={closeFilter}>
      {children}
    </div>
  );
}