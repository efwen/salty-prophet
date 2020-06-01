import React from 'react';
import './App.css';
import FighterComparison from './Components/FighterComparison';
import SaltybetMessage from './Components/SaltybetMessage';

function App() {
  return (
    <div className="App">
      <div className="App-Header">
        <img src="logo512.png" alt="salt" className="Header-Salt-Icon"/>
        <h1 className="App-Title">Salty Prophet</h1>
        <img src="logo512.png" alt="salt" className="Header-Salt-Icon"/>
      </div>
      <div className="App-Body">
        <FighterComparison />
        <SaltybetMessage />
      </div>
      <div className="App-Footer">
        &#169; 2020 Nicholas Carpenetti
        <br/>
        Salt icon made by <a href="http://www.freepik.com/" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
      </div>
    </div>
  );
}

export default App;
