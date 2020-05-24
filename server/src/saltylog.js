// Responsible for picking out the relevant data and forwarding
// It to be submitted to the DB
const tmi = require('tmi.js');
const db = require('./db/db.js');
const {Fighter, Match} = require('./types.js');

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
let currentMode = 'matchmaking';
let currentPhase = 0; // phase 0: bets open, 1: bets locked, 2: match over
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

function processOpenData(openData) {
  const redTier = openData[3] ? openData[3] : 'U';
  const blueTier = openData[4] ? openData[4] : redTier;
  currentMatch.fighters = [
    new Fighter(openData[1], redTier),
    new Fighter(openData[2], blueTier),
  ];
  currentMode = openData[5];
}

function processLockData(lockData) {
  currentMatch.pots = [
    parseInt(lockData[1].replace(/,/g, '')),
    parseInt(lockData[2].replace(/,/g, '')),
  ];
  currentMatch.startTime = Date.now();
}

function processEndMatchData(endMatchData) {
  currentMatch.winner = (endMatchData[1] === 'Red') ?
    currentMatch.fighters[0] : currentMatch.fighters[1];
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
      if(currentPhase != 0) return;
      currentMessage = message;

      currentMatch = new Match();

      processOpenData(openDataPatt.exec(message));
      db.saveFighters(currentMatch.fighters)
          .then((fighters) => {
            currentMatch.fighters = fighters;
            currentPhase++;
          })
          .catch((err) => {
            currentMatch = null;
            currentPhase = 0;
            console.error(err.stack);
          });
    } else if(message.match(lockMatchStr)) {
      if(currentPhase != 1) return;
      currentMessage = message;

      processLockData(lockDataPatt.exec(message));
      currentPhase++;
    } else if(message.match(endMatchStr)) {
      if(currentPhase != 2) return;
      currentMessage = message;

      processEndMatchData(endDataPatt.exec(message));

      console.log(currentMatch);

      currentMatch = new Match();
      currentPhase = 0;
      switchingModes = false;
    } else if(message.match(modeSwitchStr)) {
      if(currentPhase == 2) {
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
