"use client";

import { useState, useEffect } from "react";
import styles from "./centerblock.module.css";
import Track from "@/components/Track/Track";
import classNames from "classnames";
import Search from "@/components/Search/Search";
import { getUniqueValuesByKey } from "@/components/utils/helper";
import { useAppSelector } from "@/components/store/store";
import { getFavoriteTracks } from "@/services/tracks/tracksApi";
import { TrackType } from "@/components/sharedTypes/types";
import { isAuthenticated } from "@/services/auth/authApi";

export default function MyPlaylistCenterBlock() {
  const [showArtistFilter, setShowArtistFilter] = useState(false);
  const [favoriteTracks, setFavoriteTracks] = useState<TrackType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Используем пустой массив если favoriteTracks не массив
  const artists = getUniqueValuesByKey(Array.isArray(favoriteTracks) ? favoriteTracks : [], "author");
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlaying = useAppSelector((state) => state.tracks.isPlay);

  useEffect(() => {
    loadFavoriteTracks();
  }, []);

  const loadFavoriteTracks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!isAuthenticated()) {
        setError('Для просмотра избранных треков необходимо войти в систему');
        return;
      }

      const favorites = await getFavoriteTracks();
      console.log('Загруженные избранные треки:', favorites);
      
      // Убедимся что это массив
      if (Array.isArray(favorites)) {
        setFavoriteTracks(favorites);
      } else {
        console.error('getFavoriteTracks вернул не массив:', favorites);
        setFavoriteTracks([]);
      }
      
    } catch (error: any) {
      console.error('Ошибка при загрузке избранных треков:', error);
      if (error.message.includes('Токен не найден')) {
        setError('Сессия истекла. Пожалуйста, войдите снова.');
      } else {
        setError('Ошибка при загрузке избранных треков');
      }
      setFavoriteTracks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleLike = (track: TrackType, isLiked: boolean) => {
    if (!isLiked) {
      setFavoriteTracks(prev => prev.filter(t => t._id !== track._id));
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
      <h2 className={styles.centerblock__h2}>Мой плейлист</h2>
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
          {isLoading ? (
            <div className={styles.emptyPlaylist}>Загрузка...</div>
          ) : error ? (
            <div className={styles.emptyPlaylist}>{error}</div>
          ) : Array.isArray(favoriteTracks) && favoriteTracks.length > 0 ? (
            favoriteTracks.map((track) => (
              <Track
                key={track._id}
                track={track}
                isCurrent={currentTrack?._id === track._id}
                isPlaying={isPlaying && currentTrack?._id === track._id}
                playlist={favoriteTracks}
                isLiked={true}
                onToggleLike={handleToggleLike}
              />
            ))
          ) : (
            <div className={styles.emptyPlaylist}>
              В избранном пока нет треков
            </div>
          )}
        </div>
      </div>
    </div>
  );
}