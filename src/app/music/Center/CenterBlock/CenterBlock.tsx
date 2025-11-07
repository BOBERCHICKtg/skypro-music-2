"use client";

import { useState, useEffect } from "react";
import styles from "./centerblock.module.css";
import { data } from "@/data";
import Track from "@/components/Track/Track";
import classNames from "classnames";
import Search from "@/components/Search/Search";
import { getUniqueValuesByKey } from "@/components/utils/helper";
import { useAppSelector, useAppDispatch } from "@/components/store/store";
import { getFavoriteTracks } from "@/services/tracks/tracksApi";
import { TrackType } from "@/components/sharedTypes/types";
import { isAuthenticated } from "@/services/auth/authApi";
import { setFavoriteTracks } from "@/components/store/features/favoritesSlice";

export default function CenterBlock() {
  const dispatch = useAppDispatch();
  const [showArtistFilter, setShowArtistFilter] = useState(false);
  const likedTrackIds = useAppSelector((state) => state.favorites.likedTrackIds);
  
  const artists = getUniqueValuesByKey(data, "author");
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlaying = useAppSelector((state) => state.tracks.isPlay);

  useEffect(() => {
    loadFavoriteTracks();
  }, []);

  const loadFavoriteTracks = async () => {
    try {
      if (!isAuthenticated()) return;
      
      const favorites = await getFavoriteTracks();
      dispatch(setFavoriteTracks(favorites));
      
    } catch (error: any) {
      if (error.message.includes('Токен не найден')) {
        console.log('Пользователь не авторизован');
      } else {
        console.error('Ошибка загрузки избранных треков:', error);
      }
    }
  };

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
              // Используем includes вместо has
              isLiked={likedTrackIds.includes(track._id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}