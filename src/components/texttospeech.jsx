import React, { useState, useCallback, useRef, useEffect, useMemo, memo } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { useAuth } from "../context/AuthContext";
import { doc, updateDoc, increment, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/db";
import AudioPlayer from "./AudioPlayer";


const DropdownButton = memo(({ label, value, options, isOpen, onToggle, onChange }) => (
  <div className="relative">
    <label className="block text-gray-700 font-medium mb-2">
      {label}
    </label>
    <div
      className="relative"
      onBlur={() => setTimeout(() => onToggle(false), 200)}
    >
      <button
        onClick={() => onToggle(!isOpen)}
        className="w-full px-4 py-2.5 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
      >
        <span className="block truncate">{value}</span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDownIcon className="w-5 h-5 text-gray-400" />
        </span>
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 rounded-lg py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {options.map(option => (
            <button
              key={option.value}
              className={`${option.value === value
                ? "text-blue-600 bg-blue-50"
                : "text-gray-900 hover:bg-gray-100"} cursor-pointer select-none relative py-2 pl-3 pr-9 w-full text-left`}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
));


const MemoizedAudioPlayer = memo(AudioPlayer);

const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const polly = new PollyClient({
    region: import.meta.env.VITE_AWS_REGION,
    credentials: {
      accessKeyId: import.meta.env.VITE_AWS_ACESS_KEY,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY
    }
});

function TextToSpeech() {
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en-IN");
  const [selectedVoice, setSelectedVoice] = useState("Aditi");
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [error, setError] = useState("");
  const [dbError, setDbError] = useState(null);

  const { user } = useAuth();

  const languages = useMemo(() => ({
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
    "es-US": { name: "Spanish, US", voices: ["Penelope", "Miguel", "Lupe"] },
    "fr-CA": { name: "French, Canadian", voices: ["Chantal"] },
    "fr-FR": { name: "French", voices: ["Lea", "Celine", "Mathieu"] },
    "is-IS": { name: "Icelandic", voices: ["Dora", "Karl"] },
    "it-IT": { name: "Italian", voices: ["Giorgio", "Carla", "Bianca"] },
    "ja-JP": { name: "Japanese", voices: ["Takumi", "Mizuki"] },
    "hi-IN": { name: "Hindi", voices: ["Aditi"] },
    "ko-KR": { name: "Korean", voices: ["Seoyeon"] },
    "nb-NO": { name: "Norwegian", voices: ["Liv"] },
    "nl-NL": { name: "Dutch", voices: ["Lotte", "Ruben"] },
    "pl-PL": { name: "Polish", voices: ["Ewa", "Jacek", "Maja", "Jan"] },
    "pt-BR": {
      name: "Portuguese, Brazilian",
      voices: ["Vitoria", "Camila", "Ricardo"]
    },
    "pt-PT": { name: "Portuguese", voices: ["Ines", "Cristiano"] },
    "ro-RO": { name: "Romanian", voices: ["Carmen"] },
    "ru-RU": { name: "Russian", voices: ["Maxim", "Tatyana"] },
    "sv-SE": { name: "Swedish", voices: ["Astrid"] },
    "tr-TR": { name: "Turkish", voices: ["Filiz"] }
  }), []);

  const languageOptions = useMemo(() => 
    Object.entries(languages).map(([code, { name }]) => ({
      value: code,
      label: name
    })).filter(({ value }) => languages[value].voices.length > 0)
  , [languages]);

  const voiceOptions = useMemo(() => 
    languages[selectedLanguage].voices.map(voice => ({
      value: voice,
      label: voice
    }))
  , [selectedLanguage, languages]);

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
  }, [languages]);

  const handleVoiceChange = useCallback(voice => {
    setSelectedVoice(voice);
    setIsVoiceOpen(false);
  }, []);

  const handleTextChange = useCallback(e => {
    setText(e.target.value);
  }, []);

  const estimateAudioDuration = (text) => {
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / 150);
  };

  const updateUserActivity = useCallback(async (text, duration, audioBase64) => {
    if (!user) {
      console.error('No user found when trying to update activity');
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    try {
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0],
          photoURL: user.photoURL || null,
          createdAt: new Date().toISOString(),
          totalConversions: 0,
          totalCharacters: 0,
          totalAudioDuration: 0,
          recentActivity: []
        });
      }
      const currentData = userSnap.exists() ? userSnap.data() : { recentActivity: [] };
      const newActivity = {
        text,
        timestamp: new Date().toISOString(),
        duration,
        voice: selectedVoice,
        language: selectedLanguage,
        audioBase64
      };
      const updatedActivity = [newActivity, ...(currentData.recentActivity || [])].slice(0, 10);

      const updateData = {
        totalConversions: increment(1),
        totalCharacters: increment(text.length),
        totalAudioDuration: increment(duration),
        recentActivity: updatedActivity
      };

      await updateDoc(userRef, updateData);
      setDbError(null);
    } catch (error) {
      console.error('Error updating user activity:', error);
      setDbError('Failed to save your activity. Please try again later.');
      throw error;
    }
  }, [user, selectedVoice, selectedLanguage]);

  const handleConvert = useCallback(
    async () => {
      if (!text || !selectedVoice) return;
      setIsLoading(true);
      setError("");

      try {
        const command = new SynthesizeSpeechCommand({
          Text: text,
          OutputFormat: "mp3",
          VoiceId: selectedVoice,
          LanguageCode: selectedLanguage,
          Engine: "standard"
        });

        const response = await polly.send(command);
        const byteArray = await response.AudioStream.transformToByteArray();
        const blob = new Blob([byteArray], { type: "audio/mpeg" });
        
        // Convert blob to base64
        const audioBase64 = await blobToBase64(blob);

        // Create temporary URL for audio player
        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current);
        }
        const url = URL.createObjectURL(blob);
        audioUrlRef.current = url;
        setAudioUrl(url);

        const estimatedDuration = estimateAudioDuration(text);
        await updateUserActivity(text, estimatedDuration, audioBase64);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message || "An error occurred during conversion or saving data");
        return;
      } finally {
        setIsLoading(false);
      }
    },
    [text, selectedVoice, selectedLanguage, updateUserActivity]
  );

  const handleDownload = useCallback(
    async () => {
      if (!user) return;
      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) return;
        
        const recentActivity = userSnap.data().recentActivity[0];
        if (!recentActivity?.audioBase64) return;

        // Convert base64 back to blob
        const byteCharacters = atob(recentActivity.audioBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "audio/mpeg" });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedLanguage}-${selectedVoice}-${Date.now()}.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading audio:", error);
        setError("Failed to download audio file");
      }
    },
    [user, selectedLanguage, selectedVoice]
  );

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen flex items-center justify-center p-6">
      <div className="rounded-3xl p-10 w-full max-w-3xl">
        {dbError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{dbError}</p>
          </div>
        )}

        <h1 className="text-4xl font-bold text-center mb-10 bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
          Text to Speech Converter
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <DropdownButton
            label="Language"
            value={languages[selectedLanguage].name}
            options={languageOptions}
            isOpen={isLanguageOpen}
            onToggle={setIsLanguageOpen}
            onChange={handleLanguageChange}
          />
          <DropdownButton
            label="Voice"
            value={selectedVoice}
            options={voiceOptions}
            isOpen={isVoiceOpen}
            onToggle={setIsVoiceOpen}
            onChange={handleVoiceChange}
          />
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
              <MemoizedAudioPlayer src={audioUrl} />
            </div>}
          {error && <div className="text-red-500 text-center mt-4">{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default TextToSpeech;
