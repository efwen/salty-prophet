const API_URL = 'http://localhost:1313';

export async function getLastMessage() {
  const response = await fetch(`${API_URL}/api`);
  return response.json();
}