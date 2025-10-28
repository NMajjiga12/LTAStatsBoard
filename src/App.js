// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import OBSRunner from './components/OBSRunner';
import OBSLeaderboard from './components/OBSLeaderboard';
import OBSCommentator from './components/OBSCommentator';
import { getRunners, saveRunners, getLeaderboardData, getCommentators, saveCommentators } from './services/api';
import './styles/App.css';

// Font service for async operations
const FontService = {
  saveFontSettings: async (fontSettings) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem('fontSettings', JSON.stringify(fontSettings));
        resolve({ success: true });
      }, 100);
    });
  },

  loadFontSettings: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const savedFonts = localStorage.getItem('fontSettings');
        if (savedFonts) {
          const parsed = JSON.parse(savedFonts);
          resolve({
            obsRunnerFont: parsed.obsRunnerFont || 'Verdana, sans-serif',
            obsLeaderboardFont: parsed.obsLeaderboardFont || 'Verdana, sans-serif',
            obsRunnerColor: parsed.obsRunnerColor || '#ffffff',
            obsLeaderboardColor: parsed.obsLeaderboardColor || '#ffffff'
          });
        } else {
          resolve({
            obsRunnerFont: 'Verdana, sans-serif',
            obsLeaderboardFont: 'Verdana, sans-serif',
            obsRunnerColor: '#ffffff',
            obsLeaderboardColor: '#ffffff'
          });
        }
      }, 100);
    });
  }
};

