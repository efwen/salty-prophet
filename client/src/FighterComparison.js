import React from 'react';
import FighterComparisonHeader from './FighterComparisonHeader'
import FighterComparisonElement from './FighterComparisonElement'

class FighterComparison extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className="Fighter-Comparison">
        <FighterComparisonHeader />
        <FighterComparisonElement name='Tier' propName='tier'/>
        <FighterComparisonElement name='Matches Recorded' propName='totalMatches'/>
        <FighterComparisonElement name='Wins' propName='totalWins'/>
        <FighterComparisonElement name='Current Streak'propName='currentStreak'/>
        <FighterComparisonElement name='Best Streak' propName='bestStreak'/>
      </div>
    )
  }
}

export default FighterComparison;