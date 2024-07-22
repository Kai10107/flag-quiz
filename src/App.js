import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Quiz from './FlagQuiz';
import Results from './Results';
import './App.css';
import PokemonQuiz from './PokemonQuiz';
import CouncilQuiz from './CouncilQuiz'; 

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flag-quiz" element={<Quiz />} />
          <Route path="/results" element={<Results />} />
          <Route path="/pokemon-quiz" element={<PokemonQuiz />} />
          <Route path="/council-quiz" element={<CouncilQuiz />}  />
        </Routes>
      </div>
    </Router>
  );
}

export default App;