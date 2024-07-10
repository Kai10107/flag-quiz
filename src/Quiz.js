import React, { useState, useEffect } from 'react';

function Quiz() {
  const [flags, setFlags] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetch('http://localhost:5000/flags')
      .then(response => response.json())
      .then(data => setFlags(data));
  }, []);

  const handleChange = (e, id) => {
    const { value } = e.target;
    setAnswers({
      ...answers,
      [id]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newScore = 0;
    flags.forEach(flag => {
      if (answers[flag.id] && answers[flag.id].toLowerCase() === flag.name.toLowerCase()) {
        newScore++;
      }
    });
    setScore(newScore);
  };

  return (
    <div>
      <h1>Flag Quiz</h1>
      <form onSubmit={handleSubmit}>
        {flags.map(flag => (
          <div key={flag.id}>
            <img src={flag.image} alt={flag.name} />
            <input
              type="text"
              value={answers[flag.id] || ''}
              onChange={(e) => handleChange(e, flag.id)}
            />
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
      <p>Score: {score}/{flags.length}</p>
    </div>
  );
}

export default Quiz;