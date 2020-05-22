let API_URL = (process.env.NODE_ENV === 'development') ? 'http://localhost:1313' : process.env.REACT_APP_API_URL;

export async function getLastMessage() {
  const response = await fetch(`${API_URL}/api/message`);
  return response.json();
}

export async function getFighter() {
  const response = await fetch(`${API_URL}/api/fighter`);
  return response.json();
}
