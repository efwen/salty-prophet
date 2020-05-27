require('dotenv').config();
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
  console.log('updating fighters!');
  console.log(fighterDocs);
  console.log(matchDoc);

  const createUpdateObject = (fighterDoc, matchId, winnerId) => {
    // continue or reset streak depending on if the fighter won,
    // and which direction the streak was
    let streak = fighterDoc.currentStreak;
    if(fighterDoc._id === winnerId) {
      streak = (streak >= 0) ? streak + 1 : -1;
    } else {
      streak = (streak <= 0) ? streak - 1 : 1;
    }

    // if no recorded best streak yet, set to current streak (1 or -1)
    // otherwise set to greater of current best and new streak
    const bestStreak = (fighterDoc.bestStreak == 0) ?
          streak : max(fighterDoc.bestStreak, streak);

    return {
      matchHistory: fighterDoc.matchHistory + matchId,
      totalMatches: fighterDoc.totalMatches + 1,
      totalWins: (fighterDoc._id === winnerId) ?
            fighterDoc.totalWins + 1 : fighterDoc.totalWins,
      currentStreak: streak,
      bestStreak: bestStreak,
    };
  };

  return Promise.all([
    updateFighterByID(matchDoc.fighters[0],
        createUpdateObject(fighterDocs[0], matchDoc._id, matchDoc.winnerId)),
    updateFighterByID(matchDoc.fighters[1],
        createUpdateObject(fighterDocs[1], matchDoc._id, matchDoc.winnerId)),
  ]);
}

const saveMatch = async (matchData, mode) => {
  return MatchModel.create({
    startTime: matchData.startTime,
    duration: matchData.duration,
    fighters: [matchData.fighters[0].id, matchData.fighters[1].id],
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
