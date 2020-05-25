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

const upsertFighter = async (fighter) => {
  const filter = {
    name: fighter.name,
    tier: fighter.tier,
  };
  const update = {};
  const options = {
    upsert: true,
    new: true,
    setDefaultOnInsert: true,
  };

  const doc = await FighterModel.findOneAndUpdate(filter, update, options);
  return doc._id;
};

async function saveFighters(fighters) {
  const upserts = [
    upsertFighter(fighters[0]),
    upsertFighter(fighters[1]),
  ];

  return Promise.all(upserts)
      .then((results) => {
        fighters[0].id = results[0];
        fighters[1].id = results[1];
        return fighters;
      });
}

const saveMatch = async (matchData, mode) => {
  await MatchModel.create({
    startTime: matchData.startTime,
    duration: matchData.duration,
    fighters: [matchData.fighters[0].id, matchData.fighters[1].id],
    pots: matchData.pots,
    winner: matchData.winner.id,
    mode: mode,
  });

  console.log('Match saved!');
};

module.exports = {
  saveFighters,
  saveMatch,
};
