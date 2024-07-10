import React, { useState, useEffect } from 'react';
import './App.css'; // Assuming you have a CSS file for additional styles

function Quiz() {
  const [flags, setFlags] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isQuizOver, setIsQuizOver] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    fetch('http://localhost:5000/flags')
      .then(response => response.json())
      .then(data => setFlags(data));
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !isQuizOver) {
      const timer = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setIsQuizOver(true);
    }
  }, [timeLeft, isQuizOver]);

  const handleChange = (e, id) => {
    const { value } = e.target;
    setAnswers({
      ...answers,
      [id]: value
    });

    // Check if the answer is correct
    const flag = flags.find(flag => flag.id === id);
    if (flag && value.toLowerCase() === flag.name.toLowerCase()) {
      setScore(score + 1);
    }
  };

  const handleGiveUp = () => {
    setIsQuizOver(true);
  };

  const handleRetryAll = () => {
    setAnswers({});
    setScore(0);
    setTimeLeft(300);
    setIsQuizOver(false);
  };

  const handleRetryIncorrect = () => {
    const incorrectFlags = flags.filter(flag => !answers[flag.id] || answers[flag.id].toLowerCase() !== flag.name.toLowerCase());
    setFlags(incorrectFlags);
    setAnswers({});
    setScore(0);
    setTimeLeft(300);
    setIsQuizOver(false);
  };

  return (
    <div>
      <h1>Flag Quiz</h1>
      <p>Time left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}</p>
      <form>
        {flags.map(flag => (
          <div key={flag.id}>
            <img src={flag.image} alt={flag.name} />
            <input
              type="text"
              value={answers[flag.id] || ''}
              onChange={(e) => handleChange(e, flag.id)}
              disabled={isQuizOver || (answers[flag.id] && answers[flag.id].toLowerCase() === flag.name.toLowerCase())}
              className={answers[flag.id] && answers[flag.id].toLowerCase() === flag.name.toLowerCase() ? 'correct' : ''}
            />
            {isQuizOver && answers[flag.id] && answers[flag.id].toLowerCase() === flag.name.toLowerCase() && (
              <p style={{ color: 'green' }}>{flag.name}</p>
            )}
            {isQuizOver && (!answers[flag.id] || answers[flag.id].toLowerCase() !== flag.name.toLowerCase()) && (
              <p style={{ color: 'red' }}>{flag.name}</p>
            )}
          </div>
        ))}
        <button type="button" onClick={handleGiveUp} disabled={isQuizOver}>Give Up</button>
      </form>
      <p>Score: {score}/{flags.length}</p>
      {isQuizOver && (
        <div>
          <button onClick={handleRetryAll}>Retry All</button>
          <button onClick={handleRetryIncorrect}>Retry Incorrect</button>
        </div>
      )}
      <p>Attempts: {attempts}</p>
    </div>
  );
}

export default Quiz;