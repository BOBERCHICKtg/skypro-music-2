"use client";

import classnames from "classnames";
import styles from "./centerblock.module.css";
import Search from "../Search/Search";
import { data } from "@/data";
import { formatTime, getUniqueValuesByKey } from "../utils/helper";
import { useState } from "react";
import Track from "../Track/Track";
import { useAppSelector } from "../store/store";

export default function CenterBlock() {
  const [showArtistFilter, setShowArtistFilter] = useState(false);
  const artists = getUniqueValuesByKey(data, "author");
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlaying = useAppSelector((state) => state.tracks.isPlay);

  const toggleArtistFilter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowArtistFilter(!showArtistFilter);
  };

  const closeFilter = () => {
    setShowArtistFilter(false);
  };

  return (
    <div className={styles.centerblock} onClick={closeFilter}>
      <Search title="" />
      <h2 className={styles.centerblock__h2}>Треки</h2>
      <div className={styles.centerblock__filter}>
        <div className={styles.filter__title}>Искать по:</div>
        <div className={styles.filter__buttonWrapper}>
          <div
            className={classnames(styles.filter__button, {
              [styles.active]: showArtistFilter,
            })}
            onClick={toggleArtistFilter}
          >
            исполнителю
            {showArtistFilter && (
              <div className={styles.filter__list}>
                {artists.map((artist) => (
                  <div
                    key={artist}
                    className={styles.filter__item}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {artist}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className={styles.filter__button}>году выпуска</div>
        <div className={styles.filter__button}>жанру</div>
      </div>
      <div className={styles.centerblock__content}>
        <div className={styles.content__title}>
          <div className={classnames(styles.playlistTitle__col, styles.col01)}>
            Трек
          </div>
          <div className={classnames(styles.playlistTitle__col, styles.col02)}>
            Исполнитель
          </div>
          <div className={classnames(styles.playlistTitle__col, styles.col03)}>
            Альбом
          </div>
          <div className={classnames(styles.playlistTitle__col, styles.col04)}>
            <svg className={styles.playlistTitle__svg}>
              <use xlinkHref="/img/icon/sprite.svg#icon-watch"></use>
            </svg>
          </div>
        </div>
        <div className={styles.content__playlist}>
          {data.map((track) => (
            <Track
              key={track._id}
              track={track}
              isCurrent={currentTrack?._id === track._id}
              isPlaying={isPlaying && currentTrack?._id === track._id}
              playlist={data}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
