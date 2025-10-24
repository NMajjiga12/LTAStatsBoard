const API_BASE = '/api';

export const getRunners = async () => {
  const response = await fetch(`${API_BASE}/runners`);
  if (!response.ok) throw new Error('Failed to fetch runners');
  return response.json();
};

export const saveRunners = async (runners) => {
  const response = await fetch(`${API_BASE}/runners`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(runners)
  });
  if (!response.ok) throw new Error('Failed to save runners');
  return response.json();
};

export const getLeaderboardData = async () => {
  const response = await fetch(`${API_BASE}/runners/leaderboard_data`);
  if (!response.ok) throw new Error('Failed to fetch leaderboard data');
  return response.json();
};