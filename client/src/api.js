let API_URL = (process.env.NODE_ENV === 'development') ? 'http://localhost' : process.env.REACT_APP_API_URL;
let API_PORT = process.env.REACT_APP_API_PORT;

export async function getLastMessage() {
  const response = await fetch(`${API_URL}:${API_PORT}/api`);
  return response.json();
}