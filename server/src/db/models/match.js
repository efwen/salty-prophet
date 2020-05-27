const mongoose = require('mongoose');
const Int32 = require('mongoose-int32');
const Schema = mongoose.Schema;

const ModeEnum = {
  type: String,
  enum: ['matchmaking', 'tournament', 'exhibitions'],
  required: true,
};

const PotType = {
  type: Int32,
  min: 0,
};

const FighterRef = {
  type: Schema.Types.ObjectId,
  ref: 'Fighter',
};

const matchSchema = new Schema({
  startTime: Date,
  duration: {type: Int32, min: 0},
  fighters: [FighterRef],
  pots: [PotType],
  winnerId: FighterRef,
  mode: ModeEnum,
});

const MatchModel = mongoose.model('Match', matchSchema);

module.exports = MatchModel;
