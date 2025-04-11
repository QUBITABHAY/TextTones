import React, { useState, useCallback, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import AudioPlayer from "./AudioPlayer";

const polly = new PollyClient({
    region: import.meta.env.VITE_AWS_REGION,
    credentials: {
      accessKeyId: import.meta.env.VITE_AWS_ACESS_KEY,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY
    }
})

function TextToSpeech() {
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [selectedVoice, setSelectedVoice] = useState("");
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  const languages = {
    arb: { name: "Arabic", voices: ["Zeina"] },
    "cmn-CN": { name: "Chinese, Mandarin", voices: ["Zhiyu"] },
    "cy-GB": { name: "Welsh", voices: ["Gwyneth"] },
    "da-DK": { name: "Danish", voices: ["Naja", "Mads"] },
    "de-DE": { name: "German", voices: ["Marlene", "Hans", "Vicki"] },
    "en-AU": { name: "English, Australian", voices: ["Nicole", "Russell"] },
    "en-GB": { name: "English, British", voices: ["Amy", "Emma", "Brian"] },
    "en-GB-WLS": { name: "English, Welsh", voices: ["Geraint"] },
    "en-IN": { name: "English, Indian", voices: ["Aditi", "Raveena"] },
    "en-US": {
      name: "English, US",
      voices: [
        "Joanna",
        "Matthew",
        "Ivy",
        "Kendra",
        "Kimberly",
        "Salli",
        "Joey",
        "Justin"
      ]
    },
    "es-ES": {
      name: "Spanish, Castilian",
      voices: ["Conchita", "Lucia", "Enrique"]
    },
    "es-MX": { name: "Spanish, Mexican", voices: ["Mia"] },
    "es-US": { name: "Spanish, US", voices: ["Penélope", "Miguel", "Lupe"] },
    "fr-CA": { name: "French, Canadian", voices: ["Chantal"] },
    "fr-FR": { name: "French", voices: ["Léa", "Céline", "Mathieu"] },
    "is-IS": { name: "Icelandic", voices: ["Dóra", "Karl"] },
    "it-IT": { name: "Italian", voices: ["Giorgio", "Carla", "Bianca"] },
    "ja-JP": { name: "Japanese", voices: ["Takumi", "Mizuki"] },
    "hi-IN": { name: "Hindi", voices: ["Aditi"] },
    "ko-KR": { name: "Korean", voices: ["Seoyeon"] },
    "nb-NO": { name: "Norwegian", voices: ["Liv"] },
    "nl-NL": { name: "Dutch", voices: ["Lotte", "Ruben"] },
    "pl-PL": { name: "Polish", voices: ["Ewa", "Jacek", "Maja", "Jan"] },
    "pt-BR": {
      name: "Portuguese, Brazilian",
      voices: ["Vitória", "Camila", "Ricardo"]
    },
    "pt-PT": { name: "Portuguese", voices: ["Inês", "Cristiano"] },
    "ro-RO": { name: "Romanian", voices: ["Carmen"] },
    "ru-RU": { name: "Russian", voices: ["Maxim", "Tatyana"] },
    "sv-SE": { name: "Swedish", voices: ["Astrid"] },
    "tr-TR": { name: "Turkish", voices: ["Filiz"] }
  };

  const audioUrlRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, []);

  const handleLanguageChange = useCallback(code => {
    setSelectedLanguage(code);
    setSelectedVoice(languages[code].voices[0]);
    setIsLanguageOpen(false);
  }, []);

  const handleVoiceChange = useCallback(voice => {
    setSelectedVoice(voice);
    setIsVoiceOpen(false);
  }, []);

  const handleTextChange = useCallback(e => {
    setText(e.target.value);
  }, []);

  const handleConvert = useCallback(
    async () => {
      if (!text || !selectedVoice) return;
      setIsLoading(true);

      try {
        const command = new SynthesizeSpeechCommand({
          Text: text,
          OutputFormat: "mp3",
          VoiceId: selectedVoice,
          LanguageCode: selectedLanguage,
          Engine: "standard"
        });

        const response = await polly.send(command);
        const blob = new Blob([response.AudioStream], { type: "audio/mpeg" });
        console.log("Blob", blob)

        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current);
        }

        const url = URL.createObjectURL(blob);
        console.log("Audio URL", url)
        audioUrlRef.current = url;
        setAudioUrl(url);
      } catch (error) {
        console.error("Error converting text:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [text, selectedVoice, selectedLanguage]
  );

  const handleDownload = useCallback(
    () => {
      if (audioUrl) {
        const link = document.createElement("a");
        link.href = audioUrl;
        link.download = `${selectedLanguage}-${selectedVoice}-${Date.now()}.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    [audioUrl, selectedLanguage, selectedVoice]
  );


  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen flex items-center justify-center p-6">
      <div className="rounded-3xl p-10 w-full max-w-3xl">
        <h1 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
          Text to Speech Converter
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-2">
              Language
            </label>
            <div
              className="relative"
              onBlur={() => setTimeout(() => setIsLanguageOpen(false), 200)}
            >
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="w-full px-4 py-2.5 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              >
                <span className="block truncate">
                  {languages[selectedLanguage].name}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                </span>
              </button>
              {isLanguageOpen &&
                <div className="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 rounded-lg py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  {Object.entries(languages)
                    .filter(([, { voices }]) => voices.length > 0)
                    .map(([code, { name }]) =>
                      <button
                        key={code}
                        className={`${code === selectedLanguage
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-900 hover:bg-gray-100"} cursor-pointer select-none relative py-2 pl-3 pr-9 w-full text-left`}
                        onClick={() => handleLanguageChange(code)}
                      >
                        {name}
                      </button>
                    )}
                </div>}
            </div>
          </div>
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-2">
              Voice
            </label>
            <div
              className="relative"
              onBlur={() => setTimeout(() => setIsVoiceOpen(false), 200)}
            >
              <button
                onClick={() => setIsVoiceOpen(!isVoiceOpen)}
                className="w-full px-4 py-2.5 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              >
                <span className="block truncate">
                  {selectedVoice || languages[selectedLanguage].voices[0]}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                </span>
              </button>
              {isVoiceOpen &&
                <div className="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 rounded-lg py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  {languages[selectedLanguage].voices.map(voice =>
                    <button
                      key={voice}
                      className={`${voice === selectedVoice
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-900 hover:bg-gray-100"} cursor-pointer select-none relative py-2 pl-3 pr-9 w-full text-left`}
                      onClick={() => handleVoiceChange(voice)}
                    >
                      {voice}
                    </button>
                  )}
                </div>}
            </div>
          </div>
        </div>
        <textarea
          value={text}
          onChange={handleTextChange}
          className="w-full h-80 p-5 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent resize-none mt-4 mb-8 text-gray-700 bg-white/90"
          placeholder="Enter your text here..."
        />
        <div className="flex flex-col items-center gap-6">
          <div className="flex gap-4 flex-wrap justify-center">
            <button
              onClick={handleConvert}
              disabled={!text || isLoading}
              className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white px-8 py-3 rounded-xl shadow hover:shadow-lg transition duration-300 font-medium disabled:opacity-50"
            >
              {isLoading
                ? <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Converting...
                  </span>
                : "Convert to Speech"}
            </button>
            {audioUrl &&
              <button
                onClick={handleDownload}
                className="bg-gradient-to-r from-indigo-400 to-blue-500 text-white px-8 py-3 rounded-xl shadow hover:shadow-lg transition duration-300 font-medium"
              >
                Download Audio
              </button>}
          </div>

          {audioUrl &&
            <div className="w-full flex justify-center">
              <AudioPlayer src={audioUrl} />
            </div>}
        </div>
      </div>
    </div>
  );
}

export default TextToSpeech;
