"use client";

import classnames from "classnames";
import styles from "./centerblock.module.css";
import { data } from "@/data";
import { formatTime, getUniqueValuesByKey } from "../../../../components/utils/helper";
import { useState, useEffect } from "react";
import Search from "@/components/Search/Search";
import Track from "@/components/Track/Track";
import { useAppSelector } from "@/components/store/store";
import { TrackType } from "../sharedTypes/types";

export default function MyPlaylist() {
  const [showArtistFilter, setShowArtistFilter] = useState(false);
  const [likedTracks, setLikedTracks] = useState<TrackType[]>([]);
  const artists = getUniqueValuesByKey(data, "author");
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlaying = useAppSelector((state) => state.tracks.isPlay);

  // Загружаем лайкнутые треки из localStorage при монтировании
  useEffect(() => {
    const savedLikedTracks = localStorage.getItem('likedTracks');
    if (savedLikedTracks) {
      setLikedTracks(JSON.parse(savedLikedTracks));
    }
  }, []);

  // Функция для переключения лайка
  const toggleLikeTrack = (track: TrackType) => {
    setLikedTracks(prev => {
      const isAlreadyLiked = prev.some(t => t._id === track._id);
      let newLikedTracks;
      
      if (isAlreadyLiked) {
        // Удаляем трек из лайкнутых
        newLikedTracks = prev.filter(t => t._id !== track._id);
      } else {
        // Добавляем трек в лайкнутые
        newLikedTracks = [...prev, track];
      }
      
      // Сохраняем в localStorage
      localStorage.setItem('likedTracks', JSON.stringify(newLikedTracks));
      return newLikedTracks;
    });
  };

  // Проверяем, лайкнут ли трек
  const isTrackLiked = (trackId: string) => {
    return likedTracks.some(track => track._id === trackId);
  };

  const toggleArtistFilter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowArtistFilter(!showArtistFilter);
  };

  return (
    <>
      <Search title="" />
      <h2 className={styles.centerblock__h2}>Мой плейлист</h2>
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
          {likedTracks.length > 0 ? (
            likedTracks.map((track) => (
              <Track
                key={track._id}
                track={track}
                isCurrent={currentTrack?._id === track._id}
                isPlaying={isPlaying && currentTrack?._id === track._id}
                playlist={likedTracks}
                isLiked={isTrackLiked(track._id)}
                onToggleLike={toggleLikeTrack}
              />
            ))
          ) : (
            <div className={styles.emptyPlaylist}>
              В вашем плейлисте пока нет треков
            </div>
          )}
        </div>
      </div>
    </>
  );
}