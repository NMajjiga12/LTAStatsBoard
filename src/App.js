// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import OBSRunner from './components/OBSRunner';
import OBSLeaderboard from './components/OBSLeaderboard';
import { getRunners, saveRunners, getLeaderboardData } from './services/api';
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
          // Ensure all settings exist with defaults
          resolve({
            obsRunnerFont: parsed.obsRunnerFont || 'Verdana, sans-serif',
            obsLeaderboardFont: parsed.obsLeaderboardFont || 'Verdana, sans-serif',
            obsRunnerColor: parsed.obsRunnerColor || '#ffffff',
            obsLeaderboardColor: parsed.obsLeaderboardColor || '#ffffff'
          });
        } else {
          // Return default settings if nothing is saved
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
  const isOBSRoute = location.pathname.startsWith('/obs');

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

  const updateLeaderboard = useCallback(async () => {
    try {
      const data = await getLeaderboardData();
      setLeaderboardData(data);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    }
  }, []);

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
      
      await updateLeaderboard();
    } catch (error) {
      console.error('Failed to load data:', error);
      const defaultRunners = initializeDefaultRunners();
      setRunnerData(defaultRunners);
    } finally {
      setIsLoading(false);
    }
  }, [initializeDefaultRunners, updateLeaderboard]);

  useEffect(() => {
    if (!isOBSRoute) {
      loadData();
    }
  }, [isOBSRoute, loadData]);

  const handleSaveRunner = async (slot, updatedRunner) => {
    try {
      const newData = [...runnerData];
      newData[slot] = updatedRunner;
      setRunnerData(newData);
      await saveRunners(newData);
      await updateLeaderboard();
    } catch (error) {
      console.error('Failed to save runner:', error);
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
    } catch (error) {
      console.error('Failed to clear slot:', error);
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
        leaderboardData={leaderboardData}
        onSaveRunner={handleSaveRunner}
        onClearSlot={handleClearSlot}
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

// Main App component with Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;