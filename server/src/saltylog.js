// Responsible for picking out the relevant data and forwarding
// It to be submitted to the DB
const tmi = require('tmi.js');
const db = require('./db/db.js');
const {Match} = require('./types.js');

const channelName = 'saltybet';
const refBotName = 'WAIFU4u';

// strings for identifying when to process a message
const openMatchStr = 'Bets are OPEN';
const lockMatchStr = 'Bets are locked.';
const endMatchStr = 'wins!';
const modeSwitchStr = 'will start shortly.';

// regex for extracting match data
const openDataPatt = /(?:Bets are OPEN for )(.*) vs (.*)! (?:\((.) (?:\/ (.) )?Tier\))*.*(matchmaking|tournament|exhibitions)/; // eslint-disable-line max-len
const lockDataPatt = /\$(\d{1,3}(?:,\d{1,3})*).*\$(\d{1,3}(?:,\d{1,3})*)/;
const endDataPatt = /(Red|Blue)/;

// state variables
let currentMessage = 'no messages yet';
const modes = {
  MATCHMAKING: 'matchmaking',
  TOURNAMENT: 'tournament',
  EXHIBITIONS: 'exhibitions',
};
let currentMode = modes.MATCHMAKING;
const phases = {
  BETS_OPEN: 'bets open',
  MATCH_RUNNING: 'match running',
  MATCH_OVER: 'match over',
};
let currentPhase = phases.BETS_OPEN;
let currentMatch = new Match();
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
  const redTier = openData[3] ? openData[3] : 'U';
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
    currentMessage = message;
    console.log(`${refBotName}: ${message}`);

    if(message.match(openMatchStr)) {
      if(currentPhase === phases.BETS_OPEN) {
        currentMatch = new Match();
        processOpenData(openDataPatt.exec(message))
            .then(() => {
              currentPhase = phases.MATCH_RUNNING;
            })
            .catch((err) => {
              currentMatch = null;
              console.error(err.stack);
            });
      }
    } else if(message.match(lockMatchStr)) {
      if(currentPhase === phases.MATCH_RUNNING) {
        processLockData(lockDataPatt.exec(message));
        currentPhase = phases.MATCH_OVER;
      }
    } else if(message.match(endMatchStr)) {
      if(currentPhase === phases.MATCH_OVER) {
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
              currentPhase = phases.BETS_OPEN;
              switchingModes = false;
            });
      }
    } else if(message.match(modeSwitchStr)) {
      if(currentPhase == 'end') {
        processModeSwitchData();
      }
    }
  }
});

// API requests
const getCurrentMessage = () => {
  return currentMessage;
};

const getCurrentFighters = () => {
  return currentMatch.fighters;
};

const getCurrentPots = () => {
  return currentMatch.pots;
};

const getCurrentMode = () => {
  return currentMode;
};

module.exports = {
  getCurrentMessage,
  getCurrentFighters,
  getCurrentPots,
  getCurrentMode,
};
