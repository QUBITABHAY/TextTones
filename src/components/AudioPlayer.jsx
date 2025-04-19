import React from "react";
import MediaThemeTailwindAudio from "player.style/tailwind-audio/react";

function AudioPlayer({ src }) {
  return (
    <div className="audio-player w-full max-w-md mx-auto p-4">
      <MediaThemeTailwindAudio>
        <audio
          slot="media"
          src={src}
          playsInline
          crossOrigin="anonymous"
          controls
        />
      </MediaThemeTailwindAudio>
    </div>
  );
}

export default AudioPlayer;
