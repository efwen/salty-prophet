const mongoose = require('mongoose');
const FighterModel = require('./models/fighter');
const MatchModel = require('./models/match');

mongoose.connect(process.env.DB_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => console.log(error));

const upsertFighter = async (fighterKey, update) => {
  const filter = {
    name: fighterKey.name,
    tier: fighterKey.tier,
  };
  const options = {
    upsert: true,
    new: true,
    setDefaultOnInsert: true,
  };

  return await FighterModel.findOneAndUpdate(filter, update, options);
};

async function getFighters(fighterKeys) {
  return Promise.all([
    upsertFighter(fighterKeys[0], {}),
    upsertFighter(fighterKeys[1], {}),
  ]);
}

async function updateFighterByID(fighterId, toUpdate) {
  const filter = {
    _id: fighterId,
  };
  const options = {
    new: true,
  };
  return await FighterModel.findOneAndUpdate(filter, toUpdate, options);
}

async function updateFighters(fighterDocs, matchDoc) {
  const createNewStats = (curStats, matchId, isWinner) => {
    // continue or reset streak depending on if the fighter won,
    // and which direction the streak was
    let streak = curStats.currentStreak;
    if(isWinner) {
      streak = (streak >= 0) ? streak + 1 : 1;
    } else {
      streak = (streak <= 0) ? streak - 1 : -1;
    }

    // if no recorded best streak yet, set to current streak (1 or -1)
    // otherwise set to greater of current best and new streak
    const bestStreak = (curStats.bestStreak == 0) ?
          streak : Math.max(curStats.bestStreak, streak);

    return {
      matchHistory: curStats.matchHistory.concat([matchId]),
      totalMatches: curStats.totalMatches + 1,
      totalWins: (isWinner) ? curStats.totalWins + 1 : curStats.totalWins,
      currentStreak: streak,
      bestStreak: bestStreak,
    };
  };

  const redWon = fighterDocs[0]._id === matchDoc.winnerId;

  const redUpdate = {};
  const blueUpdate = {};
  redUpdate[matchDoc.mode] = createNewStats(fighterDocs[0][matchDoc.mode], matchDoc._id, redWon);
  blueUpdate[matchDoc.mode] = createNewStats(fighterDocs[1][matchDoc.mode], matchDoc._id, !redWon);

  return Promise.all([
    updateFighterByID(fighterDocs[0]._id, redUpdate),
    updateFighterByID(fighterDocs[1]._id, blueUpdate),
  ]);
}

const saveMatch = async (matchData, mode) => {
  return MatchModel.create({
    startTime: matchData.startTime,
    duration: matchData.duration,
    fighterIds: [matchData.fighters[0].id, matchData.fighters[1].id],
    pots: matchData.pots,
    winnerId: matchData.winnerId,
    mode: mode,
  });
};

module.exports = {
  getFighters,
  updateFighters,
  saveMatch,
};
