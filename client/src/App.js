import React from 'react';
import './App.css';
import { getLastMessage } from './api';

class LatestMessage extends React.Component {
  constructor(props) {    
    super(props);    
    this.state = {      
      value: null,    
    };
  }

  handleClick() {
     getLastMessage().then((response) => {
       this.setState({value: response.message});
     }).catch((error) => {
       console.error(error);
     });
  }


  render() {
    return (
      <button className="LatestMessage" onClick={() => this.handleClick()}>
        "{this.state.value}"
      </button>
    )
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <LatestMessage />
      </header>
    </div>
  );
}

export default App;
