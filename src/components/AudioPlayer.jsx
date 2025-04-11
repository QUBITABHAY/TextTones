import React from "react";
import MediaThemeTailwindAudio from "player.style/tailwind-audio/react";

function AudioPlayer({ src }) {
  return (
    <div className="audio-player">
      <MediaThemeTailwindAudio>
        <audio slot="media" src={src} playsInline crossOrigin="anonymous" />
      </MediaThemeTailwindAudio>
    </div>
  );
}

export default AudioPlayer;
