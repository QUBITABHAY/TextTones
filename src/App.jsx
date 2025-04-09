import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/landing";
import Home from "./components/home";
import Navbar from "./components/navbar";
import "./App.css";
import TextToSpeech from "./components/texttospeech";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/tts" element={<TextToSpeech />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
