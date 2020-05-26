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

async function updateFighters(fighterDocs, matchDoc) {
}

const saveMatch = async (matchData, mode) => {
  return MatchModel.create({
    startTime: matchData.startTime,
    duration: matchData.duration,
    fighters: [matchData.fighters[0].id, matchData.fighters[1].id],
    pots: matchData.pots,
    winner: matchData.winner.id,
    mode: mode,
  });
};

module.exports = {
  getFighters,
  saveMatch,
};
