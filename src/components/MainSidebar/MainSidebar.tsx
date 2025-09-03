import Image from "next/image";
import Link from "next/link";
import styles from "./mainsidebar.module.css";

export default function MainSidebar() {
  return (
    <div className={styles.main__sidebar}>
      <div className={styles.sidebar__personal}>
        <p className={styles.sidebar__personalName}>Sergey.Ivanov</p>
        <div className={styles.sidebar__icon}>
          <svg>
            <use xlinkHref="/img/icon/sprite.svg#logout"></use>
          </svg>
        </div>
      </div>
      <div className={styles.sidebar__block}>
        <div className={styles.sidebar__list}>
          <div className={styles.sidebar__item}>
            <Link className={styles.sidebar__link} href="#">
              <Image
                className={styles.sidebar__img}
                src="/img/playlist01.png"
                alt="day's playlist"
                width={250}
                height={170}
              />
            </Link>
          </div>
          <div className={styles.sidebar__item}>
            <Link className={styles.sidebar__link} href="#">
              <Image
                className={styles.sidebar__img}
                src="/img/playlist02.png"
                alt="day's playlist"
                width={250}
                height={170}
              />
            </Link>
          </div>
          <div className={styles.sidebar__item}>
            <Link className={styles.sidebar__link} href="#">
              <Image
                className={styles.sidebar__img}
                src="/img/playlist03.png"
                alt="day's playlist"
                width={250}
                height={170}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
