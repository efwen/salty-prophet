// Responsible for picking out the relevant data and forwarding
// It to be submitted to the DB
require('dotenv').config();
const tmi = require('tmi.js');
const db = require('./db/db.js');

const channelName = process.env.CHANNEL;
const refBotName = process.env.REF_BOT;

// strings for identifying when to process a message
const openMatchStr = 'Bets are OPEN';
const lockMatchStr = 'Bets are locked.';
const endMatchStr = 'wins!';
const modeSwitchStr = 'will start shortly.';

// regex for extracting match data
const openDataPatt = /(?:Bets are OPEN for )(.*) vs (.*)! (?:\((.|None) (?:\/ (.|None) )?Tier\))*.*(matchmaking|tournament|exhibitions)/; // eslint-disable-line max-len
const lockDataPatt = /\$(\d{1,3}(?:,\d{1,3})*).*\$(\d{1,3}(?:,\d{1,3})*)/;
const endDataPatt = /(Red|Blue)/;

const phases = {
  AWAITING_MATCH: 'Awaiting Match',
  BETS_OPEN: 'Bets Open',
  MATCH_RUNNING: 'Match Running',
  MATCH_OVER: 'Match Over',
};
const modes = {
  MATCHMAKING: 'matchmaking',
  TOURNAMENT: 'tournament',
  EXHIBITIONS: 'exhibitions',
};
class MatchState {
  constructor() {
    this.startTime = 0;
    this.duration = 0;
    this.fighters = [null, null];
    this.pots = [0, 0];
    this.winnerId = null;
  }
};

// state variables
let lastMessage = 'no messages yet';
let currentMode = modes.MATCHMAKING;
let currentPhase = phases.AWAITING_MATCH;
let currentMatch = new MatchState();
let switchingModes = false;

const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true,
  },
  channels: [channelName],
});

client.connect();

async function processOpenData(openData) {
  const redTier = openData[3] ? openData[3] : 'None';
  const blueTier = openData[4] ? openData[4] : redTier;

  currentMode = openData[5];

  return db.getFighters(
      [{name: openData[1], tier: redTier},
        {name: openData[2], tier: blueTier}])
      .then((docs) => {
        currentMatch.fighters = docs;
      });
}

function processLockData(lockData) {
  currentMatch.pots = [
    parseInt(lockData[1].replace(/,/g, '')),
    parseInt(lockData[2].replace(/,/g, '')),
  ];
  currentMatch.startTime = Date.now();
}

function processEndMatchData(endMatchData) {
  currentMatch.winnerId = (endMatchData[1] === 'Red') ?
    currentMatch.fighters[0]._id : currentMatch.fighters[1]._id;
  if(!switchingModes) {
    currentMatch.duration = Math.floor(
        (Date.now() - currentMatch.startTime) / 1000);
  }
}

function processModeSwitchData() {
  switchingModes = true;
  currentMatch.duration =
    Math.floor((Date.now() - currentMatch.startTime) / 1000);
}

client.on('message', (channel, tags, message, self) => {
  if (tags['display-name'] === refBotName) {
    if(message.match(openMatchStr)) {
      lastMessage = message;
      console.log(`${refBotName}: ${message}`);

      if(currentPhase === phases.MATCH_OVER || currentPhase === phases.AWAITING_MATCH) {
        currentMatch = new MatchState();
        processOpenData(openDataPatt.exec(message))
            .then(() => {
              currentPhase = phases.BETS_OPEN;
            })
            .catch((err) => {
              currentMatch = null;
              console.error(err.stack);
            });
      }
    } else if(message.match(lockMatchStr)) {
      lastMessage = message;
      console.log(`${refBotName}: ${message}`);
      if(currentPhase === phases.BETS_OPEN) {
        processLockData(lockDataPatt.exec(message));
        currentPhase = phases.MATCH_RUNNING;
      }
    } else if(message.match(endMatchStr)) {
      lastMessage = message;
      console.log(`${refBotName}: ${message}`);
      if(currentPhase === phases.MATCH_RUNNING) {
        processEndMatchData(endDataPatt.exec(message));

        db.saveMatch(currentMatch, currentMode)
            .then((doc) => db.updateFighters(currentMatch.fighters, doc))
            .then((fighters) => {
              console.log('fighters after update');
              console.log(fighters);
            })
            .catch((err) => {
              console.error('Failed to submit match!');
              console.error(err.stack);
            })
            .finally(() => {
              currentMatch = null;
              currentPhase = phases.MATCH_OVER;
              switchingModes = false;
            });
      }
    }
  } else if(tags['display-name'] === 'SaltyBet') {
    if(message.match(modeSwitchStr)) {
      if(currentPhase === phases.MATCH_RUNNING) {
        lastMessage = message;
        console.log(`SaltyBet: ${message}`);
        processModeSwitchData();
      }
    }
  }
});

// API requests
const getState = () => {
  return {
    mode: currentMode,
    phase: currentPhase,
    lastMessage: lastMessage,
    fighters: currentMatch ? currentMatch.fighters : [null, null],
    pots: currentMatch ? currentMatch.pots : [null, null],
  };
};

module.exports = {
  getState,
};
