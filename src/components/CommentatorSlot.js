import React, { useState, useEffect } from 'react';

const CommentatorSlot = ({ commentator, slot, onSave, onClear, disabled = false }) => {
  const [name, setName] = useState(commentator.name || '');
  const [handle, setHandle] = useState(commentator.handle || '');
  const [discordId, setDiscordId] = useState(commentator.discordId || '');
  const [enabled, setEnabled] = useState(commentator.enabled || false);
  const [isEditing, setIsEditing] = useState(false);

  // Initialize state when commentator prop changes
  useEffect(() => {
    setName(commentator.name || '');
    setHandle(commentator.handle || '');
    setDiscordId(commentator.discordId || '');
    setEnabled(commentator.enabled || false);
  }, [commentator]);

  // Validate if all fields are filled
  const validateFields = () => {
    return name.trim() !== '' && handle.trim() !== '' && discordId.trim() !== '';
  };

  useEffect(() => {
    setEnabled(validateFields());
  }, [name, handle, discordId]);

  const handleSave = async () => {
    if (disabled) return;
    
    const updatedCommentator = {
      ...commentator,
      name,
      handle,
      discordId,
      enabled: validateFields()
    };
    await onSave(slot, updatedCommentator);
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    if (disabled) return;
    
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

  const handleClear = async () => {
    if (disabled) return;
    
    setName('');
    setHandle('');
    setDiscordId('');
    setEnabled(false);
    await onClear(slot);
    setIsEditing(true);
  };

  const getFieldClass = (fieldType = 'default') => {
    return isEditing ? `field-editing field-${fieldType}` : `field-saved field-${fieldType}`;
  };

  const hasData = name || handle || discordId;

  // Generate the full reactive URL from Discord ID
  const getReactiveUrl = () => {
    if (!discordId) return 'https://reactive.fugi.tech/basic/706610731210113044'; // Default avatar
    return `https://reactive.fugi.tech/basic/${discordId}`;
  };

  return (
    <div className={`card commentator-slot ${isEditing ? 'editing' : 'saved'} ${enabled ? 'slot-enabled' : 'slot-disabled'} ${disabled ? 'slot-disabled' : ''}`}>
      <div className="card-body">
        <div className="row align-items-start">
          {/* Slot Number and Status */}
          <div className="col-md-1">
            <div className="d-flex flex-column align-items-center justify-content-center h-100">
              <span className="badge bg-info fs-6 mb-2">Slot {slot + 1}</span>
              <span className={`badge ${enabled ? 'bg-success' : 'bg-warning'} small`}>
                {enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
          
          {/* Commentator Name */}
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label fw-bold">Commentator Name</label>
              <input 
                type="text" 
                className={`form-control commentator-name-input ${getFieldClass('name')}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter commentator name"
                readOnly={!isEditing || disabled}
                disabled={disabled}
              />
            </div>
          </div>
          
          {/* Commentator Handle */}
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label fw-bold">Commentator Handle</label>
              <input 
                type="text" 
                className={`form-control commentator-handle-input ${getFieldClass('handle')}`}
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="Enter commentator handle"
                readOnly={!isEditing || disabled}
                disabled={disabled}
              />
            </div>
          </div>
          
          {/* Discord ID */}
          <div className="col-md-3">
            <div className="mb-3">
              <label className="form-label fw-bold">Discord ID</label>
              <input 
                type="text" 
                className={`form-control discord-id-input ${getFieldClass('discord')}`}
                value={discordId}
                onChange={(e) => setDiscordId(e.target.value)}
                placeholder="Enter Discord ID"
                readOnly={!isEditing || disabled}
                disabled={disabled}
              />
              {isEditing && discordId && (
                <div className="form-text text-muted small">
                  Profile URL: {getReactiveUrl()}
                </div>
              )}
              {isEditing && !discordId && (
                <div className="form-text text-muted small">
                  Will use default avatar if no Discord ID provided
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
                disabled={disabled}
              >
                <i className={`fas ${isEditing ? 'fa-save' : 'fa-edit'} me-1`}></i> 
                {isEditing ? 'Save' : 'Edit'}
                {disabled && <span className="spinner-border spinner-border-sm ms-1"></span>}
              </button>
              
              {/* Clear Button */}
              {(isEditing || hasData) && (
                <button 
                  className="btn btn-outline-danger clear-btn" 
                  onClick={handleClear}
                  disabled={disabled}
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

export default CommentatorSlot;