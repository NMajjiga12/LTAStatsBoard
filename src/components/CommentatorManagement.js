import React, { useState, useEffect } from 'react';
import CommentatorSlot from './CommentatorSlot';

const CommentatorManagement = ({ commentatorData, onSaveCommentator, onClearSlot }) => {
  const [localCommentatorData, setLocalCommentatorData] = useState([]);
  const [saving, setSaving] = useState(false);

  // Initialize local state when commentatorData changes
  useEffect(() => {
    setLocalCommentatorData(commentatorData);
  }, [commentatorData]);

  // Ensure we always have exactly 3 commentator slots
  const displayCommentators = localCommentatorData.length > 0 ? localCommentatorData : Array(3).fill().map((_, i) => ({
    id: i + 1,
    name: "",
    handle: "",
    discordId: "",
    enabled: false
  }));

  const handleSaveCommentator = async (slot, updatedCommentator) => {
    if (saving) return;
    
    setSaving(true);
    try {
      const newData = [...localCommentatorData];
      newData[slot] = updatedCommentator;
      setLocalCommentatorData(newData);
      await onSaveCommentator(slot, updatedCommentator);
    } catch (error) {
      console.error('Error in CommentatorManagement save:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleClearSlot = async (slot) => {
    if (saving) return;
    
    setSaving(true);
    try {
      const newData = [...localCommentatorData];
      newData[slot] = {
        id: slot + 1,
        name: "",
        handle: "",
        discordId: "",
        enabled: false
      };
      setLocalCommentatorData(newData);
      await onClearSlot(slot);
    } catch (error) {
      console.error('Error in CommentatorManagement clear:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="tab-content" id="commentatorsContent">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span><i className="fas fa-microphone"></i> Commentator Management</span>
          {saving && (
            <span className="badge bg-warning">
              <i className="fas fa-spinner fa-spin me-1"></i>Saving...
            </span>
          )}
        </div>
        <div className="card-body">
          <div className="alert alert-info">
            <i className="fas fa-info-circle me-2"></i>
            You can add up to 3 commentators. Each commentator requires a name, handle, and Discord ID to be enabled.
            Profile pictures are automatically generated from Discord IDs using Reactive.
          </div>
          <div className="row" id="commentatorSlots">
            {displayCommentators.map((commentator, index) => (
              <div key={commentator.id || index} className="col-12 mb-4">
                <CommentatorSlot
                  commentator={commentator}
                  slot={index}
                  onSave={handleSaveCommentator}
                  onClear={handleClearSlot}
                  disabled={saving}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentatorManagement;