import React from 'react';
import './App.css';
import { getLastMessage, getFighter } from './api';

class FetchButton extends React.Component {
  constructor(props) {    
    super(props);    
    this.state = {
      text: 'Click to update',    
      fetchFunc: null,
    };
  }
  
  handleClick(fetchFunc) {
     fetchFunc().then((response) => {
       this.setState({text: response.message});
     }).catch((error) => {
       console.error(error);
     });
    }

  render() {
    return (
      <button className="LatestMessage" onClick={() => this.handleClick(this.state.fetchFunc)}>
        {this.state.text}
      </button>
    )
  }
}

class MessageFetchButton extends FetchButton {
  constructor(props) {
    super(props);
    this.state = {
      text: 'Click to get last message',
      fetchFunc: getLastMessage,
    }
  }
}

class FighterFetchButton extends FetchButton {
  constructor(props) {
    super(props);
    this.state = {
      text: 'Click to get fighter id = 1',
      fetchFunc: getFighter,
    }
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <MessageFetchButton />
        <FighterFetchButton />
      </header>
    </div>
  );
}

export default App;
