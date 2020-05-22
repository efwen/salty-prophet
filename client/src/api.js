let API_URL = (process.env.NODE_ENV === 'development') ? 'http://localhost:1313' : process.env.REACT_APP_API_URL;

export async function getLastMessage() {
  const response = await fetch(`${API_URL}/api/`);
  return response.json();
}
