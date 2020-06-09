let API_URL = (process.env.NODE_ENV === 'development') ? 'http://localhost:1313' : process.env.REACT_APP_API_URL;

let APIState = null;

function callStateAPI() {
  fetch(`${API_URL}/api/state`)
    .then(response => response.json())
    .then((response) => {
      APIState = response;
    })
    .catch((err) => {
      console.error('Failed to get message from api!');
      console.error(err);
      APIState = null;
    });
}

callStateAPI();
setInterval(callStateAPI, process.env.REACT_APP_UPDATE_INTERVAL || 5000);

function getLastMessage() {
  return APIState ? APIState.lastMessage : "";
}

function getFighterData() {
  return APIState ? APIState.fighters : null;
}

function getMode() {
  return APIState ? APIState.mode : null;
}

function getPhase() {
  return APIState ? APIState.phase : null;
}

export default {
  getLastMessage,
  getFighterData,
  getMode,
  getPhase,
}