// Main app content that conditionally renders based on route
function AppContent() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('runners');
  const [runnerData, setRunnerData] = useState([]);
  const [commentatorData, setCommentatorData] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fontSettings, setFontSettings] = useState({
    obsRunnerFont: 'Verdana, sans-serif',
    obsLeaderboardFont: 'Verdana, sans-serif',
    obsRunnerColor: '#ffffff',
    obsLeaderboardColor: '#ffffff'
  });
  const [fontLoading, setFontLoading] = useState(false);

  // Check if we're on an OBS route
  const isOBSRoute = location.pathname.startsWith('/obs') || location.pathname.startsWith('/commentator');

  // Load font settings asynchronously
  useEffect(() => {
    const loadFonts = async () => {
      setFontLoading(true);
      try {
        const savedFonts = await FontService.loadFontSettings();
        setFontSettings(savedFonts);
      } catch (error) {
        console.error('Failed to load font settings:', error);
      } finally {
        setFontLoading(false);
      }
    };

    loadFonts();
  }, []);

  // Save font settings asynchronously when they change
  useEffect(() => {
    const saveFonts = async () => {
      if (fontLoading) return;
      
      try {
        await FontService.saveFontSettings(fontSettings);
      } catch (error) {
        console.error('Failed to save font settings:', error);
      }
    };

    saveFonts();
  }, [fontSettings, fontLoading]);

  // Initialize with default runner data if empty
  const initializeDefaultRunners = useCallback(() => {
    return Array(7).fill().map((_, index) => ({
      id: index + 1,
      name: "",
      therunUsername: "",
      time: "",
      validTime: false
    }));
  }, []);

  // Initialize with default commentator data if empty
  const initializeDefaultCommentators = useCallback(() => {
    return Array(3).fill().map((_, index) => ({
      id: index + 1,
      name: "",
      handle: "",
      discordId: "",
      enabled: false
    }));
  }, []);

  const updateLeaderboard = useCallback(async () => {
    try {
      const data = await getLeaderboardData();
      setLeaderboardData(data);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    }
  }, []);

  const loadCommentators = async () => {
    try {
      const commentators = await getCommentators();
      
      if (!commentators || commentators.length === 0) {
        const defaultCommentators = initializeDefaultCommentators();
        setCommentatorData(defaultCommentators);
        await saveCommentators(defaultCommentators);
      } else {
        setCommentatorData(commentators);
      }
    } catch (error) {
      console.error('Failed to load commentators:', error);
      const defaultCommentators = initializeDefaultCommentators();
      setCommentatorData(defaultCommentators);
    }
  };

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const runners = await getRunners();
      
      if (!runners || runners.length === 0) {
        const defaultRunners = initializeDefaultRunners();
        setRunnerData(defaultRunners);
        await saveRunners(defaultRunners);
      } else {
        setRunnerData(runners);
      }
      
      await loadCommentators();
      await updateLeaderboard();
    } catch (error) {
      console.error('Failed to load data:', error);
      const defaultRunners = initializeDefaultRunners();
      setRunnerData(defaultRunners);
      const defaultCommentators = initializeDefaultCommentators();
      setCommentatorData(defaultCommentators);
    } finally {
      setIsLoading(false);
    }
  }, [initializeDefaultRunners, initializeDefaultCommentators, updateLeaderboard]);

  useEffect(() => {
    if (!isOBSRoute) {
      loadData();
    }
  }, [isOBSRoute, loadData]);

  const handleSaveRunner = async (slot, updatedRunner) => {
    try {
      // Update local state immediately for responsive UI
      const newData = [...runnerData];
      newData[slot] = updatedRunner;
      setRunnerData(newData);
      
      // Save to server
      await saveRunners(newData);
      
      // Update leaderboard with fresh data from server
      await updateLeaderboard();
      
      // Trigger update event for OBS endpoints
      setTimeout(() => {
        const refreshEvent = new CustomEvent('runnerDataUpdated', {
          detail: {
            timestamp: Date.now()
          }
        });
        window.dispatchEvent(refreshEvent);
      }, 100);
      
    } catch (error) {
      console.error('Failed to save runner:', error);
      alert('Failed to save runner: ' + error.message);
      
      // Reload data to ensure consistency
      await loadData();
    }
  };

  const handleClearSlot = async (slot) => {
    try {
      const newData = [...runnerData];
      newData[slot] = {
        id: slot + 1,
        name: "",
        therunUsername: "",
        time: "",
        validTime: false
      };
      setRunnerData(newData);
      
      await saveRunners(newData);
      await updateLeaderboard();
      
      // Trigger update event for OBS endpoints
      setTimeout(() => {
        const refreshEvent = new CustomEvent('runnerDataUpdated', {
          detail: {
            timestamp: Date.now()
          }
        });
        window.dispatchEvent(refreshEvent);
      }, 100);
      
    } catch (error) {
      console.error('Failed to clear slot:', error);
      alert('Failed to clear slot: ' + error.message);
      await loadData();
    }
  };

  const handleSaveCommentator = async (slot, updatedCommentator) => {
    try {
      // Update local state immediately for responsive UI
      const newData = [...commentatorData];
      newData[slot] = updatedCommentator;
      setCommentatorData(newData);
      
      // Save to server
      await saveCommentators(newData);
      
    } catch (error) {
      console.error('Failed to save commentator:', error);
      alert('Failed to save commentator: ' + error.message);
      
      // Reload data to ensure consistency
      const originalData = await getCommentators();
      setCommentatorData(originalData);
    }
  };

  const handleClearCommentatorSlot = async (slot) => {
    try {
      const newData = [...commentatorData];
      newData[slot] = {
        id: slot + 1,
        name: "",
        handle: "",
        pfpLink: "",
        enabled: false
      };
      setCommentatorData(newData);
      
      await saveCommentators(newData);
      
    } catch (error) {
      console.error('Failed to clear commentator slot:', error);
      alert('Failed to clear commentator slot: ' + error.message);
      
      const originalData = await getCommentators();
      setCommentatorData(originalData);
    }
  };

  const handleFontChange = useCallback(async (component, value) => {
    setFontSettings(prevSettings => ({
      ...prevSettings,
      [component]: value
    }));
  }, []);

  const resetFonts = useCallback(async () => {
    const defaultSettings = {
      obsRunnerFont: 'Verdana, sans-serif',
      obsLeaderboardFont: 'Verdana, sans-serif',
      obsRunnerColor: '#ffffff',
      obsLeaderboardColor: '#ffffff'
    };
    setFontSettings(defaultSettings);
  }, []);

  // Render OBS routes
  if (isOBSRoute) {
    return (
      <Routes>
        <Route path="/obs_leaderboard" element={
          <OBSLeaderboard 
            fontFamily={fontSettings.obsLeaderboardFont} 
            textColor={fontSettings.obsLeaderboardColor}
          />
        } />
        <Route path="/obs/:username" element={
          <OBSRunnerWrapper 
            fontFamily={fontSettings.obsRunnerFont} 
            textColor={fontSettings.obsRunnerColor}
          />
        } />
        <Route path="/commentator/:commentatorNumber" element={
          <OBSCommentatorWrapper 
            fontFamily={fontSettings.obsRunnerFont} 
            textColor={fontSettings.obsRunnerColor}
          />
        } />
      </Routes>
    );
  }

  if (isLoading) {
    return (
      <div className="App">
        <div className="header">
          <div className="container">
            <div className="row align-items-center py-2">
              <div className="col-md-6">
                <h1 className="mb-0"><i className="fas fa-stopwatch me-2"></i>Time Attack Dashboard</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="container mt-4 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Dashboard
        activeTab={activeTab}
        onTabChange={setActiveTab}
        runnerData={runnerData}
        commentatorData={commentatorData}
        leaderboardData={leaderboardData}
        onSaveRunner={handleSaveRunner}
        onSaveCommentator={handleSaveCommentator}
        onClearSlot={handleClearSlot}
        onClearCommentatorSlot={handleClearCommentatorSlot}
        onUpdateLeaderboard={updateLeaderboard}
        fontSettings={fontSettings}
        onFontChange={handleFontChange}
        onResetFonts={resetFonts}
        fontLoading={fontLoading}
      />
    </div>
  );
}

// Wrapper component to extract username from URL params for OBSRunner
function OBSRunnerWrapper({ fontFamily, textColor }) {
  const location = useLocation();
  const username = location.pathname.split('/').pop();
  
  return <OBSRunner username={username} fontFamily={fontFamily} textColor={textColor} />;
}

// Wrapper component to extract commentatorNumber from URL params for OBSCommentator
function OBSCommentatorWrapper({ fontFamily, textColor }) {
  const location = useLocation();
  const commentatorNumber = location.pathname.split('/').pop();
  
  return <OBSCommentator commentatorNumber={commentatorNumber} fontFamily={fontFamily} textColor={textColor} />;
}

// Main App component with Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;