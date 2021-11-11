import React from 'react';
import API from '../api';

class ModePhaseDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'Unknown',
      phase: 'Unknown',
    }
  }

  componentDidMount() {
    this.updateModePhase();
    setInterval(
      () => this.updateModePhase(), 
      100
    );
  }

  updateModePhase() {
    const currentMode = API.getMode();
    const currentPhase = API.getPhase();
    if(currentMode) {
      this.setState({
        mode: API.getMode(),
      });
    }
    if(currentPhase) {
      this.setState({
        phase: API.getPhase(),
      });
    }
  }

  render() {
    return (
      <h4 className="Mode-Phase-Display">
        MODE: {this.state.mode.toUpperCase()}, {this.state.phase.toUpperCase()}
      </h4>
    );
  }
}

export default ModePhaseDisplay;