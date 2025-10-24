import React, { useState, useEffect } from 'react';

const OBSLeaderboard = ({ fontFamily = 'Verdana, sans-serif' }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatTimeForDisplay = (timeString) => {
    if (!timeString) return 'No Time';
    
    const pattern = /^(\d{1,2}):([0-5]\d):([0-5]\d)\.(\d{3})$/;
    const match = timeString.match(pattern);
    
    if (!match) return timeString;
    
    let hours = parseInt(match[1]);
    let minutes = parseInt(match[2]);
    let seconds = parseInt(match[3]);
    const milliseconds = match[4];
    
    let result = '';
    
    if (hours > 0) {
      result += hours + ':';
      result += minutes.toString().padStart(2, '0') + ':';
      result += seconds.toString().padStart(2, '0') + '.';
    } else if (minutes > 0) {
      result += minutes + ':';
      result += seconds.toString().padStart(2, '0') + '.';
    } else {
      result += seconds + '.';
    }
    
    result += milliseconds;
    return result;
  };

  const fetchLeaderboardData = async () => {
    try {
      const response = await fetch('/api/runners/leaderboard_data');
      
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard data');
      }
      
      const data = await response.json();
      setLeaderboardData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setLeaderboardData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();
    
    // Update every second
    const interval = setInterval(fetchLeaderboardData, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Apply custom font and full background to the component
  const containerStyle = {
    fontFamily: fontFamily,
    fontSize: '16px',
    color: '#ffffff',
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
    width: '100vw',
    height: '100vh',
    margin: 0,
    padding: 0,
    position: 'fixed',
    top: 0,
    left: 0
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div className="leaderboard loading" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
          Loading leaderboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div className="leaderboard error" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div className="leaderboard">
        {leaderboardData.length === 0 ? (
          <div className="position" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
            <div className="placement-name">No runners with names entered</div>
          </div>
        ) : (
          leaderboardData.map((runner, index) => {
            const formattedTime = formatTimeForDisplay(runner.time);
            // Display runner name exactly as entered
            const displayName = runner.name;
            
            return (
              <div key={index} className="position">
                <div className="placement-name">
                  {index + 1}. {displayName}
                </div>
                <div className={`perf-time ${!runner.validTime ? 'no-time' : ''}`}>
                  {formattedTime || 'No Time'}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OBSLeaderboard;