import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ElderDashboard from './pages/elder/ElderDashboard';
import CaregiverDashboard from './pages/caregiver/CaregiverDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import VoiceAssistant from './pages/VoiceAssistant';
import HealthMonitoring from './pages/elder/HealthMonitoring';
import ReminderConfig from './pages/ReminderConfig';
import EmotionalWellness from './pages/elder/EmotionalWellness';
import EmergencyAlerts from './pages/EmergencyAlerts';
import FeedbackPage from './pages/FeedbackPage';
import SettingsPage from './pages/SettingsPage';
import Chatbot from './pages/Chatbot';
import VoiceAssistant2 from './pages/VoiceAssistant2';
import VoiceAssistant3 from './pages/VoiceAssistant3';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          
          {/* Elder Routes */}
          <Route path="/elder/dashboard" element={<ElderDashboard />} />
          <Route path="/elder/health" element={<HealthMonitoring />} />
          <Route path="/elder/wellness" element={<EmotionalWellness />} />
          
          {/* Caregiver Routes */}
          <Route path="/caregiver/dashboard" element={<CaregiverDashboard />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
          {/* Shared Routes */}
          <Route path="/voice-assistant" element={<VoiceAssistant3 />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/reminders" element={<ReminderConfig />} />
          <Route path="/emergency-alerts" element={<EmergencyAlerts />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;