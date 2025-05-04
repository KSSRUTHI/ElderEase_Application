import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Smartphone, 
  Mail, 
  Camera, 
  Trash2, 
  Save, 
  LogOut, 
  UserCog,
  UserPlus,
  XCircle,
  Activity
} from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import { useAuth } from '../context/AuthContext';

// Mock user settings data
const initialSettings = {
  profile: {
    name: 'Martha Johnson',
    email: 'martha.j@example.com',
    avatar: 'https://images.pexels.com/photos/2050994/pexels-photo-2050994.jpeg?auto=compress&cs=tinysrgb&w=100',
    phone: '(555) 123-4567',
    address: '123 Maple Street, Pleasantville, CA 12345',
    emergencyContact: 'Sarah Chen (Daughter) - (555) 987-6543'
  },
  security: {
    twoFactorEnabled: true,
    lastPasswordChange: '2 months ago',
    loginAlerts: true,
    biometricEnabled: false
  },
  devices: [
    { id: 1, name: 'iPhone 13', type: 'Mobile', lastActive: '2 hours ago', location: 'Home' },
    { id: 2, name: 'iPad', type: 'Tablet', lastActive: 'Yesterday', location: 'Home' },
    { id: 3, name: 'Heart Rate Monitor', type: 'Medical Device', lastActive: 'Active now', location: 'Home' }
  ],
  notifications: {
    medicationReminders: true,
    appointmentAlerts: true,
    healthChanges: true,
    caregiverMessages: true,
    systemUpdates: false,
    preferredTime: {
      start: '08:00',
      end: '20:00'
    },
    emailNotifications: true,
    emergencyOnly: false
  },
  privacy: {
    shareHealthData: true,
    shareLocationData: true,
    shareActivityData: true,
    dataRetention: '6 months',
    anonymizeData: false,
    allowResearch: true
  }
};

type TabType = 'profile' | 'security' | 'devices' | 'notifications' | 'privacy';

const SettingsPage: React.FC = () => {
  // ... rest of the component code ...
};

export default SettingsPage;