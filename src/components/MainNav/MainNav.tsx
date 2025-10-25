'use client'

import Image from "next/image";
import Link from "next/link";
import styles from "./mainnav.module.css";
import { useState } from "react";

type MainNavProps = {
  onOpenFavorites?: () => void;
};

export default function MainNav({ onOpenFavorites }: MainNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMyPlaylistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenFavorites) {
      onOpenFavorites(); // Вызываем функцию открытия модалки
    }
    setIsMenuOpen(false); // Закрываем меню на мобильных
  };

  return (
    <nav className={styles.main__nav}>
      <div className={styles.nav__logo}>
        <Image
          width={250}
          height={170}
          className={styles.logo__image}
          src="/img/logo.png"
          alt={"logo"}
        />
      </div>
      <div className={styles.nav__burger} onClick={toggleMenu}>
        <span className={styles.burger__line}></span>
        <span className={styles.burger__line}></span>
        <span className={styles.burger__line}></span>
      </div>
      <div
        className={`${styles.nav__menu} ${isMenuOpen ? styles.menu__active : ""}`}
      >
        <ul className={styles.menu__list}>
          <li className={styles.menu__item}>
            <Link href="#" className={styles.menu__link}>
              Главная
            </Link>
          </li>
          <li className={styles.menu__item}>
            {/* Заменяем Link на button или a с обработчиком */}
            <a href="#" className={styles.menu__link} onClick={handleMyPlaylistClick}>
              Мой плейлист
            </a>
          </li>
          <li className={styles.menu__item}>
            <Link href={'./../auth/signin'} className={styles.menu__link}>
              Войти
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}