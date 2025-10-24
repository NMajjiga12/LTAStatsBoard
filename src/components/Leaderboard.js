import React from 'react';

const Leaderboard = ({ leaderboardData }) => {
  const formatTimeForDisplay = (timeString) => {
    if (!timeString) return 'No time';
    
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

  return (
    <div className="tab-content" id="leaderboardContent">
      <div className="card">
        <div className="card-header">
          <i className="fas fa-trophy"></i> Current Standings
        </div>
        <div className="card-body p-0">
          <div id="leaderboardList">
            {leaderboardData.length === 0 ? (
              <div className="p-3 text-center text-muted">No runners with valid times</div>
            ) : (
              leaderboardData.map((runner, index) => {
                const formattedTime = formatTimeForDisplay(runner.time);
                const positionClass = index < 3 ? `position-${index + 1}` : 'position-other';
                
                return (
                  <div key={index} className="leaderboard-item d-flex align-items-center">
                    <div className={`position-badge ${positionClass}`}>{index + 1}</div>
                    <div className="flex-grow-1">
                      <div className="fw-bold">{runner.name}</div>
                      <div className="small text-muted">{runner.therunUsername || 'No therun.gg username'}</div>
                    </div>
                    <div className="text-end">
                      <div className={`fw-bold ${runner.validTime ? '' : 'text-danger'}`}>
                        {formattedTime || 'No time'}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;