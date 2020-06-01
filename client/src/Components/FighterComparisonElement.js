import React from 'react';
import {getFighterData} from '../API';

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
    const fighterData = getFighterData();
    if(fighterData && fighterData[0] && fighterData[1]) {
      this.setState({
        redValue: fighterData[0][this.props.propName],
        blueValue: fighterData[1][this.props.propName],
      });
    } else {
      this.setState({redValue: null, blueValue: null});
    }
  }

  render() {
    return (
      <div className="Fighter-Comparison-Element">
        <div><b>{this.state.redValue || '---'}</b></div>
        <div><b>{this.props.name}</b></div>
        <div><b>{this.state.blueValue || '---'}</b></div>
      </div>
    )
  }
}

export default FighterComparisonElement;