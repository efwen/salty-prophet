import React from 'react';
import './App.css';
import { getLastMessage, getFighter } from './api';


class SaltybetMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: 'Wait for message from saltybet',
    }
  }


  componentDidMount() {
    const updateMessage = () => {
        getLastMessage()
             .then((response) => {
               this.setState({
                 message: response.message,
               });
             })
             .catch((err) => {
               console.error(err);
             });
    }

    updateMessage();
    setInterval(updateMessage, 5000);
   }

  render() {
    return (
      <h4 className="Saltybet-Message">
        "{this.state.message}"
      </h4>
    );
  }
}
class FighterData extends React.Component {
  constructor(props) {    
    super(props);    
    this.state = {
      text: 'Waiting for data...',    
      fighter: null,
    };
  }
  
  componentDidMount() {
   const updateFighter = () => {
     getFighter()
        .then((response) => {
          this.setState({
            fighter: response[this.props.idx],
          });
        })
        .catch((err) => {
          console.error(err);
        });
   }

   updateFighter();
   setInterval(updateFighter, 5000);
  }

  render() {

    if(!this.state.fighter) {
      return (
        <div className="Fighter-Props">
          <h2 className="Fighter-Name">
            {this.state.text}
          </h2>
          <h4>--</h4>
          <h4>--</h4>
          <h4>--</h4>
          <h4>--</h4>
          <h4>--</h4>
        </div>
      )
    }

    let fighter = this.state.fighter;
    let winRate = fighter.totalMatches === 0 ? 0 : fighter.totalWins / fighter.totalMatches * 100;
    return (
      <div className="Fighter-Props">
        <h2 className="Fighter-Name">
          {fighter.name}
        </h2>
        <h4>{fighter.tier}</h4>
        <h4>{fighter.totalMatches}</h4>
        <h4>{fighter.totalWins}({winRate}%)</h4>
        <h4>{fighter.currentStreak}</h4>
        <h4>{fighter.bestStreak}</h4>
      </div>
    )
  }
}

function App() {
  return (
    <div className="App">
      <div className="App-Header">
        <img src="logo512.png" alt="salt" className="Title-Salt"/>
        <h1 className="App-Title">Salty Prophet</h1>
        <img src="logo512.png" alt="salt" className="Title-Salt"/>
      </div>
      <div className="App-Body">
        <div className="Fighter-Stats-Zone">
          <FighterData idx={0} />
          <div className="Fighter-Prop-Names">
            <h2>VS</h2>
            <h4>Tier</h4>
            <h4>Matches Recorded</h4>
            <h4>Wins(Winrate)</h4>
            <h4>Current Streak</h4>
            <h4>Best Streak</h4>
          </div>
          <FighterData idx={1} />
        </div>
        <SaltybetMessage />
      </div>
      <div className="App-Footer">
        &#169; 2020 Nicholas Carpenetti
        <div>
          Icons made by <a href="http://www.freepik.com/" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
        </div>
      </div>
    </div>
  );
}

export default App;
