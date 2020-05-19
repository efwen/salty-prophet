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

  componentDidMount() {
    const updateMessage = () => {
      getLastMessage().then((response) => {
        this.setState({value: response.message});
      }).catch((error) => {
        console.error(error);
      });
    }

    updateMessage();
    setInterval(updateMessage, 5000);
  }

  render() {
    return (
      <p className="LatestMessage">
        "{this.state.value}"
      </p>
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
