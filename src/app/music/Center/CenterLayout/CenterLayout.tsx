"use client";

import { useState } from "react";
import styles from "./../CenterBlock/centerblock.module.css"
import { data } from "@/data";
import Track from "@/components/Track/Track";
import classNames from "classnames";
import Search from "@/components/Search/Search";
import { getUniqueValuesByKey } from "@/components/utils/helper";
import { useAppSelector } from "@/components/store/store";
import FavoriteTracksModal from "../MyPlaylist/FovoriteTracks";

export default function CenterLayout() {
  const [showArtistFilter, setShowArtistFilter] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  
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

  const handleOpenFavorites = () => {
    setIsFavoritesOpen(true);
  };

  const handleCloseFavorites = () => {
    setIsFavoritesOpen(false);
  };

  return (
    <>
      <div className={styles.centerlayout} onClick={closeFilter}>
        <Search title="" />
        <h2 className={styles.centerblock__h2}>Треки</h2>
        <div className={styles.centerblock__filter}>
          <div className={styles.filter__title}>Искать по:</div>
          <div className={styles.filter__buttonWrapper}>
            <div
              className={classNames(styles.filter__button, {
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
            <div className={classNames(styles.playlistTitle__col, styles.col01)}>
              Трек
            </div>
            <div className={classNames(styles.playlistTitle__col, styles.col02)}>
              Исполнитель
            </div>
            <div className={classNames(styles.playlistTitle__col, styles.col03)}>
              Альбом
            </div>
            <div className={classNames(styles.playlistTitle__col, styles.col04)}>
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

      {/* Модальное окно с избранными треками */}
      <FavoriteTracksModal
        isOpen={isFavoritesOpen}
        onClose={handleCloseFavorites}
      />
    </>
  );
}