// src/components/RunnerSlot.js
import React, { useState, useEffect } from 'react';
import { formatTimeForDisplay } from '../utils/timeFormat';

const RunnerSlot = ({ runner, slot, onSave, onClear }) => {
  const [name, setName] = useState(runner.name || '');
  const [therunUsername, setTherunUsername] = useState(runner.therunUsername || '');
  const [time, setTime] = useState(runner.time || '');
  const [validTime, setValidTime] = useState(runner.validTime || false);
  const [isEditing, setIsEditing] = useState(false);

  // Initialize state when runner prop changes
  useEffect(() => {
    setName(runner.name || '');
    setTherunUsername(runner.therunUsername || '');
    setTime(runner.time || '');
    setValidTime(runner.validTime || false);
    // Start in non-edit mode if there's existing data, otherwise start in edit mode
    setIsEditing(!runner.name && !runner.therunUsername && !runner.time);
  }, [runner]);

  const validateTimeFormat = (timeString) => {
    if (!timeString) return false;
    
    const pattern = /^(\d{1,2}):([0-5]\d):([0-5]\d)\.(\d{3})$/;
    const match = timeString.match(pattern);
    
    if (!match) return false;
    
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const seconds = parseInt(match[3], 10);
    const milliseconds = parseInt(match[4], 10);
    
    // Validate ranges
    if (hours < 0 || hours > 99) return false;
    if (minutes < 0 || minutes > 59) return false;
    if (seconds < 0 || seconds > 59) return false;
    if (milliseconds < 0 || milliseconds > 999) return false;
    
    return true;
  };

  const handleTimeChange = (newTime) => {
    setTime(newTime);
    setValidTime(validateTimeFormat(newTime));
  };

  const handleSave = () => {
    onSave(slot, {
      ...runner,
      name,
      therunUsername,
      time,
      validTime
    });
    setIsEditing(false); // Switch to non-edit mode after saving
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // If currently editing, save and switch to view mode
      handleSave();
    } else {
      // If currently viewing, switch to edit mode
      setIsEditing(true);
    }
  };

  const handleClear = () => {
    setName('');
    setTherunUsername('');
    setTime('');
    setValidTime(false);
    onClear(slot);
    setIsEditing(true); // Stay in edit mode after clearing
  };

  const getTimeInputClass = () => {
    if (!time) return 'time-missing';
    return validTime ? 'time-valid' : 'time-invalid';
  };

  const getFieldClass = (fieldType = 'default') => {
    return isEditing ? `field-editing field-${fieldType}` : `field-saved field-${fieldType}`;
  };

  const hasData = name || therunUsername || time;

  return (
    <div className={`card runner-slot ${isEditing ? 'editing' : 'saved'}`}>
      <div className="card-body">
        <div className="row align-items-start">
          {/* Slot Number */}
          <div className="col-md-1">
            <div className="d-flex align-items-center justify-content-center h-100">
              <span className="badge bg-primary fs-6">Slot {slot + 1}</span>
            </div>
          </div>
          
          {/* Runner Name */}
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label fw-bold">Runner Name</label>
              <input 
                type="text" 
                className={`form-control runner-name-input ${getFieldClass('name')}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter runner name"
                readOnly={!isEditing}
              />
            </div>
          </div>
          
          {/* therun.gg Username */}
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label fw-bold">therun.gg Username</label>
              <input 
                type="text" 
                className={`form-control therun-username-input ${getFieldClass('username')}`}
                value={therunUsername}
                onChange={(e) => setTherunUsername(e.target.value)}
                placeholder="Enter therun.gg username"
                readOnly={!isEditing}
              />
            </div>
          </div>
          
          {/* Event Personal Best */}
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label fw-bold">Event Personal Best</label>
              <input 
                type="text" 
                className={`form-control time-input ${getFieldClass('time')} ${getTimeInputClass()}`}
                value={time}
                onChange={(e) => handleTimeChange(e.target.value)}
                placeholder="00:00:00.000"
                readOnly={!isEditing}
              />
              {isEditing && time && !validTime && (
                <div className="form-text text-danger small">
                  Invalid time format. Use HH:MM:SS.MMM (e.g., 00:47:12.563)
                </div>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="col-md-2">
            <div className="d-flex flex-column gap-2 h-100 justify-content-center">
              {/* Toggle Edit/Save Button */}
              <button 
                className={`btn ${isEditing ? 'btn-success' : 'btn-primary'} edit-save-btn`} 
                onClick={handleEditToggle}
              >
                <i className={`fas ${isEditing ? 'fa-save' : 'fa-edit'} me-1`}></i> 
                {isEditing ? 'Save' : 'Edit'}
              </button>
              
              {/* Clear Button - Only show when editing or if there's data */}
              {(isEditing || hasData) && (
                <button 
                  className="btn btn-outline-danger clear-btn" 
                  onClick={handleClear}
                >
                  <i className="fas fa-times me-1"></i> Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunnerSlot;