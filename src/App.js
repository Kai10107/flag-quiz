import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Quiz from './Quiz';
import Results from './Results';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/quiz" component={Quiz} />
          <Route path="/results" component={Results} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;