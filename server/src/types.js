
class Fighter {
  constructor(name, tier) {
    this.name = name;
    this.tier = tier;
    this.id = null;
  }
}

class Match {
  constructor() {
    this.startTime = 0;
    this.duration = 0;
    this.fighters = [null, null];
    this.pots = [0, 0];
    this.winner = null;
  }
};

module.exports = {
  Fighter,
  Match,
};
