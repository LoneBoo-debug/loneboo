
import React, { useState, useEffect, useRef } from 'react';
import { AppView } from '../types';

const BG_INITIAL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/firsstephmepageinit.webp';
const BTN_STONE = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/feddre33.webp';
const ANIMATION_VIDEO = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/newanimboohpge.mp4';
const BG_MUSIC_URL = 'https://loneboo-images.s3.eu-south-1.amazonaws.com/boosplashscreenintrowelcone55ezxx22.mp3';

const HomePage: React.FC<{ setView: (v: AppView) => void }> = ({ setView }) => {
  const [showButton, setShowButton] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Initialize Audio
    if (!audioRef.current) {
      audioRef.current = new Audio(BG_MUSIC_URL);
      audioRef.current.loop = false;
      audioRef.current.volume = 0.6;
      audioRef.current.onended = () => {
        setIsAnimating(false);
      };
    }

    // Show button after 2 seconds
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 2000);

    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null;
      }
    };
  }, []);

  const toggleInteraction = () => {
    const nextState = !isAnimating;

    if (nextState) {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
      audioRef.current?.play().catch(() => {});
      localStorage.setItem('loneboo_music_enabled', 'true');
    } else {
      audioRef.current?.pause();
      if (audioRef.current) audioRef.current.currentTime = 0;
      if (videoRef.current) videoRef.current.pause();
      localStorage.setItem('loneboo_music_enabled', 'false');
    }

    setIsAnimating(nextState);
    window.dispatchEvent(new Event('loneboo_audio_changed'));
  };

  return (
    <div className="fixed inset-0 z-0 bg-black overflow-hidden flex flex-col items-center justify-center select-none">
      
      {/* Background Image */}
      {!isAnimating && (
        <img
          src={BG_INITIAL}
          alt="Initial Background"
          className="absolute inset-0 w-full h-full object-cover md:object-fill"
        />
      )}

      {/* Video Background */}
      {isAnimating && (
        <video
          ref={videoRef}
          src={ANIMATION_VIDEO}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover md:object-fill"
        />
      )}

      {/* Stone Button */}
      {showButton && (
        <button
          onClick={toggleInteraction}
          className="absolute top-[20%] right-[5%] z-50 outline-none cursor-pointer"
        >
          <img
            src={BTN_STONE}
            alt="Stone Button"
            className="w-24 md:w-40 h-auto drop-shadow-2xl"
          />
        </button>
      )}

      {/* Enter Overlay Area */}
      <div
        className="absolute z-30"
        style={{
          top: "75%",
          left: "50%",
          width: "50%",
          height: "15%",
          transform: "translate(-50%, -50%)"
        }}
      >
        <button
          onClick={() => setView(AppView.BOO_GARDEN)}
          className="w-full h-full bg-transparent border-none outline-none cursor-pointer"
        />
      </div>

    </div>
  );
};

export default HomePage;
