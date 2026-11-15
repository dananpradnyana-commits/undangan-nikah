'use client';

import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { MusicNoteIcon, StopCircleIcon } from './icons';

export interface AudioPlayerHandle {
  playFromUserGesture: () => void;
}

interface FloatingAudioPlayerProps {
  audioSrc: string;
  visible: boolean;
  ref?: React.Ref<AudioPlayerHandle>;
}

export function FloatingAudioPlayer({ audioSrc, visible, ref }: FloatingAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const userPausedRef = useRef(false);

  const playFromUserGesture = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    userPausedRef.current = false;
    el.play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      playFromUserGesture,
    }),
    [playFromUserGesture]
  );

  useEffect(() => {
    const handleVisibility = () => {
      const el = audioRef.current;
      if (!el) return;
      if (document.hidden) {
        if (!el.paused) {
          el.pause();
          setIsPlaying(false);
        }
      } else if (visible && !userPausedRef.current) {
        el.play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [visible]);

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el) return;

    if (isPlaying) {
      userPausedRef.current = true;
      el.pause();
      setIsPlaying(false);
    } else {
      userPausedRef.current = false;
      el.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  return (
    <>
      <audio ref={audioRef} src={audioSrc} loop preload="auto" />
      {visible && (
        <div
          id="audio-container"
          className="fixed bottom-[12px] right-[12px] md:right-auto md:left-1/2 md:-translate-x-1/2 z-[1500]"
        >
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Hentikan musik latar' : 'Putar musik latar'}
            title={isPlaying ? 'Matikan Musik' : 'Putar Musik'}
            className="w-[44px] h-[44px] rounded-full border-[3px] border-[#987527] text-[#987527] bg-black/20 backdrop-blur-[2px] hover:bg-[#987527]/15 flex items-center justify-center cursor-pointer transition-transform active:scale-95"
          >
            {isPlaying ? (
              <StopCircleIcon className="w-[20px] h-[20px]" />
            ) : (
              <MusicNoteIcon className="w-[18px] h-[18px]" />
            )}
          </button>
        </div>
      )}
    </>
  );
}
