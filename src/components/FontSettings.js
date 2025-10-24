import React, { useState, useEffect } from 'react';

const FontSettings = ({ fontSettings, onFontChange, onResetFonts, fontLoading = false }) => {
  const [localFonts, setLocalFonts] = useState({
    obsRunnerFont: fontSettings.obsRunnerFont,
    obsLeaderboardFont: fontSettings.obsLeaderboardFont
  });
  const [saving, setSaving] = useState(false);

  // Update local fonts when prop changes
  useEffect(() => {
    setLocalFonts({
      obsRunnerFont: fontSettings.obsRunnerFont,
      obsLeaderboardFont: fontSettings.obsLeaderboardFont
    });
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

  const handleFontChange = (component, font) => {
    setLocalFonts(prev => ({
      ...prev,
      [component]: font
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        onFontChange('obsRunnerFont', localFonts.obsRunnerFont),
        onFontChange('obsLeaderboardFont', localFonts.obsLeaderboardFont)
      ]);
      // Show success feedback
      setTimeout(() => {
        setSaving(false);
        alert('Font settings saved successfully!');
      }, 300);
    } catch (error) {
      setSaving(false);
      alert('Failed to save font settings. Please try again.');
    }
  };

  const handleReset = async () => {
    setSaving(true);
    try {
      await onResetFonts();
      setTimeout(() => {
        setSaving(false);
      }, 300);
    } catch (error) {
      setSaving(false);
      alert('Failed to reset font settings. Please try again.');
    }
  };

  const previewStyle = (fontFamily) => ({
    fontFamily: fontFamily,
    fontSize: '18px',
    padding: '10px',
    backgroundColor: '#1a1a1a',
    color: 'white',
    borderRadius: '5px',
    border: '1px solid #333',
    minHeight: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'font-family 0.3s ease'
  });

  return (
    <div className="tab-content" id="fontsContent">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span>
            <i className="fas fa-font"></i> Font Settings
            {fontLoading && <span className="ms-2 spinner-border spinner-border-sm text-primary" />}
          </span>
          <div>
            <button 
              className="btn btn-outline-secondary me-2" 
              onClick={handleReset}
              disabled={saving || fontLoading}
            >
              {saving ? (
                <><span className="spinner-border spinner-border-sm me-1" /> Resetting...</>
              ) : (
                <><i className="fas fa-undo me-1"></i> Reset to Default</>
              )}
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleSave}
              disabled={saving || fontLoading}
            >
              {saving ? (
                <><span className="spinner-border spinner-border-sm me-1" /> Saving...</>
              ) : (
                <><i className="fas fa-save me-1"></i> Save Fonts</>
              )}
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            {/* OBS Runner Font Settings */}
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header">
                  <i className="fas fa-running me-2"></i> OBS Runner Font
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label fw-bold" style={{color: '#ffffff'}}>Select Font for OBS Runner Display</label>
                    <select 
                      className="form-select"
                      value={localFonts.obsRunnerFont}
                      onChange={(e) => handleFontChange('obsRunnerFont', e.target.value)}
                      disabled={saving || fontLoading}
                    >
                      {commonFonts.map((font, index) => (
                        <option key={index} value={font}>
                          {font.split(',')[0]}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label fw-bold" style={{color: '#ffffff'}}>Custom Font</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="Enter custom font family (e.g., 'Roboto, sans-serif')"
                      value={localFonts.obsRunnerFont}
                      onChange={(e) => handleFontChange('obsRunnerFont', e.target.value)}
                      disabled={saving || fontLoading}
                    />
                    <div className="form-text" style={{color: '#ffffff'}}>
                      Enter any font family available on your system
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="form-label fw-bold" style={{color: '#ffffff'}}>Preview</label>
                    <div style={previewStyle(localFonts.obsRunnerFont)} className="font-preview">
                      Twitch: RunnerName<br />
                      Current Split: Split 3<br />
                      PB Delta: -00:12.45
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* OBS Leaderboard Font Settings */}
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header">
                  <i className="fas fa-trophy me-2"></i> OBS Leaderboard Font
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label fw-bold" style={{color: '#ffffff'}}>Select Font for OBS Leaderboard</label>
                    <select 
                      className="form-select"
                      value={localFonts.obsLeaderboardFont}
                      onChange={(e) => handleFontChange('obsLeaderboardFont', e.target.value)}
                      disabled={saving || fontLoading}
                    >
                      {commonFonts.map((font, index) => (
                        <option key={index} value={font}>
                          {font.split(',')[0]}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label fw-bold" style={{color: '#ffffff'}}>Custom Font</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="Enter custom font family (e.g., 'Roboto, sans-serif')"
                      value={localFonts.obsLeaderboardFont}
                      onChange={(e) => handleFontChange('obsLeaderboardFont', e.target.value)}
                      disabled={saving || fontLoading}
                    />
                    <div className="form-text" style={{color: '#ffffff'}}>
                      Enter any font family available on your system
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="form-label fw-bold" style={{color: '#ffffff'}}>Preview</label>
                    <div style={previewStyle(localFonts.obsLeaderboardFont)} className="font-preview">
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
                  <i className="fas fa-info-circle me-2"></i> Font Information
                </div>
                <div className="card-body">
                  <div className="alert alert-info">
                    <h6><i className="fas fa-lightbulb me-2"></i>Font Usage Tips:</h6>
                    <ul className="mb-0">
                      <li>For custom fonts, ensure the font is installed on the computer running OBS</li>
                      <li>Monospace fonts work well for leaderboards to maintain alignment</li>
                      <li>Changes are automatically saved and persist across browser sessions</li>
                      <li>Font updates happen once you refresh the page</li>
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