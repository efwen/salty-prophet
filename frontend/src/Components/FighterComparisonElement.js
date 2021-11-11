import React from 'react';
import API from '../api';

class FighterComparisonElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redValue: null,
      blueValue: null,
    };
  }

  componentDidMount() {
    setInterval(
      () => this.updateValues(),
      1000
    );
  }

  updateValues() {
    const fighterData = API.getFighterData();
    const mode = API.getMode();

    const getWinRateNum = (modeData) => {
      if(modeData['totalMatches'] == 0) {
        return 0;
      } else {
        return modeData['totalWins'] / modeData['totalMatches'] * 100;
      }
    }

    if(fighterData && fighterData[0] && fighterData[1]) {
      // annoying special case for tier - not specific to a mode,
      // so we have to access it differently
      if(this.props.propName === 'tier') {
        this.setState({
          redValue: fighterData[0][this.props.propName],
          blueValue: fighterData[1][this.props.propName],
        })
      } 
      else if(this.props.propName === 'winRate') {
        this.setState({
          redValue: getWinRateNum(fighterData[0][mode]).toFixed(2) + '%',
          blueValue: getWinRateNum(fighterData[1][mode]).toFixed(2) + '%',
        })
      }
      else {
        this.setState({
          redValue: fighterData[0][mode][this.props.propName],
          blueValue: fighterData[1][mode][this.props.propName],
        });
      }
    } else {
      this.setState({redValue: null, blueValue: null});
    }
  }

  render() {
    const replaceIfNull = (value, replace) => {
      return (value !== null) ? value : replace;
    }

    return (
      <div className="Fighter-Comparison-Element">
        <div><b>{replaceIfNull(this.state.redValue, '---')}</b></div>
        <div><b>{this.props.name}</b></div>
        <div><b>{replaceIfNull(this.state.blueValue, '---')}</b></div>
      </div>
    )
  }
}

export default FighterComparisonElement;
