// src/components/OBSRunner.js
import React, { useState, useEffect } from 'react';

const OBSRunner = ({ username, fontFamily = 'Verdana, sans-serif', textColor = '#ffffff' }) => {
  const [runnerData, setRunnerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actualUsername, setActualUsername] = useState(null);

  // Check if username is a runner number (runner1, runner2, etc.)
  useEffect(() => {
    const runnerNumberPattern = /^runner(\d+)$/;
    const match = username.match(runnerNumberPattern);
    
    if (match) {
      const fetchRunnerUsername = async () => {
        try {
          const response = await fetch('/api/runners');
          if (!response.ok) {
            throw new Error('Failed to fetch runner data');
          }
          const runners = await response.json();
          const runnerIndex = parseInt(match[1]) - 1;
          
          if (runnerIndex >= 0 && runnerIndex < runners.length) {
            const runner = runners[runnerIndex];
            
            if (runner.therunUsername) {
              setActualUsername(runner.therunUsername);
            } else {
              setError(`Runner ${match[1]} not configured with a therun.gg username`);
              setLoading(false);
            }
          } else {
            setError(`Runner ${match[1]} not found in configuration`);
            setLoading(false);
          }
        } catch (err) {
          setError('Failed to load runner configuration');
          setLoading(false);
        }
      };
      
      fetchRunnerUsername();
    } else {
      setActualUsername(username);
    }
  }, [username]);

  const formatTime = (ms) => {
    if (!ms) return 'N/A';
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `0:${seconds.toString().padStart(2, '0')}`;
    }
  };

  const formatDelta = (delta) => {
    if (delta === null || delta === undefined) return 'N/A';
    
    const sign = delta < 0 ? '−' : '+';
    const absDelta = Math.abs(delta);
    const totalSeconds = absDelta / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = (totalSeconds % 60).toFixed(2);
    
    return minutes > 0 
      ? `${sign}${minutes}:${seconds.padStart(5, '0')}`
      : `${sign}${seconds}`;
  };

  const getSplitDisplay = (runnerData) => {
    if (!runnerData) return 'N/A';
    
    const { currentSplitIndex, currentSplitName, gameData } = runnerData;
    
    if (currentSplitIndex <= -1) {
      return 'Reset';
    }
    
    if (gameData && gameData.lastSplitId !== undefined) {
      const lastSplitId = gameData.lastSplitId;
      
      if (currentSplitIndex > lastSplitId) {
        return 'Finished';
      }
    }
    
    return currentSplitName || `Split ${currentSplitIndex + 1}`;
  };

  const fetchRunnerData = async () => {
    if (!actualUsername) return;

    try {
      const response = await fetch(`https://therun.gg/api/live/${actualUsername}`);
      
      if (!response.ok) {
        throw new Error('Runner not found or not live');
      }
      
      const data = await response.json();
      
      if (!data?.login) {
        throw new Error('Runner data not available');
      }

      setRunnerData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setRunnerData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (actualUsername) {
      fetchRunnerData();
      
      const interval = setInterval(fetchRunnerData, 2000);
      return () => clearInterval(interval);
    }
  }, [actualUsername]);

  const containerStyle = {
    fontFamily: fontFamily,
    fontSize: '16px',
    color: textColor,
    backgroundColor: 'rgba(0, 0, 0, 1.0)',
    width: '100vw',
    height: '100vh',
    margin: 0,
    padding: 0,
    position: 'fixed',
    top: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const textStyle = {
    fontFamily: fontFamily,
    color: textColor
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div className="runner-container loading" style={textStyle}>
          Loading data for {actualUsername || username}...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div className="runner-container error" style={textStyle}>
          {error}
        </div>
      </div>
    );
  }

  if (!runnerData) {
    return (
      <div style={containerStyle}>
        <div className="runner-container error" style={textStyle}>
          No runner data available
        </div>
      </div>
    );
  }

  const splitDisplay = getSplitDisplay(runnerData);
  const deltaClass = runnerData.delta < 0 ? 'stat-positive' : 'stat-negative';

  return (
    <div style={containerStyle}>
      <div className="runner-container">
        <div className="runner-stats" style={textStyle}>
          <div><span className="label">Twitch:</span> {runnerData.login}</div>
          <div><span className="label">Current Split:</span> {splitDisplay}</div>
          <div className={deltaClass}><span className="label">PB Delta:</span> {formatDelta(runnerData.delta)}</div>
          <div><span className="label">Best Possible Time:</span> {formatTime(runnerData.bestPossible)}</div>
          <div><span className="label">Personal Best:</span> {formatTime(runnerData.pb)}</div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(OBSRunner);