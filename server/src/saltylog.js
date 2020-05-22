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

const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true,
  },
  channels: [channelName],
});

client.connect();

let lastMessage = 'none';

client.on('message', (channel, tags, message, self) => {
  if (tags['display-name'] === refBotName) {
    console.log(`${tags['display-name']}: ${message}`);

    if(message.match(openMatchStr)) {
      console.log('open');
      lastMessage = message;
    } else if(message.match(lockMatchStr)) {
      console.log('match');
      lastMessage = message;
    } else if(message.match(endMatchStr)) {
      console.log('end');
      lastMessage = message;
    } else if(message.match(modeSwitchStr)) {
      console.log('mode');
      lastMessage = message;
    }
  }
});

const getLastMessage = () => {
  return lastMessage;
};

const getFighter = async (id) => {
  return db.getFighter(id)
      .then((value) => {
        return value;
      })
      .catch((err) => console.log(err));
};

module.exports = {
  getLastMessage,
  getFighter,
};
