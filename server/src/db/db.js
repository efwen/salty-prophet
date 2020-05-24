require('dotenv').config();
const mongoose = require('mongoose');
const Fighter = require('./models/fighter');

mongoose.connect(process.env.DB_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => console.log(error));

const getFighterID = async (name, tier) => {
  const doc = await Fighter.findOne({
    name: name,
    tier: tier,
  }).catch((err) => {
    console.error('Failed to get fighter!');
    throw err;
  });

  if(!doc) {
    return null;
  }

  return doc._id;
};

const createFighter = async (name, tier) => {
  const fighterEntry = new Fighter({name: name, tier: tier});
  const res = await fighterEntry.save().catch((err) => {
    console.error('db.createFighter Failed to create fighter!');
    throw err;
  });
  return res._id;
};

module.exports = {
  getFighterID,
  createFighter,
};
