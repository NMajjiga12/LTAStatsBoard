// src/components/FontSettings.js
import React, { useState, useEffect } from 'react';

const FontSettings = ({ fontSettings, onFontChange, onResetFonts, fontLoading = false }) => {
  const [localSettings, setLocalSettings] = useState({
    obsRunnerFont: 'Verdana, sans-serif',
    obsLeaderboardFont: 'Verdana, sans-serif',
    obsRunnerColor: '#ffffff',
    obsLeaderboardColor: '#ffffff'
  });
  const [savingRunner, setSavingRunner] = useState(false);
  const [savingLeaderboard, setSavingLeaderboard] = useState(false);

  // Update local settings when prop changes
  useEffect(() => {
    if (fontSettings) {
      setLocalSettings({
        obsRunnerFont: fontSettings.obsRunnerFont || 'Verdana, sans-serif',
        obsLeaderboardFont: fontSettings.obsLeaderboardFont || 'Verdana, sans-serif',
        obsRunnerColor: fontSettings.obsRunnerColor || '#ffffff',
        obsLeaderboardColor: fontSettings.obsLeaderboardColor || '#ffffff'
      });
    }
  }, [fontSettings]);

  const commonFonts = [
    'Verdana, sans-serif',
    'Arial, sans-serif',
    'Helvetica, sans-serif',
    'Tahoma, sans-serif',
    'Trebuchet MS, sans-serif',
    'Georgia, serif',
    'Times New Roman, serif',
    'Courier New, monospace',
    'Impact, sans-serif',
    'Comic Sans MS, cursive',
    'Arial Black, sans-serif',
    'Lucida Sans Unicode, sans-serif'
  ];

  const handleSettingChange = (setting, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveRunner = async () => {
    if (savingRunner || fontLoading) return;
    
    setSavingRunner(true);
    try {
      // Save both settings sequentially to avoid race conditions
      await onFontChange('obsRunnerFont', localSettings.obsRunnerFont);
      await onFontChange('obsRunnerColor', localSettings.obsRunnerColor);
      
      // Small delay to show success state
      setTimeout(() => {
        setSavingRunner(false);
      }, 500);
    } catch (error) {
      console.error('Failed to save runner settings:', error);
      setSavingRunner(false);
      alert('Failed to save OBS Runner settings. Please try again.');
    }
  };

  const handleSaveLeaderboard = async () => {
    if (savingLeaderboard || fontLoading) return;
    
    setSavingLeaderboard(true);
    try {
      // Save both settings sequentially to avoid race conditions
      await onFontChange('obsLeaderboardFont', localSettings.obsLeaderboardFont);
      await onFontChange('obsLeaderboardColor', localSettings.obsLeaderboardColor);
      
      // Small delay to show success state
      setTimeout(() => {
        setSavingLeaderboard(false);
      }, 500);
    } catch (error) {
      console.error('Failed to save leaderboard settings:', error);
      setSavingLeaderboard(false);
      alert('Failed to save OBS Leaderboard settings. Please try again.');
    }
  };

  const handleReset = async () => {
    if (savingRunner || savingLeaderboard || fontLoading) return;
    
    setSavingRunner(true);
    setSavingLeaderboard(true);
    try {
      await onResetFonts();
      setTimeout(() => {
        setSavingRunner(false);
        setSavingLeaderboard(false);
      }, 500);
    } catch (error) {
      console.error('Failed to reset settings:', error);
      setSavingRunner(false);
      setSavingLeaderboard(false);
      alert('Failed to reset settings. Please try again.');
    }
  };

  const previewStyle = (fontFamily, color) => ({
    fontFamily: fontFamily,
    fontSize: '18px',
    padding: '10px',
    backgroundColor: '#1a1a1a',
    color: color,
    borderRadius: '5px',
    border: '1px solid #333',
    minHeight: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease'
  });

  // Validate hex color
  const isValidHexColor = (color) => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  };

  return (
    <div className="tab-content" id="fontsContent">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span>
            <i className="fas fa-palette"></i> Display Settings
            {fontLoading && <span className="ms-2 spinner-border spinner-border-sm text-primary" />}
          </span>
          <div>
            <button 
              className="btn btn-outline-secondary me-2" 
              onClick={handleReset}
              disabled={savingRunner || savingLeaderboard || fontLoading}
            >
              {savingRunner || savingLeaderboard ? (
                <><span className="spinner-border spinner-border-sm me-1" /> Resetting...</>
              ) : (
                <><i className="fas fa-undo me-1"></i> Reset All</>
              )}
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            {/* OBS Runner Settings */}
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <span>
                    <i className="fas fa-running me-2"></i> OBS Runner Settings
                  </span>
                  <button 
                    className="btn btn-primary btn-sm" 
                    onClick={handleSaveRunner}
                    disabled={savingRunner || fontLoading}
                  >
                    {savingRunner ? (
                      <><span className="spinner-border spinner-border-sm me-1" /> Saving...</>
                    ) : (
                      <><i className="fas fa-save me-1"></i> Save Runner</>
                    )}
                  </button>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Font for OBS Runner Display</label>
                    <select 
                      className="form-select"
                      value={localSettings.obsRunnerFont}
                      onChange={(e) => handleSettingChange('obsRunnerFont', e.target.value)}
                      disabled={savingRunner || fontLoading}
                    >
                      {commonFonts.map((font, index) => (
                        <option key={index} value={font}>
                          {font.split(',')[0]}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label fw-bold">Text Color for OBS Runner</label>
                    <div className="input-group">
                      <input 
                        type="color" 
                        className="form-control form-control-color"
                        value={localSettings.obsRunnerColor}
                        onChange={(e) => handleSettingChange('obsRunnerColor', e.target.value)}
                        disabled={savingRunner || fontLoading}
                        title="Choose text color"
                      />
                      <input 
                        type="text" 
                        className="form-control"
                        placeholder="#FFFFFF"
                        value={localSettings.obsRunnerColor}
                        onChange={(e) => handleSettingChange('obsRunnerColor', e.target.value)}
                        disabled={savingRunner || fontLoading}
                        pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                      />
                    </div>
                    {!isValidHexColor(localSettings.obsRunnerColor) && (
                      <div className="form-text text-danger small">
                        Please enter a valid hex color code (e.g., #FFFFFF or #FFF)
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <label className="form-label fw-bold">Preview</label>
                    <div style={previewStyle(localSettings.obsRunnerFont, localSettings.obsRunnerColor)} className="font-preview">
                      Twitch: RunnerName<br />
                      Current Split: Split 3<br />
                      PB Delta: -00:12.45
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* OBS Leaderboard Settings */}
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <span>
                    <i className="fas fa-trophy me-2"></i> OBS Leaderboard Settings
                  </span>
                  <button 
                    className="btn btn-primary btn-sm" 
                    onClick={handleSaveLeaderboard}
                    disabled={savingLeaderboard || fontLoading}
                  >
                    {savingLeaderboard ? (
                      <><span className="spinner-border spinner-border-sm me-1" /> Saving...</>
                    ) : (
                      <><i className="fas fa-save me-1"></i> Save Leaderboard</>
                    )}
                  </button>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Font for OBS Leaderboard</label>
                    <select 
                      className="form-select"
                      value={localSettings.obsLeaderboardFont}
                      onChange={(e) => handleSettingChange('obsLeaderboardFont', e.target.value)}
                      disabled={savingLeaderboard || fontLoading}
                    >
                      {commonFonts.map((font, index) => (
                        <option key={index} value={font}>
                          {font.split(',')[0]}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label fw-bold">Text Color for OBS Leaderboard</label>
                    <div className="input-group">
                      <input 
                        type="color" 
                        className="form-control form-control-color"
                        value={localSettings.obsLeaderboardColor}
                        onChange={(e) => handleSettingChange('obsLeaderboardColor', e.target.value)}
                        disabled={savingLeaderboard || fontLoading}
                        title="Choose text color"
                      />
                      <input 
                        type="text" 
                        className="form-control"
                        placeholder="#FFFFFF"
                        value={localSettings.obsLeaderboardColor}
                        onChange={(e) => handleSettingChange('obsLeaderboardColor', e.target.value)}
                        disabled={savingLeaderboard || fontLoading}
                        pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                      />
                    </div>
                    {!isValidHexColor(localSettings.obsLeaderboardColor) && (
                      <div className="form-text text-danger small">
                        Please enter a valid hex color code (e.g., #FFFFFF or #FFF)
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <label className="form-label fw-bold">Preview</label>
                    <div style={previewStyle(localSettings.obsLeaderboardFont, localSettings.obsLeaderboardColor)} className="font-preview">
                      1. Player One - 00:47:12.563<br />
                      2. Player Two - 00:48:23.123<br />
                      3. Player Three - 00:49:34.456
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <i className="fas fa-info-circle me-2"></i> Settings Information
                </div>
                <div className="card-body">
                  <div className="alert alert-info">
                    <h6><i className="fas fa-lightbulb me-2"></i>Settings Tips:</h6>
                    <ul className="mb-0">
                      <li>Font and color changes are applied to OBS displays immediately after saving</li>
                      <li>Use hex color codes (e.g., #FF0000 for red) or the color picker</li>
                      <li>Changes are automatically saved and persist across browser sessions</li>
                      <li>For best results in OBS, use colors with good contrast against your background</li>
                      <li>Save each section individually using the respective save button</li>
                      <li>Use "Reset All" to restore default settings for both sections</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FontSettings;