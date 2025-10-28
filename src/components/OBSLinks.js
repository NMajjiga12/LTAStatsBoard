import React from 'react';

const OBSLinks = ({ runnerData, commentatorData = [] }) => {
  // Ensure we always have data to display
  const displayRunners = runnerData.length > 0 ? runnerData : Array(7).fill().map((_, i) => ({
    id: i + 1,
    name: "",
    therunUsername: "",
    time: "",
    validTime: false
  }));

  const displayCommentators = commentatorData.length > 0 ? commentatorData : Array(3).fill().map((_, i) => ({
    id: i + 1,
    name: "",
    handle: "",
    pfpLink: "",
    enabled: false
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

    displayCommentators.forEach((commentator, index) => {
      const commentatorNumber = index + 1;
      if (commentator.enabled) {
        links.push(`Commentator ${commentatorNumber} (${commentator.name}): ${window.location.origin}/commentator/${commentatorNumber}`);
      } else {
        links.push(`Commentator ${commentatorNumber} (${commentator.name || 'Unnamed'}): [Not configured]`);
      }
    });
    
    const linksText = links.join('\n');
    copyToClipboard(linksText, `Copied ${links.length} OBS links to clipboard`);
  };

  const copyCommentatorLinks = () => {
    const links = [];
    
    displayCommentators.forEach((commentator, index) => {
      const commentatorNumber = index + 1;
      if (commentator.enabled) {
        links.push(`Commentator ${commentatorNumber} (${commentator.name}): ${window.location.origin}/commentator/${commentatorNumber}`);
      } else {
        links.push(`Commentator ${commentatorNumber} (${commentator.name || 'Unnamed'}): [Not configured]`);
      }
    });
    
    const linksText = links.join('\n');
    copyToClipboard(linksText, `Copied ${links.length} commentator links to clipboard`);
  };

  const copyRunnerLinks = () => {
    const links = [];
    
    displayRunners.forEach((runner, index) => {
      const runnerNumber = index + 1;
      if (runner.therunUsername) {
        links.push(`Runner ${runnerNumber} (${runner.name || 'Unnamed'}): ${window.location.origin}/obs/runner${runnerNumber}`);
      } else {
        links.push(`Runner ${runnerNumber} (${runner.name || 'Unnamed'}): [No therun.gg username configured]`);
      }
    });
    
    const linksText = links.join('\n');
    copyToClipboard(linksText, `Copied ${links.length} runner links to clipboard`);
  };

  // Count how many runners have therun.gg usernames
  const runnersWithUsernames = displayRunners.filter(runner => runner.therunUsername).length;
  const enabledCommentators = displayCommentators.filter(commentator => commentator.enabled).length;

  return (
    <div className="tab-content" id="obsLinksContent">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span><i className="fas fa-link"></i> OBS Links</span>
          <div className="d-flex align-items-center">
            <span className="badge bg-secondary me-2">
              {runnersWithUsernames}/{displayRunners.length} Runners
            </span>
            <span className="badge bg-info me-2">
              {enabledCommentators}/{displayCommentators.length} Commentators
            </span>
            <button className="btn btn-purple me-2" onClick={copyRunnerLinks}>
              <i className="fas fa-running me-1"></i> Copy Runner Links
            </button>
            <button className="btn btn-info me-2" onClick={copyCommentatorLinks}>
              <i className="fas fa-microphone me-1"></i> Copy Commentator Links
            </button>
            <button className="btn btn-primary" onClick={copyAllOBSLinks}>
              <i className="fas fa-copy me-1"></i> Copy All Links
            </button>
          </div>
        </div>
        <div className="card-body p-0">
          <div id="obsLinksContainer">
            {/* Leaderboard Link - FIRST */}
            <div className="border-bottom">
              <div className="bg-purple text-white p-3">
                <h6 className="mb-0">
                  <i className="fas fa-trophy me-2"></i>Leaderboard Link
                </h6>
              </div>
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
            </div>

            {/* Runner Links - SECOND */}
            <div className="border-bottom">
              <div className="bg-primary text-white p-3">
                <h6 className="mb-0">
                  <i className="fas fa-running me-2"></i>Runner Links
                </h6>
              </div>
              {displayRunners.map((runner, index) => {
                const runnerNumber = index + 1;
                const obsUrl = `${window.location.origin}/obs/runner${runnerNumber}`;
                const hasUsername = !!runner.therunUsername;
                const badgeClass = hasUsername ? 'bg-primary' : 'bg-secondary';
                const buttonClass = hasUsername ? 'btn-primary' : 'btn-secondary';
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

            {/* Commentator Links - THIRD */}
            <div className="border-bottom">
              <div className="bg-info text-white p-3">
                <h6 className="mb-0">
                  <i className="fas fa-microphone me-2"></i>Commentator Links
                </h6>
              </div>
              {displayCommentators.map((commentator, index) => {
                const commentatorNumber = index + 1;
                const commentatorUrl = `${window.location.origin}/commentator/${commentatorNumber}`;
                const isEnabled = commentator.enabled;
                const badgeClass = isEnabled ? 'bg-info' : 'bg-secondary';
                const buttonClass = isEnabled ? 'btn-info' : 'btn-secondary';

                return (
                  <div key={`commentator-${index}`} className="obs-link-row">
                    <div className="obs-link-item d-flex justify-content-between align-items-center p-3 border-bottom">
                      <div className="obs-link-info flex-grow-1">
                        <div className="d-flex align-items-center mb-1">
                          <span className={`badge ${badgeClass} me-2`}>C{commentatorNumber}</span>
                          <div>
                            <div className="runner-name-display fw-bold">{commentator.name || 'Unnamed Commentator'}</div>
                            <div className="therun-username-display text-muted small">
                              {commentator.handle ? `@${commentator.handle}` : 'No handle configured'}
                            </div>
                          </div>
                        </div>
                        <div className="obs-url-display small mt-2">
                          {commentatorUrl}
                          {!isEnabled && (
                            <span className="text-warning ms-2">
                              <i className="fas fa-exclamation-triangle me-1"></i>
                              Requires name, handle, and profile picture
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="obs-link-actions ms-3">
                        <button 
                          className={`btn btn-sm ${buttonClass}`} 
                          onClick={() => copyToClipboard(commentatorUrl, `Commentator ${commentatorNumber} OBS URL copied`)}
                          disabled={!isEnabled}
                          title={!isEnabled ? "Configure all commentator fields to enable OBS link" : "Copy OBS link to clipboard"}
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
    </div>
  );
};

export default OBSLinks;