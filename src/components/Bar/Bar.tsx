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

export default function Bar() {
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlaying = useAppSelector((state) => state.tracks.isPlay);
  const isShuffle = useAppSelector((state) => state.tracks.isShuffle); // Получаем состояние перемешивания из store
  const dispatch = useAppDispatch();

  const [isLoop, setIsLoop] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isLoadedTrack, setIsLoadedTrack] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLocalPlaying, setIsLocalPlaying] = useState(false);

  useEffect(() => {
    setIsLoadedTrack(false);
  }, [currentTrack]);

  if (!currentTrack) return null;

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isLocalPlaying) {
        audioRef.current.pause();
        dispatch(setIsPlaying(false));
      } else {
        audioRef.current.play();
        dispatch(setIsPlaying(true));
      }
      setIsLocalPlaying(!isLocalPlaying);
    }
  };

  const onToggleLoop = () => {
    setIsLoop(!isLoop);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      console.log(audioRef.current.volume);
    }
  };

  const onLoadMetadata = () => {
    console.log("Start");
    if (audioRef.current) {
      audioRef.current?.play();
      dispatch(setIsPlaying(true));
      setIsLoadedTrack(true);
    }
  };

  /* 1 */

  const onChangeProgress = (e: ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const inputTime = Number(e.target.value);
      audioRef.current.currentTime = inputTime;
    }
  };

  const onNextTrack = () => {
    dispatch(setNextTrack());
  };

  const onPrevTrack = () => {
    dispatch(setPrevTrack());
  };

  const onToggleShuffle = () => {
    dispatch(toggleShuffle());
  };

  const handleNotImplemented = () => {
    alert("Еще не реализовано");
  };

  return (
    <div className={styles.bar}>
      {currentTrack && currentTrack.track_file && (
        <audio
          ref={audioRef}
          src={currentTrack.track_file}
          onEnded={() => {
            setIsLocalPlaying(false);
            dispatch(setIsPlaying(false));
          }}
          loop={true}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadMetadata}
          onEnded={() => console.log("next track")}
        />
      )}

      <ProgressBar
        max={audioRef.current?.duration || 0}
        step={0.1}
        readOnly={!isLoadedTrack}
        value={11}
        onChange={onChangeProgress}
      />

      <div className={styles.bar__content}>
        <div className={styles.bar__playerBlock}>
          <div className={styles.bar__player}>
            <div className={styles.player__controls}>
              <div className={styles.player__btnPrev} onClick={onPrevTrack}>
                <svg className={styles.player__btnPrevSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-prev"></use>
                </svg>
              </div>

              <div
                className={classNames(styles.player__btnPlay, styles.btn)}
                onClick={togglePlayPause}
              >
                <svg className={styles.player__btnPlaySvg}>
                  <use
                    xlinkHref={
                      isLocalPlaying
                        ? "/img/icon/sprite.svg#icon-pause"
                        : "/img/icon/sprite.svg#icon-play"
                    }
                  />
                </svg>
              </div>

              <div className={styles.player__btnNext} onClick={onNextTrack}>
                <svg className={styles.player__btnNextSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-next"></use>
                </svg>
              </div>

              <div
                className={classNames(styles.player__btnRepeat, styles.btnIcon)}
                onClick={onToggleLoop}
              >
                <svg className={styles.player__btnRepeatSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-repeat"></use>
                </svg>
              </div>

              <div
                className={classNames(
                  styles.player__btnShuffle,
                  styles.btnIcon,
                  {
                    [styles.player__btnShuffleActive]: isShuffle, // Добавляем класс для активного состояния
                  }
                )}
                onClick={onToggleShuffle}
              >
                <svg className={styles.player__btnShuffleSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-shuffle"></use>
                </svg>
              </div>
            </div>

            <div className={styles.player__trackPlay}>
              <div className={styles.trackPlay__contain}>
                <div className={styles.trackPlay__image}>
                  <svg className={styles.trackPlay__svg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
                  </svg>
                </div>
                <div className={styles.trackPlay__author}>
                  <Link className={styles.trackPlay__authorLink} href="">
                    {currentTrack.author}
                  </Link>
                </div>
                <div className={styles.trackPlay__album}>
                  <Link className={styles.trackPlay__albumLink} href="">
                    {currentTrack.album}
                  </Link>
                </div>
              </div>

              <div className={styles.trackPlay__likeDislike}>
                <div
                  className={styles.trackPlay__like}
                  onClick={handleNotImplemented}
                >
                  <svg className={styles.trackPlay__likeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                  </svg>
                </div>
                <div
                  className={styles.trackPlay__dislike}
                  onClick={handleNotImplemented}
                >
                  <svg className={styles.trackPlay__dislikeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-dislike"></use>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.bar__volumeBlock}>
            <div className={styles.volume__content}>
              <div className={styles.volume__image}>
                <svg className={styles.volume__svg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-volume"></use>
                </svg>
              </div>
              <div className={classNames(styles.volume__progress, styles.btn)}>
                <input
                  className={classNames(
                    styles.volume__progressLine,
                    styles.btn
                  )}
                  type="range"
                  name="range"
                  onChange={(e) => {
                    setVolume(Number(e.target.value));
                    if (audioRef.current) {
                      audioRef.current.volume = Number(e.target.value) / 100;
                    }
                    console.log(Number(e.target.value));
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}