require('dotenv').config();
const mongoose = require('mongoose');
const Fighter = require('./models/fighter');

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

const getFighter = async (name, tier) => {
  return await Fighter.findOne({
    name: name,
    tier: tier,
  }).catch((err) => {
    console.error('Failed to get fighter!');
    throw err;
  });
};

const upsertFighter = async (name, tier) => {
  const filter = {
    name: name,
    tier: tier,
  };
  const update = {};
  const options = {
    upsert: true,
    new: true,
    setDefaultOnInsert: true,
  };

  const doc = await Fighter.findOneAndUpdate(filter, update, options);
  return doc._id;
};

module.exports = {
  getFighter,
  upsertFighter,
};
