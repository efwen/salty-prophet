const mongoose = require('mongoose');
const FighterModel = require('./fighter');
const Schema = mongoose.Schema;

const modeEnum = {
  type: String,
  enum: ['matchmaking', 'tournament', 'exhibitions'],
  required: true,
};

const potType = {
  type: Number,
  min: 0,
};

const fighterRef = {
  type: Schema.Types.ObjectId,
  ref: FighterModel,
};

const matchSchema = new Schema({
  startTime: Date,
  duration: {type: Number, min: 0},
  fighters: [fighterRef, fighterRef],
  pots: [potType, potType],
  winner: fighterRef,
  mode: modeEnum,
});

const MatchModel = mongoose.model('Match', matchSchema);

module.exports = MatchModel;
