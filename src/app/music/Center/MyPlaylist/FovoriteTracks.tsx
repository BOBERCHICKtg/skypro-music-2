"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "../../../../components/store/store";
import styles from "@/app/music/Center/CenterBlock/centerblock.module.css";
import Track from "@/components/Track/Track";
import { TrackType } from "../../../../components/sharedTypes/types";
import classnames from "classnames";

type FavoriteTracksModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function FavoriteTracksModal({ isOpen, onClose }: FavoriteTracksModalProps) {
  const [likedTracks, setLikedTracks] = useState<TrackType[]>([]);
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlaying = useAppSelector((state) => state.tracks.isPlay);

  // Загружаем лайкнутые треки из localStorage
  useEffect(() => {
    const savedLikedTracks = localStorage.getItem('likedTracks');
    if (savedLikedTracks) {
      setLikedTracks(JSON.parse(savedLikedTracks));
    }
  }, []);

  // Функция для удаления трека из избранного
  const handleToggleLike = (track: TrackType) => {
    setLikedTracks(prev => {
      const newLikedTracks = prev.filter(t => t._id !== track._id);
      localStorage.setItem('likedTracks', JSON.stringify(newLikedTracks));
      return newLikedTracks;
    });
  };

  // Закрытие модального окна при клике на overlay
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Закрытие по ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className={styles.modalOverlay} 
      onClick={handleOverlayClick}
    >
      <div className={styles.modalContent}>
        {/* Заголовок модального окна */}
        <div className={styles.modalHeader}>
          <h2 className={styles.centerblock__h2}>Мои треки</h2>
          <button 
            className={styles.modalCloseButton}
            onClick={onClose}
            aria-label="Закрыть"
          >
            <svg className={styles.modalCloseIcon}>
              <use xlinkHref="/img/icon/sprite.svg#icon-close"></use>
            </svg>
          </button>
        </div>

        {/* Контент модального окна */}
        <div className={styles.modalBody}>
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

          <div className={styles.modalPlaylist}>
            {likedTracks.length > 0 ? (
              likedTracks.map((track) => (
                <Track
                  key={track._id}
                  track={track}
                  isCurrent={currentTrack?._id === track._id}
                  isPlaying={isPlaying && currentTrack?._id === track._id}
                  playlist={likedTracks}
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
    </div>
  );
}