import React from 'react';
import API from '../API';

class FighterComparisonHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redName: null,
      blueName: null,
    };
  }

  componentDidMount() {
    setInterval(
      () => this.updateNames(),
      1000
    );
  }

  updateNames() {
    const fighterData = API.getFighterData();
    if(fighterData && fighterData[0] && fighterData[1]) {
      this.setState({
        redName: fighterData[0]['name'],
        blueName: fighterData[1]['name'],
      });
    } else {
      this.setState({redName: null, blueName: null});
    }
  }

  render() {
    const waitingString = 'Waiting for Data...';
    return (
      <div className="Fighter-Comparison-Header">
        <h2 className="Red-Fighter-Name">
          {this.state.redName || waitingString}
        </h2>
        <h2 className="VS">
          VS
        </h2>
        <h2 className="Blue-Fighter-Name">
          {this.state.blueName || waitingString}
        </h2>
      </div>
    )
  }
}

export default FighterComparisonHeader;