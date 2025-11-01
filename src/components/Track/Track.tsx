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
import { useState } from "react";
import { addToFavorites, removeFromFavorites } from "@/services/tracks/tracksApi";
import { isAuthenticated } from "@/services/auth/authApi";

type trackTypeProp = {
  track: TrackType;
  isCurrent: boolean;
  isPlaying: boolean;
  playlist: TrackType[];
};

export default function Track({
  track,
  isCurrent,
  isPlaying,
  playlist,
}: trackTypeProp) {
  const dispatch = useAppDispatch();
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated()) {
      alert('Для добавления в избранное необходимо войти в систему');
      return;
    }
    
    try {
      if (isLiked) {
        await removeFromFavorites(track._id);
      } else {
        await addToFavorites(track._id);
      }
      
      setIsLiked(!isLiked);
      
    } catch (error) {
      // Без обработки ошибок
    }
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
              fill: isLiked ? '#B672FF' : 'transparent',
              stroke: isLiked ? '#B672FF' : '#696969'
            }}
          >
            <use xlinkHref={`/img/icon/sprite.svg#icon-${isLiked ? 'like' : 'dislike'}`}></use>
          </svg>
          <span className={styles.track__timeText}>
            {formatTime(track.duration_in_seconds)}
          </span>
        </div>
      </div>
    </div>
  );
}