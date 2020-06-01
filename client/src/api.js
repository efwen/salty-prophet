let API_URL = (process.env.NODE_ENV === 'development') ? 'http://localhost:1313' : process.env.REACT_APP_API_URL;

const APIState = {
  lastMessage: null,
  fighterData: null,
};

function callMessageAPI() {
  fetch(`${API_URL}/api/message`)
    .then(response => response.json())
    .then((response) => {
      APIState.lastMessage = response.message;
    })
    .catch((err) => {
      console.error('Failed to get message from api!');
      console.error(err);
      APIState.lastMessage = null;
    });
}

async function callFightersAPI() {
  fetch(`${API_URL}/api/fighters`)
    .then(response => response.json())
    .then((fighters) => {
      APIState.fighterData = fighters;
    })
    .catch((err) => {
      console.error('Failed to get message from api!');
      console.error(err);
      APIState.fighterData = null;
    });
}

callMessageAPI();
callFightersAPI();
setInterval(callMessageAPI, process.env.REACT_APP_UPDATE_INTERVAL || 5000);
setInterval(callFightersAPI, process.env.REACT_APP_UPDATE_INTERVAL || 5000);

function getLastMessage() {
  return APIState.lastMessage;
}

function getFighterData() {
  return APIState.fighterData;
}

export default {
  getLastMessage,
  getFighterData,
}