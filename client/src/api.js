
export async function getLastMessage() {
  const response = await fetch(`${process.env.REACT_APP_API_URL}:1313/api`);
  return response.json();
}