import React from 'react';

const OBSLinks = ({ runnerData }) => {
  // Ensure we always have data to display
  const displayRunners = runnerData.length > 0 ? runnerData : Array(7).fill().map((_, i) => ({
    id: i + 1,
    name: "",
    therunUsername: "",
    time: "",
    validTime: false
  }));

  const copyToClipboard = async (text, message) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(message || 'Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert('Failed to copy to clipboard');
    }
  };

  const copyLeaderboardLink = () => {
    const leaderboardUrl = `${window.location.origin}/obs_leaderboard`;
    copyToClipboard(leaderboardUrl, 'Leaderboard OBS link copied to clipboard');
  };

  const copySingleOBSLink = (runner, slot) => {
    if (!runner.therunUsername) {
      alert(`Cannot copy OBS link for Runner ${slot + 1}: No therun.gg username configured`);
      return;
    }

    const runnerNumber = slot + 1;
    const obsUrl = `${window.location.origin}/obs/runner${runnerNumber}`;
    copyToClipboard(obsUrl, `OBS URL copied for Runner ${runnerNumber}`);
  };

  const copyAllOBSLinks = () => {
    const links = [];
    
    links.push(`Leaderboard: ${window.location.origin}/obs_leaderboard`);
    
    displayRunners.forEach((runner, index) => {
      const runnerNumber = index + 1;
      if (runner.therunUsername) {
        links.push(`Runner ${runnerNumber} (${runner.name || 'Unnamed'}): ${window.location.origin}/obs/runner${runnerNumber}`);
      } else {
        links.push(`Runner ${runnerNumber} (${runner.name || 'Unnamed'}): [No therun.gg username configured]`);
      }
    });
    
    const linksText = links.join('\n');
    copyToClipboard(linksText, `Copied ${links.length} OBS links to clipboard`);
  };

  // Count how many runners have therun.gg usernames
  const runnersWithUsernames = displayRunners.filter(runner => runner.therunUsername).length;

  return (
    <div className="tab-content" id="obsLinksContent">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span><i className="fas fa-link"></i> OBS Links</span>
          <div className="d-flex align-items-center">
            <span className="badge bg-secondary me-2">
              {runnersWithUsernames}/{displayRunners.length} Configured
            </span>
            <button className="btn btn-purple" onClick={copyAllOBSLinks}>
              <i className="fas fa-copy me-1"></i> Copy All Links
            </button>
          </div>
        </div>
        <div className="card-body p-0">
          <div id="obsLinksContainer">
            {/* Leaderboard Link */}
            <div className="obs-link-row">
              <div className="obs-link-item d-flex justify-content-between align-items-center p-3 border-bottom">
                <div className="obs-link-info flex-grow-1">
                  <div className="d-flex align-items-center mb-1">
                    <span className="badge bg-purple me-2">LB</span>
                    <div>
                      <div className="runner-name-display fw-bold">Leaderboard</div>
                      <div className="therun-username-display text-muted small">Live standings display</div>
                    </div>
                  </div>
                  <div className="obs-url-display small mt-2">
                    {`${window.location.origin}/obs_leaderboard`}
                  </div>
                </div>
                <div className="obs-link-actions ms-3">
                  <button className="btn btn-sm btn-purple" onClick={copyLeaderboardLink}>
                    <i className="fas fa-copy me-1"></i> Copy Link
                  </button>
                </div>
              </div>
            </div>

            {/* Runner Links */}
            {displayRunners.map((runner, index) => {
              const runnerNumber = index + 1;
              const obsUrl = `${window.location.origin}/obs/runner${runnerNumber}`;
              const hasUsername = !!runner.therunUsername;
              const badgeClass = hasUsername ? 'bg-purple' : 'bg-secondary';
              const buttonClass = hasUsername ? 'btn-purple' : 'btn-secondary';
              const isButtonDisabled = !hasUsername;

              return (
                <div key={runner.id || index} className="obs-link-row">
                  <div className="obs-link-item d-flex justify-content-between align-items-center p-3 border-bottom">
                    <div className="obs-link-info flex-grow-1">
                      <div className="d-flex align-items-center mb-1">
                        <span className={`badge ${badgeClass} me-2`}>{runnerNumber}</span>
                        <div>
                          <div className="runner-name-display fw-bold">{runner.name || 'Unnamed Runner'}</div>
                          <div className="therun-username-display text-muted small">
                            {hasUsername ? `therun.gg: ${runner.therunUsername}` : 'No therun.gg username configured'}
                          </div>
                        </div>
                      </div>
                      <div className="obs-url-display small mt-2">
                        {obsUrl}
                        {!hasUsername && (
                          <span className="text-warning ms-2">
                            <i className="fas fa-exclamation-triangle me-1"></i>
                            Requires therun.gg username
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="obs-link-actions ms-3">
                      <button 
                        className={`btn btn-sm ${buttonClass}`} 
                        onClick={() => copySingleOBSLink(runner, index)}
                        disabled={isButtonDisabled}
                        title={isButtonDisabled ? "Add a therun.gg username to enable OBS link" : "Copy OBS link to clipboard"}
                      >
                        <i className="fas fa-copy me-1"></i> Copy Link
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OBSLinks;