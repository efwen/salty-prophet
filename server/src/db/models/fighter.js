const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tierEnum = {
  type: String,
  enum: ['P', 'B', 'A', 'S', 'X'],
  required: true,
};

const fighterSchema = new Schema({
  name: {
    type: String,
    required: [true, 'name field required for Fighter'],
  },
  tier: tierEnum,
});

const FighterModel = mongoose.model('Fighter', fighterSchema);

module.exports = FighterModel;
