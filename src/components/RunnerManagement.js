import React, { useState, useEffect } from 'react';
import RunnerSlot from './RunnerSlot';

const RunnerManagement = ({ runnerData, onSaveRunner, onClearSlot }) => {
  const [localRunnerData, setLocalRunnerData] = useState([]);

  // Initialize local state when runnerData changes
  useEffect(() => {
    setLocalRunnerData(runnerData);
  }, [runnerData]);

  // Ensure we always have exactly 7 runner slots
  const displayRunners = localRunnerData.length > 0 ? localRunnerData : Array(7).fill().map((_, i) => ({
    id: i + 1,
    name: "",
    therunUsername: "",
    time: "",
    validTime: false
  }));

  const handleSaveRunner = (slot, updatedRunner) => {
    const newData = [...localRunnerData];
    newData[slot] = updatedRunner;
    setLocalRunnerData(newData);
    onSaveRunner(slot, updatedRunner);
  };

  const handleClearSlot = (slot) => {
    const newData = [...localRunnerData];
    newData[slot] = {
      id: slot + 1,
      name: "",
      therunUsername: "",
      time: "",
      validTime: false
    };
    setLocalRunnerData(newData);
    onClearSlot(slot);
  };

  return (
    <div className="tab-content" id="runnersContent">
      <div className="card">
        <div className="card-header">
          <i className="fas fa-running"></i> Runner Management
        </div>
        <div className="card-body">
          <div className="row" id="runnerSlots">
            {displayRunners.map((runner, index) => (
              <div key={runner.id || index} className="col-12 mb-4">
                <RunnerSlot
                  runner={runner}
                  slot={index}
                  onSave={handleSaveRunner}
                  onClear={handleClearSlot}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunnerManagement;