import React, { useState, useEffect } from 'react';

function Quiz() {
  const [flags, setFlags] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(900);
  const [isQuizOver, setIsQuizOver] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [currentFlagId, setCurrentFlagId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/flags')
      .then(response => response.json())
      .then(data => {
        setFlags(data);
        if (data.length > 0) {
          setCurrentFlagId(data[0].id);
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

  const isAnswerCorrect = (userAnswer, correctAnswers) => {
    return correctAnswers.some(answer => userAnswer.toLowerCase() === answer.toLowerCase());
  };

  const handleAnswerChange = (e) => {
    const { value } = e.target;
    setCurrentAnswer(value);

    if (currentFlagId !== null) {
      const flag = flags.find(flag => flag.id === currentFlagId);
      if (flag) {
        const correctAnswers = [flag.name, ...(flag.alternativeAnswers || [])];
        if (isAnswerCorrect(value, correctAnswers)) {
          setAnswers(prevAnswers => ({ ...prevAnswers, [flag.id]: flag.name }));
          setScore(prevScore => prevScore + 1);
          setCurrentAnswer('');

          const currentFlagIndex = flags.findIndex(flag => flag.id === currentFlagId);
          if (currentFlagIndex < flags.length - 1) {
            setCurrentFlagId(flags[currentFlagIndex + 1].id);
          } else {
            setCurrentFlagId(null);
          }
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
    setIsQuizStarted(false);
  };

  const handleRetryIncorrect = () => {
    const incorrectFlags = flags.filter(flag => !answers[flag.id] || !isAnswerCorrect(answers[flag.id], [flag.name, ...(flag.alternativeAnswers || [])]));
    setFlags(incorrectFlags);
    setAnswers({});
    setScore(0);
    setTimeLeft(900);
    setIsQuizOver(false);
    setIsQuizStarted(false);
  };

  const handleStartQuiz = () => setIsQuizStarted(true);

  const renderTableRows = () => {
    return flags.map((flag, index) => (
      <tr key={index}>
        <td style={{ textAlign: 'center', padding: '10px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={flag.image} alt={flag.name} style={{ maxWidth: '145px', maxHeight: '76px', border: '1px solid black' }} />
            <input
              type="text"
              value={isQuizOver && (!answers[flag.id] || !isAnswerCorrect(answers[flag.id], [flag.name, ...(flag.alternativeAnswers || [])])) ? flag.name : (answers[flag.id] || '')}
              readOnly={!!answers[flag.id] || isQuizOver || !isQuizStarted || currentFlagId !== flag.id}
              style={{
                width: '130px',
                height: '10px',
                marginTop: '5px',
                textAlign: 'center',
                backgroundColor: currentFlagId === flag.id ? 'yellow' : 'white'
              }}
              onClick={() => setCurrentFlagId(flag.id)}
              onKeyDown={(e) => {
                if (e.key === 'Tab') {
                  e.preventDefault();
                  const currentFlagIndex = flags.findIndex(flag => flag.id === currentFlagId);
                  if (currentFlagIndex < flags.length - 1) {
                    setCurrentFlagId(flags[currentFlagIndex + 1].id);
                  } else {
                    setCurrentFlagId(flags[0].id);
                  }
                }
              }}
            />
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <div>
      <h1>All Country Flags of the World</h1>
      <p>Can you name all the flags? You can keep retrying until you name them all!</p>
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
              <p>Score: {score}/{flags.length}</p>
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

export default Quiz;