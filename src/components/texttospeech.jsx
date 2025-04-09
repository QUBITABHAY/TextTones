import React from "react";
import MediaThemeTailwindAudio from "player.style/tailwind-audio/react";

function TextToSpeech() {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen flex items-center justify-center p-6">
      <div className="rounded-3xl p-10 w-full max-w-3xl">
        <h1 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
          Text to Speech Converter
        </h1>
        <textarea
          className="w-full h-80 p-5 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent resize-none mt-4 mb-8 text-gray-700 bg-white/90"
          placeholder="Enter your text here..."
        />
        <div className="flex flex-col items-center gap-6">
          <div className="flex gap-4 flex-wrap justify-center">
            <button className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white px-8 py-3 rounded-xl shadow hover:shadow-lg transition duration-300 font-medium">
              Convert to Speech
            </button>
            <button className="bg-gradient-to-r from-indigo-400 to-blue-500 text-white px-8 py-3 rounded-xl shadow hover:shadow-lg transition duration-300 font-medium">
              Download Audio
            </button>
          </div>
          <MediaThemeTailwindAudio className="w-full max-w-2xl">
            <audio
              slot="media"
              src="https://stream.mux.com/fXNzVtmtWuyz00xnSrJg4OJH6PyNo6D02UzmgeKGkP5YQ/low.mp4"
              playsInline
              crossOrigin="anonymous"
            />
          </MediaThemeTailwindAudio>
        </div>
      </div>
    </div>
  );
}

export default TextToSpeech;
