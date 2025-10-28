// src/services/api.js
const API_BASE = '/api';

// Runner functions
export const getRunners = async () => {
  try {
    const response = await fetch(`${API_BASE}/runners`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch runners:', error);
    throw error;
  }
};

export const saveRunners = async (runners) => {
  try {
    const response = await fetch(`${API_BASE}/runners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(runners)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to save runners: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to save runners:', error);
    throw error;
  }
};

export const getLeaderboardData = async () => {
  try {
    const response = await fetch(`${API_BASE}/runners/leaderboard_data`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch leaderboard data:', error);
    throw error;
  }
};

// Commentator functions
export const getCommentators = async () => {
  try {
    const response = await fetch(`${API_BASE}/commentators`);
    if (!response.ok) throw new Error('Failed to fetch commentators');
    return response.json();
  } catch (error) {
    console.error('Failed to fetch commentators:', error);
    throw error;
  }
};

export const saveCommentators = async (commentators) => {
  try {
    const response = await fetch(`${API_BASE}/commentators`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(commentators)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || 'Failed to save commentators');
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to save commentators:', error);
    throw error;
  }
};