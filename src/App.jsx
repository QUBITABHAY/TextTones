import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import "./App.css";
import TextToSpeech from "./components/texttospeech";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tts" element={<TextToSpeech />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
