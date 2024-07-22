import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to the Quiz App</h1>
      <div className="quiz-links">
        <Link to="/flag-quiz">
          <div className="quiz-link">
            <img src="https://www.vividads.com.au/cdn/shop/products/Australian-flag.jpg?v=1659417130&width=600" alt="Flag Quiz" className="quiz-image" />
            <p>Country Flags of the World</p>
          </div>
        </Link>
        <Link to="/pokemon-quiz">
          <div className="quiz-link">
            <img src="https://img.pokemondb.net/artwork/charmander.jpg" alt="Pokemon Quiz" className="quiz-image" />
            <p>Gen 1 Pokemon </p>
          </div>
        </Link>
        <Link to="/Council-quiz">
          <div className="quiz-link">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-LG_8T_lLZwczb4WqqJ86oyf_ljTCZPTzYQ&s" alt="Councils Quiz" className="quiz-image" />
            <p>Melbourne Councils </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Home;