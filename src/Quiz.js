import React, { useState, useEffect } from 'react';

function Quiz() {
  const [flags, setFlags] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isQuizOver, setIsQuizOver] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/flags')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setFlags(data);
      })
      .catch(error => {
        console.error('Failed to fetch flags:', error);
      });
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !isQuizOver) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setIsQuizOver(true);
    }
  }, [timeLeft, isQuizOver]);

  const handleAnswerChange = (e) => {
    const { value } = e.target;
    setCurrentAnswer(value);

    // Check if the answer matches any flag
    const flag = flags.find(flag => flag.name.toLowerCase() === value.toLowerCase());
    if (flag) {
      setAnswers(prevAnswers => ({
        ...prevAnswers,
        [flag.id]: flag.name
      }));
      setScore(prevScore => prevScore + 1);
      setCurrentAnswer('');
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
    setAttempts(prevAttempts => prevAttempts + 1);
  };

  const handleRetryIncorrect = () => {
    const incorrectFlags = flags.filter(flag => !answers[flag.id] || answers[flag.id].toLowerCase() !== flag.name.toLowerCase());
    setFlags(incorrectFlags);
    setAnswers({});
    setScore(0);
    setTimeLeft(300);
    setIsQuizOver(false);
    setAttempts(prevAttempts => prevAttempts + 1);
  };

  const renderTableRows = () => {
    const rows = [];
    for (let i = 0; i < flags.length; i += 10) { // Change to 10 flags per row
      const rowFlags = flags.slice(i, i + 10);
      rows.push(
        <tr key={i}>
          {rowFlags.map(flag => (
            <td key={flag.id} style={{ textAlign: 'center', padding: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src={flag.image} alt={flag.name} style={{ maxWidth: '145px', maxHeight: '76px', border: '1px solid black' }} />
                <input
                  type="text"
                  value={isQuizOver && (!answers[flag.id] || answers[flag.id].toLowerCase() !== flag.name.toLowerCase()) ? flag.name : (answers[flag.id] || '')}
                  readOnly={!!answers[flag.id] || isQuizOver}
                  style={{
                    width: '140px',
                    height: '35px',
                    marginTop: '5px',
                    color: isQuizOver && (!answers[flag.id] || answers[flag.id].toLowerCase() !== flag.name.toLowerCase()) ? 'red' : (answers[flag.id] ? 'green' : 'black'),
                    textAlign: 'center'
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
      <h1>Flag Quiz</h1>
      <p>Time left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}</p>
      <input
        type="text"
        value={currentAnswer}
        onChange={handleAnswerChange}
        placeholder="Type your answer here"
        style={{ width: '300px', height: '35px', marginBottom: '20px' }}
        disabled={isQuizOver}
      />
      <form>
        <table>
          <tbody>
            {renderTableRows()}
          </tbody>
        </table>
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