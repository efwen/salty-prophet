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

    //truncation to keep some names under control
    const maxNameLength = 20;
    const truncate = (name, maxSize) => {
      if(name.length > maxSize)
        return name.substring(0, maxSize - 3) + '...';
      else
        return name;
    }

    return (
      <div className="Fighter-Comparison-Header">
        <h2 className="Fighter-Name Red-Fighter-Name">
          {this.state.redName ? truncate(this.state.redName, maxNameLength) : waitingString}
        </h2>
        <h2 className="VS">
          VS
        </h2>
        <h2 className="Fighter Name Blue-Fighter-Name">
          {this.state.blueName ? truncate(this.state.blueName, maxNameLength) : waitingString}
        </h2>
      </div>
    )
  }
}

export default FighterComparisonHeader;