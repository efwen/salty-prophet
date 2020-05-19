const API_URL = process.env.DEV_CFG == 'development' ? 'http://localhost:1313' : process.env.API_URL;

export async function getLastMessage() {
  const response = await fetch(`${API_URL}/api`);
  return response.json();
}