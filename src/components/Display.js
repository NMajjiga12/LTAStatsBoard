import React, { useState, useEffect, useCallback } from 'react';
import { formatTimeForDisplay } from '../utils/timeFormat';

const Display = ({ leaderboardData, runnerData }) => {
  const [runnerStats, setRunnerStats] = useState({});
  const [loading, setLoading] = useState({});
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [forceRefresh, setForceRefresh] = useState({});

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

  // Fetch runner stats from therun.gg
  const fetchRunnerStats = useCallback(async (therunUsername, runnerId) => {
    if (!therunUsername) {
      // Clear stats if no username
      setRunnerStats(prev => {
        const newStats = { ...prev };
        delete newStats[runnerId];
        return newStats;
      });
      setLoading(prev => {
        const newLoading = { ...prev };
        delete newLoading[runnerId];
        return newLoading;
      });
      return;
    }

    try {
      console.log(`Fetching stats for ${therunUsername} (runner ${runnerId})`);
      const response = await fetch(`https://therun.gg/api/live/${therunUsername}`);
      
      if (!response.ok) {
        throw new Error('Runner not found or not live');
      }
      
      const data = await response.json();
      
      if (!data?.login) {
        throw new Error('Runner data not available');
      }

      setRunnerStats(prev => ({
        ...prev,
        [runnerId]: data
      }));
      setLoading(prev => ({
        ...prev,
        [runnerId]: false
      }));
    } catch (err) {
      console.error(`Failed to fetch stats for ${therunUsername}:`, err);
      setRunnerStats(prev => ({
        ...prev,
        [runnerId]: { error: err.message }
      }));
      setLoading(prev => ({
        ...prev,
        [runnerId]: false
      }));
    }
  }, []);

  useEffect(() => {
    const handleRunnerDataUpdated = (event) => {
      const { runnerId, timestamp, username } = event.detail;
      console.log(`Display received update event for runner ${runnerId} at ${timestamp}`);
      
      // Force immediate refresh for the specific runner
      const runner = runnerData.find(r => r.id === runnerId);
      if (runner && runner.therunUsername) {
        console.log(`Immediately refreshing stats for runner ${runnerId}: ${runner.therunUsername}`);
        setLoading(prev => ({ ...prev, [runnerId]: true }));
        fetchRunnerStats(runner.therunUsername, runnerId);
      }
      
      // Also update the global lastUpdate to refresh all components
      setLastUpdate(Date.now());
    };

    window.addEventListener('runnerDataUpdated', handleRunnerDataUpdated);
    
    return () => {
      window.removeEventListener('runnerDataUpdated', handleRunnerDataUpdated);
    };
  }, [runnerData, fetchRunnerStats]);

  // Add a more aggressive refresh mechanism
  useEffect(() => {
    // Refresh all runner stats when runnerData changes significantly
    const runnersWithUsernames = runnerData.filter(runner => runner.therunUsername);
    
    runnersWithUsernames.forEach(runner => {
      // Only refresh if we don't have current data or if data might be stale
      const currentStats = runnerStats[runner.id];
      if (!currentStats || currentStats.error || Date.now() - lastUpdate > 5000) {
        setLoading(prev => ({ ...prev, [runner.id]: true }));
        fetchRunnerStats(runner.therunUsername, runner.id);
      }
    });
  }, [runnerData, lastUpdate, fetchRunnerStats, runnerStats]);

  // Initialize and set up intervals for all runners
  useEffect(() => {
    const runnersWithUsernames = runnerData.filter(runner => runner.therunUsername);
    
    console.log('Setting up runner stats intervals for:', runnersWithUsernames.map(r => r.therunUsername));
    
    // Initial fetch for all runners
    runnersWithUsernames.forEach(runner => {
      setLoading(prev => ({ ...prev, [runner.id]: true }));
      fetchRunnerStats(runner.therunUsername, runner.id);
    });

    // Set up individual intervals for each runner
    const intervals = runnersWithUsernames.map(runner => 
      setInterval(() => {
        fetchRunnerStats(runner.therunUsername, runner.id);
      }, 2000)
    );

    return () => intervals.forEach(interval => clearInterval(interval));
  }, [runnerData, fetchRunnerStats, lastUpdate]);

  // Enhanced refresh mechanism using async service
  useEffect(() => {
    const unsubscribeCallbacks = [];

    // Subscribe to updates for each runner
    runnerData.forEach(runner => {
      if (runner.therunUsername) {
        const unsubscribe = asyncRunnerService.subscribe(runner.id, (updatedRunner) => {
          console.log(`Display received async update for runner ${runner.id}`, updatedRunner);
          if (updatedRunner.therunUsername && updatedRunner.therunUsername !== runner.therunUsername) {
            console.log(`Username changed to ${updatedRunner.therunUsername}, refreshing stats`);
            setLoading(prev => ({ ...prev, [runner.id]: true }));
            fetchRunnerStats(updatedRunner.therunUsername, runner.id);
          }
        });
        unsubscribeCallbacks.push(unsubscribe);
      }
    });

    return () => {
      unsubscribeCallbacks.forEach(unsubscribe => unsubscribe());
    };
  }, [runnerData, fetchRunnerStats]);

  // Listen for therun-specific username updates
  useEffect(() => {
    const handleTherunUsernameUpdated = (event) => {
      const { runnerId, oldUsername, newUsername } = event.detail;
      console.log(`Therun username updated for runner ${runnerId}: ${oldUsername} -> ${newUsername}`);
      
      if (newUsername) {
        setLoading(prev => ({ ...prev, [runnerId]: true }));
        fetchRunnerStats(newUsername, runnerId);
      }
    };

    window.addEventListener('therunUsernameUpdated', handleTherunUsernameUpdated);
    
    return () => {
      window.removeEventListener('therunUsernameUpdated', handleTherunUsernameUpdated);
    };
  }, [fetchRunnerStats]);

  // Update stats when new runners are added or usernames change
  useEffect(() => {
    const currentRunnerIds = Object.keys(runnerStats);
    const newRunners = runnerData.filter(runner => 
      runner.therunUsername && !currentRunnerIds.includes(runner.id.toString())
    );

    console.log('New runners to fetch stats for:', newRunners);

    newRunners.forEach(runner => {
      setLoading(prev => ({ ...prev, [runner.id]: true }));
      fetchRunnerStats(runner.therunUsername, runner.id);
    });

    // Also update existing runners if their usernames changed
    runnerData.forEach(runner => {
      if (runner.therunUsername && runnerStats[runner.id]) {
        const currentStats = runnerStats[runner.id];
        if (currentStats.login !== runner.therunUsername) {
          console.log(`Username changed for runner ${runner.id}, refreshing stats`);
          setLoading(prev => ({ ...prev, [runner.id]: true }));
          fetchRunnerStats(runner.therunUsername, runner.id);
        }
      }
    });
  }, [runnerData, runnerStats, fetchRunnerStats]);

  const getPositionColor = (index) => {
    switch(index) {
      case 0: return 'text-gold';
      case 1: return 'text-silver';
      case 2: return 'text-bronze';
      default: return 'text-white';
    }
  };

  const getPositionBackground = (index) => {
    switch(index) {
      case 0: return 'position-first';
      case 1: return 'position-second';
      case 2: return 'position-third';
      default: return 'position-other';
    }
  };

  const runnersWithUsernames = runnerData.filter(runner => runner.therunUsername);

  return (
    <div className="tab-content" id="displayContent">
      <div className="row">
        {/* Leaderboard Display */}
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span><i className="fas fa-trophy"></i> Leaderboard Display</span>
              <small className="text-muted">Live Preview</small>
            </div>
            <div className="card-body p-0">
              <div className="p-3 bg-dark text-white border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <small>Live Leaderboard Display</small>
                  <button 
                    className="btn btn-sm btn-outline-light"
                    onClick={() => setLastUpdate(Date.now())}
                  >
                    <i className="fas fa-sync-alt me-1"></i> Refresh
                  </button>
                </div>
              </div>
              <div 
                className="leaderboard-preview"
                style={{
                  backgroundColor: '#1a1a1a',
                  color: 'white',
                  minHeight: '400px',
                  padding: '20px',
                  fontFamily: 'Verdana, sans-serif'
                }}
              >
                {leaderboardData.length === 0 ? (
                  <div className="text-center text-muted p-4">No runners with valid times</div>
                ) : (
                  <div className="leaderboard-display">
                    {leaderboardData.map((runner, index) => {
                      const formattedTime = formatTimeForDisplay(runner.time);
                      const positionClass = getPositionColor(index);
                      const backgroundClass = getPositionBackground(index);
                      
                      return (
                        <div 
                          key={index} 
                          className={`leaderboard-entry ${backgroundClass} d-flex justify-content-between align-items-center p-3 mb-2`}
                          style={{
                            borderRadius: '8px',
                            border: '1px solid #333'
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <div 
                              className="position-number me-3 fw-bold"
                              style={{ 
                                minWidth: '30px',
                                fontSize: '1.2rem'
                              }}
                            >
                              {index + 1}.
                            </div>
                            <div className={`runner-name fw-bold ${positionClass}`} style={{ fontSize: '1.1rem' }}>
                              {runner.name || 'Unnamed Runner'}
                            </div>
                          </div>
                          <div className={`runner-time fw-bold ${positionClass} ${!runner.validTime ? 'text-danger' : ''}`} style={{ fontSize: '1.1rem' }}>
                            {formattedTime || 'No Time'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Runner Stats Previews */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span><i className="fas fa-running"></i> Runner Stats Previews</span>
              <div>
                <small className="text-muted me-2">Live Updates</small>
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setLastUpdate(Date.now())}
                >
                  <i className="fas fa-sync-alt me-1"></i> Refresh All
                </button>
              </div>
            </div>
            <div className="card-body">
              {runnersWithUsernames.length === 0 ? (
                <div className="text-center text-muted p-4">
                  No runners with therun.gg usernames set
                </div>
              ) : (
                <div className="row">
                  {runnersWithUsernames.map((runner) => {
                    const stats = runnerStats[runner.id];
                    const isLoading = loading[runner.id];
                    const hasError = stats && stats.error;
                    const isLive = stats && !stats.error;
                    
                    return (
                      <div key={runner.id} className="col-12 mb-3">
                        <div className="card">
                          <div className="card-header py-2 d-flex justify-content-between align-items-center">
                            <small className="fw-bold">
                              {runner.name || 'Unnamed Runner'} 
                              {runner.therunUsername && ` (@${runner.therunUsername})`}
                            </small>
                            <div className="d-flex align-items-center">
                              {isLoading && (
                                <span className="badge bg-warning me-2">
                                  <i className="fas fa-spinner fa-spin me-1"></i>Loading
                                </span>
                              )}
                              {isLive && (
                                <span className="badge bg-success">LIVE</span>
                              )}
                              {hasError && (
                                <span className="badge bg-danger">Error</span>
                              )}
                            </div>
                          </div>
                          <div 
                            className="card-body p-3"
                            style={{
                              backgroundColor: '#1a1a1a',
                              color: 'white',
                              minHeight: '120px',
                              fontFamily: 'Verdana, sans-serif',
                              fontSize: '14px'
                            }}
                          >
                            {isLoading && !stats ? (
                              <div className="text-center">
                                <i className="fas fa-spinner fa-spin me-2"></i>
                                Loading stats for {runner.therunUsername}...
                              </div>
                            ) : hasError ? (
                              <div className="text-warning">
                                <div><i className="fas fa-exclamation-triangle me-2"></i>Unable to load live stats</div>
                                <small className="text-muted">Check username or runner status</small>
                              </div>
                            ) : isLive ? (
                              <div className="runner-stats-preview">
                                <div><strong>Twitch:</strong> {stats.login}</div>
                                <div><strong>Current Split:</strong> {getSplitDisplay(stats)}</div>
                                <div className={stats.delta < 0 ? 'text-success' : 'text-danger'}>
                                  <strong>PB Delta:</strong> {formatDelta(stats.delta)}
                                </div>
                                <div><strong>Best Possible Time:</strong> {formatTime(stats.bestPossible)}</div>
                                <div><strong>Personal Best:</strong> {formatTime(stats.pb)}</div>
                              </div>
                            ) : (
                              <div className="text-muted">Waiting for runner data...</div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Display);