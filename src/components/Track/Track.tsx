"use client";

import { useAppDispatch } from "../store/store";
import styles from "@/app/music/Center/CenterBlock/centerblock.module.css";
import { TrackType } from "../sharedTypes/types";
import { formatTime } from "../utils/helper";
import {
  setCurrentPlaylist,
  setCurrentTrack,
} from "../store/features/trackSlice";
import Link from "next/link";
import classNames from "classnames";
import { useState, useEffect } from "react";

type trackTypeProp = {
  track: TrackType;
  isCurrent: boolean;
  isPlaying: boolean;
  playlist: TrackType[];
  isLiked?: boolean;
  onToggleLike?: (track: TrackType) => void;
};

export default function Track({
  track,
  isCurrent,
  isPlaying,
  playlist,
  isLiked = false,
  onToggleLike,
}: trackTypeProp) {
  const dispatch = useAppDispatch();
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);

  // Синхронизируем локальное состояние с пропсами
  useEffect(() => {
    setLocalIsLiked(isLiked);
  }, [isLiked]);

  // Загружаем начальное состояние из localStorage
  useEffect(() => {
    const savedLikedTracks = localStorage.getItem('likedTracks');
    if (savedLikedTracks) {
      const likedTracks = JSON.parse(savedLikedTracks);
      const isTrackLiked = likedTracks.some((t: TrackType) => t._id === track._id);
      setLocalIsLiked(isTrackLiked);
    }
  }, [track._id]);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Немедленно меняем состояние для мгновенного отклика UI
    const newLikedState = !localIsLiked;
    setLocalIsLiked(newLikedState);
    
    // Получаем текущие лайкнутые треки из localStorage
    const savedLikedTracks = localStorage.getItem('likedTracks');
    let likedTracks: TrackType[] = savedLikedTracks ? JSON.parse(savedLikedTracks) : [];
    
    if (newLikedState) {
      // Добавляем трек в избранное
      if (!likedTracks.some(t => t._id === track._id)) {
        likedTracks.push(track);
      }
    } else {
      // Удаляем трек из избранного
      likedTracks = likedTracks.filter(t => t._id !== track._id);
    }
    
    // Сохраняем обратно в localStorage
    localStorage.setItem('likedTracks', JSON.stringify(likedTracks));
    
    // Вызываем callback функцию если она передана
    if (onToggleLike) {
      onToggleLike(track);
    }

    // Можно добавить уведомление в консоль для отладки
    console.log(`${newLikedState ? 'Добавлен' : 'Удален'} трек:`, track.name);
  };

  const onClickTrack = () => {
    dispatch(setCurrentTrack(track));
    dispatch(setCurrentPlaylist(playlist));
  };

  return (
    <div
      key={track._id}
      className={styles.playlist__item}
      onClick={onClickTrack}
    >
      <div className={styles.playlist__track}>
        <div className={styles.track__title}>
          <div className={styles.track__titleImage}>
            {isCurrent ? (
              <div className={styles.track__statusIndicator}>
                <div
                  className={classNames(styles.track__statusDot, {
                    [styles.pulsing]: isPlaying,
                  })}
                />
              </div>
            ) : (
              <svg className={styles.track__titleSvg}>
                <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
              </svg>
            )}
          </div>
          <div className={styles.track__titleText}>
            <Link className={styles.track__titleLink} href="">
              {track.name} <span className={styles.track__titleSpan}></span>
            </Link>
          </div>
        </div>
        <div className={styles.track__author}>
          <Link className={styles.track__authorLink} href="">
            {track.author}
          </Link>
        </div>
        <div className={styles.track__album}>
          <Link className={styles.track__albumLink} href="">
            {track.album}
          </Link>
        </div>
        <div className={styles.track__time}>
          <svg 
            className={styles.track__timeSvg} 
            onClick={handleLikeClick}
            style={{ 
              cursor: 'pointer', 
              fill: localIsLiked ? '#B672FF' : 'transparent',
              stroke: localIsLiked ? '#B672FF' : '#696969',
              transition: 'fill 0.2s ease, stroke 0.2s ease'
            }}
          >
            <use xlinkHref={`/img/icon/sprite.svg#icon-${localIsLiked ? 'like' : 'dislike'}`}></use>
          </svg>
          <span className={styles.track__timeText}>
            {formatTime(track.duration_in_seconds)}
          </span>
        </div>
      </div>
    </div>
  );
}