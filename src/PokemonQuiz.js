import React, { useState, useEffect } from 'react';

function PokemonQuiz() {
  const [pokemon, setPokemon] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(900);
  const [isQuizOver, setIsQuizOver] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [currentPokemonId, setCurrentPokemonId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/pokemon')
      .then(response => response.json())
      .then(data => {
        setPokemon(data);
        if (data.length > 0) {
          setCurrentPokemonId(data[0].id);
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

    if (currentPokemonId !== null) {
      const poke = pokemon.find(p => p.id === currentPokemonId && p.name.toLowerCase() === value.toLowerCase());
      if (poke) {
        setAnswers(prevAnswers => ({ ...prevAnswers, [poke.id]: poke.name }));
        setScore(prevScore => prevScore + 1);
        setCurrentAnswer('');
        setCurrentPokemonId(null);

        const currentPokemonIndex = pokemon.findIndex(p => p.id === currentPokemonId);
        if (currentPokemonIndex < pokemon.length - 1) {
          setCurrentPokemonId(pokemon[currentPokemonIndex + 1].id);
        } else {
          setCurrentPokemonId(null);
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
    const incorrectPokemon = pokemon.filter(p => !answers[p.id] || answers[p.id].toLowerCase() !== p.name.toLowerCase());
    setPokemon(incorrectPokemon);
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
    for (let i = 0; i < pokemon.length; i += 8) {
      const rowPokemon = pokemon.slice(i, i + 8);
      rows.push(
        <tr key={i}>
          {rowPokemon.map(p => (
            <td key={p.id} style={{ textAlign: 'center', padding: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src={p.image} alt={p.name} style={{ maxWidth: '145px', maxHeight: '76px', border: '1px solid black' }} />
                <input
                  type="text"
                  value={isQuizOver && (!answers[p.id] || answers[p.id].toLowerCase() !== p.name.toLowerCase()) ? p.name : (answers[p.id] || '')}
                  readOnly={!!answers[p.id] || isQuizOver || !isQuizStarted || currentPokemonId !== p.id}
                  style={{
                    width: '130px',
                    height: '10px',
                    marginTop: '5px',
                    textAlign: 'center',
                    backgroundColor: currentPokemonId === p.id ? 'yellow' : 'white'
                  }}
                  onClick={() => setCurrentPokemonId(p.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Tab') {
                      e.preventDefault();
                      const currentPokemonIndex = pokemon.findIndex(p => p.id === currentPokemonId);
                      if (currentPokemonIndex < pokemon.length - 1) {
                        setCurrentPokemonId(pokemon[currentPokemonIndex + 1].id);
                      } else {
                        setCurrentPokemonId(pokemon[0].id);
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
      <h1>Gen 1 Pokémon Quiz</h1>
      <p>Can you name all the Gen 1 Pokémon? You can keep retrying until you name them all!</p>
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
              <p>Score: {score}/{pokemon.length}</p>
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

export default PokemonQuiz;