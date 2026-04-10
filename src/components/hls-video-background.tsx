"use client";

import { useEffect, useRef } from "react";

interface HlsVideoBackgroundProps {
  src?: string;
}

export function HlsVideoBackground({ src }: HlsVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!src || !videoRef.current) return;

    const video = videoRef.current;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      return;
    }

    let hlsInstance: { loadSource: (s: string) => void; attachMedia: (v: HTMLVideoElement) => void; destroy: () => void } | null = null;

    import("hls.js").then(({ default: Hls }) => {
      if (!Hls.isSupported() || !videoRef.current) return;
      hlsInstance = new Hls({ autoStartLoad: true, startLevel: -1 });
      hlsInstance.loadSource(src);
      hlsInstance.attachMedia(videoRef.current);
    });

    return () => {
      hlsInstance?.destroy();
    };
  }, [src]);

  if (!src) return null;

  return (
    <div className="video-fade-overlay pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover opacity-30"
      />
    </div>
  );
}
