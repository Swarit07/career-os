"use client";

import { useRef, useEffect } from "react";
import Hls from "hls.js";

interface HlsVideoBgProps {
  src: string;
  fallbackSrc?: string;
  className?: string;
}

export function HlsVideoBg({ src, fallbackSrc, className = "" }: HlsVideoBgProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (src.endsWith(".m3u8") && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        maxBufferLength: 30,
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
      return () => {
        hls.destroy();
      };
    }

    const actualSrc = fallbackSrc || src;
    video.src = actualSrc;
    video.play().catch(() => {});
  }, [src, fallbackSrc]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="h-full w-full object-cover opacity-[0.15] saturate-[0.3] contrast-[0.8]"
      />
      <div className="video-fade-overlay" />
    </div>
  );
}
