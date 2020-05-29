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
          console.log(response);
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
        <h4 className="Fighter-Props">
          {this.state.text}
        </h4>
      )
    }
    return (
      <div className="Fighter-Props">
        <h2>
          {this.state.fighter.name}({this.state.fighter.tier} Tier)
        </h2>
        <h4>{this.state.fighter.totalMatches}</h4>
        <h4>{this.state.fighter.totalWins}</h4>
        <h4>{this.state.fighter.currentStreak}</h4>
        <h4>{this.state.fighter.bestStreak}</h4>
      </div>
    )
  }
}

function App() {
  return (
    <div className="App">
      <div className="App-Header">
        <h1>Salty Prophet</h1>
      </div>
      <div className="App-Body">
        <SaltybetMessage />
        <div className="Fighter-Stats-Zone">
          <FighterData idx={0} />
          <div className="Fighter-Prop-Names">
            <h2>Fighter Stats</h2>
            <h4>Matches Recorded</h4>
            <h4>Wins</h4>
            <h4>Current Streak</h4>
            <h4>Best Streak</h4>
          </div>
          <FighterData idx={1} />
        </div>
      </div>
      <div className="App-Footer">
        &#169; 2020 Nicholas Carpenetti
      </div>
    </div>
  );
}

export default App;
