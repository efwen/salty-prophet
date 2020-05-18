// Responsible for picking out the relevant data and forwarding
// It to be submitted to the DB
const tmi = require('tmi.js');

const channelName = 'saltybet';
const refBotName = 'WAIFU4u';

const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true,
  },
  channels: [channelName],
});

client.connect();

client.on('message', (channel, tags, message, self) => {
  if (tags['display-name'] === refBotName) {
    console.log(`${tags['display-name']}: ${message}`);
  }
});
