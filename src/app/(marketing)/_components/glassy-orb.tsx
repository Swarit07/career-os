"use client";

export function GlassyOrb() {
  return (
    <div className="hidden items-center justify-center lg:flex">
      <div
        className="relative aspect-square w-full max-w-[700px] overflow-hidden rounded-full"
        style={{ background: "#000" }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full scale-125 object-cover mix-blend-screen"
          style={{
            filter:
              "hue-rotate(-55deg) saturate(250%) brightness(1.2) contrast(1.1)",
          }}
        >
          <source
            src="https://future.co/images/homepage/glassy-orb/orb-purple.webm"
            type="video/webm"
          />
        </video>
      </div>
    </div>
  );
}
