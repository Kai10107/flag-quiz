import React, { useState, useEffect } from 'react';

function CouncilQuiz() {
  const [councils, setCouncils] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(900);
  const [isQuizOver, setIsQuizOver] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [currentCouncilId, setCurrentCouncilId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/councils')
      .then(response => response.json())
      .then(data => {
        setCouncils(data);
        if (data.length > 0) {
          setCurrentCouncilId(data[0].id);
        }
      });
  }, []);

  useEffect(() => {
    if (isQuizStarted && timeLeft > 0 && !isQuizOver) {
      const timer = setInterval(() => setTimeLeft(prevTime => prevTime - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setIsQuizOver(true);
    }
  }, [timeLeft, isQuizOver, isQuizStarted]);

  const handleAnswerChange = (e) => {
    const { value } = e.target;
    setCurrentAnswer(value);

    if (currentCouncilId !== null) {
      const council = councils.find(c => c.id === currentCouncilId && c.name.toLowerCase() === value.toLowerCase());
      if (council) {
        setAnswers(prevAnswers => ({ ...prevAnswers, [council.id]: council.name }));
        setScore(prevScore => prevScore + 1);
        setCurrentAnswer('');
        setCurrentCouncilId(null);

        const currentCouncilIndex = councils.findIndex(c => c.id === currentCouncilId);
        if (currentCouncilIndex < councils.length - 1) {
          setCurrentCouncilId(councils[currentCouncilIndex + 1].id);
        } else {
          setCurrentCouncilId(null);
        }
      }
    }
  };

  const handleGiveUp = () => setIsQuizOver(true);

  const handleRetryAll = () => {
    setAnswers({});
    setScore(0);
    setTimeLeft(900);
    setIsQuizOver(false);
    setAttempts(prevAttempts => prevAttempts + 1);
    setIsQuizStarted(false);
  };

  const handleRetryIncorrect = () => {
    const incorrectCouncils = councils.filter(c => !answers[c.id] || answers[c.id].toLowerCase() !== c.name.toLowerCase());
    setCouncils(incorrectCouncils);
    setAnswers({});
    setScore(0);
    setTimeLeft(900);
    setIsQuizOver(false);
    setAttempts(prevAttempts => prevAttempts + 1);
    setIsQuizStarted(false);
  };

  const handleStartQuiz = () => setIsQuizStarted(true);

  const renderTableRows = () => {
    const rows = [];
    for (let i = 0; i < councils.length; i += 8) {
      const rowCouncils = councils.slice(i, i + 8);
      rows.push(
        <tr key={i}>
          {rowCouncils.map(c => (
            <td key={c.id} style={{ textAlign: 'center', padding: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src={c.image} alt={c.name} style={{ maxWidth: '145px', maxHeight: '76px', border: '1px solid black' }} />
                <input
                  type="text"
                  value={isQuizOver && (!answers[c.id] || answers[c.id].toLowerCase() !== c.name.toLowerCase()) ? c.name : (answers[c.id] || '')}
                  readOnly={!!answers[c.id] || isQuizOver || !isQuizStarted || currentCouncilId !== c.id}
                  style={{
                    width: '130px',
                    height: '10px',
                    marginTop: '5px',
                    textAlign: 'center',
                    backgroundColor: currentCouncilId === c.id ? 'yellow' : 'white'
                  }}
                  onClick={() => setCurrentCouncilId(c.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Tab') {
                      e.preventDefault();
                      const currentCouncilIndex = councils.findIndex(c => c.id === currentCouncilId);
                      if (currentCouncilIndex < councils.length - 1) {
                        setCurrentCouncilId(councils[currentCouncilIndex + 1].id);
                      } else {
                        setCurrentCouncilId(councils[0].id);
                      }
                    }
                  }}
                />
              </div>
            </td>
          ))}
        </tr>
      );
    }
    return rows;
  };

  return (
    <div>
      <h1>Melbourne Metropolitan Area Council Logos</h1>
      <p>Can you name all the council logos? You can keep retrying until you name them all!</p>
      {!isQuizStarted && (
        <button
          onClick={handleStartQuiz}
          style={{
            backgroundColor: 'green',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            cursor: 'pointer',
            fontSize: '1.5rem',
            marginBottom: '20px'
          }}
        >
          Start Quiz
        </button>
      )}
      {isQuizStarted && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: 'white', padding: '10px', zIndex: 1000 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <p>Score: {score}/{councils.length}</p>
              <p>Attempts: {attempts}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <p style={{ fontSize: '2rem', color: 'green', margin: '0 10px' }}>
                {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}
              </p>
              <button
                type="button"
                onClick={handleGiveUp}
                disabled={isQuizOver}
                style={{
                  backgroundColor: 'red',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Give Up
              </button>
            </div>
          </div>
          <input
            type="text"
            value={currentAnswer}
            onChange={handleAnswerChange}
            placeholder="Type your answer here"
            style={{ width: '300px', height: '35px', marginBottom: '20px' }}
            disabled={isQuizOver}
          />
        </div>
      )}
      <form>
        <table>
          <tbody>
            {renderTableRows()}
          </tbody>
        </table>
      </form>
      {isQuizOver && (
        <div>
          <button onClick={handleRetryAll}>Retry All</button>
          <button onClick={handleRetryIncorrect}>Retry Incorrect</button>
        </div>
      )}
    </div>
  );
}

export default CouncilQuiz;