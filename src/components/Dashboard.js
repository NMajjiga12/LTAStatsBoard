import React from 'react';
import RunnerManagement from './RunnerManagement';
import OBSLinks from './OBSLinks';
import Display from './Display';
import FontSettings from './FontSettings';

const Dashboard = ({ 
  activeTab, 
  onTabChange, 
  runnerData, 
  leaderboardData, 
  onSaveRunner, 
  onClearSlot,
  onUpdateLeaderboard,
  fontSettings,
  onFontChange,
  onResetFonts,
  fontLoading = false
}) => {
  return (
    <>
      <div className="header">
        <div className="container">
          <div className="row align-items-center py-2">
            <div className="col-md-6">
              <h1 className="mb-0"><i className="fas fa-stopwatch me-2"></i>Time Attack Dashboard</h1>
            </div>
            <div className="col-md-6 text-end">
              <div className="btn-group" role="group">
                <button 
                  type="button" 
                  className={`btn btn-outline-light ${activeTab === 'runners' ? 'active' : ''}`}
                  onClick={() => onTabChange('runners')}
                >
                  <i className="fas fa-running me-1"></i> Runners
                </button>
                <button 
                  type="button" 
                  className={`btn btn-outline-light ${activeTab === 'obsLinks' ? 'active' : ''}`}
                  onClick={() => onTabChange('obsLinks')}
                >
                  <i className="fas fa-link me-1"></i> OBS Links
                </button>
                <button 
                  type="button" 
                  className={`btn btn-outline-light ${activeTab === 'display' ? 'active' : ''}`}
                  onClick={() => {
                    onTabChange('display');
                    onUpdateLeaderboard();
                  }}
                >
                  <i className="fas fa-tv me-1"></i> Display
                </button>
                <button 
                  type="button" 
                  className={`btn btn-outline-light ${activeTab === 'fonts' ? 'active' : ''}`}
                  onClick={() => onTabChange('fonts')}
                >
                  <i className="fas fa-font me-1"></i> Fonts
                  {fontLoading && <span className="ms-1 spinner-border spinner-border-sm" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-4">
        {/* Tab Content */}
        {activeTab === 'runners' && (
          <RunnerManagement 
            runnerData={runnerData}
            onSaveRunner={onSaveRunner}
            onClearSlot={onClearSlot}
          />
        )}

        {activeTab === 'obsLinks' && (
          <OBSLinks runnerData={runnerData} />
        )}

        {activeTab === 'display' && (
          <Display 
            leaderboardData={leaderboardData}
            runnerData={runnerData}
          />
        )}

        {activeTab === 'fonts' && (
          <FontSettings 
            fontSettings={fontSettings}
            onFontChange={onFontChange}
            onResetFonts={onResetFonts}
            fontLoading={fontLoading}
          />
        )}
      </div>
    </>
  );
};

export default Dashboard;