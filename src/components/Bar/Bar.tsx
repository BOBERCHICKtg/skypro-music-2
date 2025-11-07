"use client";

import Link from "next/link";
import styles from "./bar.module.css";
import classNames from "classnames";
import { useAppDispatch, useAppSelector } from "../store/store";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  setIsPlaying,
  setNextTrack,
  setPrevTrack,
  toggleShuffle,
} from "../store/features/trackSlice";
import ProgressBar from "../ProgressBar/ProgressBar";
import { addToFavorites, removeFromFavorites } from "@/services/tracks/tracksApi";
import { isAuthenticated } from "@/services/auth/authApi";
import { addToFavorites as addToFavoritesRedux, removeFromFavorites as removeFromFavoritesRedux } from "../store/features/favoritesSlice";
import { useRouter } from "next/navigation";

export default function Bar() {
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlaying = useAppSelector((state) => state.tracks.isPlay);
  const isShuffle = useAppSelector((state) => state.tracks.isShuffle);
  const likedTrackIds = useAppSelector((state) => state.favorites.likedTrackIds);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [isLoop, setIsLoop] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isLoadedTrack, setIsLoadedTrack] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLocalPlaying, setIsLocalPlaying] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setIsLoadedTrack(false);
    setCurrentTime(0);
  }, [currentTrack]);

  const handleLikeClick = async () => {
    if (!currentTrack || !isAuthenticated()) {
      alert('Для добавления в избранное необходимо войти в систему');
      router.push('/auth/signin');
      return;
    }
    
    if (isLikeLoading) return;
    
    setIsLikeLoading(true);
    
    try {
      // Используем includes вместо has
      const isLiked = likedTrackIds.includes(currentTrack._id);
      
      if (isLiked) {
        await removeFromFavorites(currentTrack._id);
        dispatch(removeFromFavoritesRedux(currentTrack._id));
      } else {
        await addToFavorites(currentTrack._id);
        dispatch(addToFavoritesRedux(currentTrack));
      }
    } catch (error: any) {
      alert('Ошибка при изменении избранного: ' + error.message);
      console.error('Ошибка при изменении избранного:', error);
    } finally {
      setIsLikeLoading(false);
    }
  };

  // ... остальные функции без изменений

  // Используем includes вместо has
  const isCurrentTrackLiked = currentTrack && likedTrackIds.includes(currentTrack._id);

  return (
    <div className={styles.bar}>
      {/* ... остальная разметка без изменений */}
    </div>
  );
}