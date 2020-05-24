// Responsible for picking out the relevant data and forwarding
// It to be submitted to the DB
const tmi = require('tmi.js');
const db = require('./db/db.js');

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

const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true,
  },
  channels: [channelName],
});

client.connect();

let redFighter = null;
let blueFighter = null;

function saveFighters(openData) {
  const redTier = openData[3] ? openData[3] : 'U';
  const blueTier = openData[4] ? openData[4] : redTier;

  const getOrCreateFighter = async (name, tier) => {
    return await db.getFighter(name, tier)
        .then((result) => {
          return (result) ? result : db.createFighter(name, tier);
        });
  };

  const promises = [
    getOrCreateFighter(openData[1], redTier),
    getOrCreateFighter(openData[2], blueTier),
  ];

  return Promise.all(promises)
      .then((res) => {
        console.log('Fighter IDs:', res[0]._id, res[1]._id);
        redFighter = res[0]._id;
        blueFighter = res[1]._id;
      });
}

let lastMessage = 'none';

client.on('message', (channel, tags, message, self) => {
  if (tags['display-name'] === refBotName) {
    if(message.match(openMatchStr)) {
      console.log('----------------------------------------------');
      console.log(message);
      saveFighters(openDataPatt.exec(message)).catch((err) => {
        console.error(err.stack);
      });
      lastMessage = message;
    } else if(message.match(lockMatchStr)) {
      console.log(message);
      lastMessage = message;
    } else if(message.match(endMatchStr)) {
      console.log(message);
      lastMessage = message;
    } else if(message.match(modeSwitchStr)) {
      console.log(message);
      lastMessage = message;
    }
  }
});

// frontend requests
const getLastMessage = () => {
  return lastMessage;
};

const getCurrentFighters = () => {
  return [redFighter, blueFighter];
};

module.exports = {
  getLastMessage,
  getCurrentFighters,
};
