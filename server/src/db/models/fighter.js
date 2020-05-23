const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tierEnum = {
  type: String,
  enum: ['P', 'B', 'A', 'S', 'X'],
};

const fighterSchema = new Schema({
  name: String,
  tier: tierEnum,
});

const Fighter = mongoose.model('Fighter', fighterSchema);

module.exports = Fighter;
