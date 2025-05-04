import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Heart, 
  Bell, 
  SmilePlus, 
  Settings, 
  LogOut, 
  Mic, 
  Users, 
  LineChart, 
  ClipboardList,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  role: 'elder' | 'caregiver' | 'admin';
}

const ElderLinks = () => (
  <div className="space-y-2">
    <NavLink 
      to="/elder/dashboard" 
      className={({isActive}) => `flex items-center px-3 py-2.5 rounded-lg text-[0.94rem] font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
    >
      <Home size={20} className="mr-3" />
      <span>Overview</span>
    </NavLink>
    <NavLink 
      to="/elder/health" 
      className={({isActive}) => `flex items-center px-3 py-2.5 rounded-lg text-[0.94rem] font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
    >
      <Heart size={20} className="mr-3" />
      <span>Health Status</span>
    </NavLink>
    <NavLink 
      to="/reminders" 
      className={({isActive}) => `flex items-center px-3 py-2.5 rounded-lg text-[0.94rem] font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
    >
      <Bell size={20} className="mr-3" />
      <span>Reminders</span>
    </NavLink>
    <NavLink 
      to="/elder/wellness" 
      className={({isActive}) => `flex items-center px-3 py-2.5 rounded-lg text-[0.94rem] font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
    >
      <SmilePlus size={20} className="mr-3" />
      <span>Emotional Wellness</span>
    </NavLink>
    <NavLink 
      to="/voice-assistant" 
      className={({isActive}) => `flex items-center px-3 py-2.5 rounded-lg text-[0.94rem] font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
    >
      <Mic size={20} className="mr-3" />
      <span>Voice Assistant</span>
    </NavLink>
  </div>
);

const CaregiverLinks = () => (
  <div className="space-y-2">
    <NavLink 
      to="/caregiver/dashboard" 
      className={({isActive}) => `flex items-center px-3 py-2.5 rounded-lg text-[0.94rem] font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
    >
      <Home size={20} className="mr-3" />
      <span>Overview</span>
    </NavLink>
    <NavLink 
      to="/caregiver/elders" 
      className={({isActive}) => `flex items-center px-3 py-2.5 rounded-lg text-[0.94rem] font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
    >
      <Users size={20} className="mr-3" />
      <span>Elders</span>
    </NavLink>
    <NavLink 
      to="/caregiver/alerts" 
      className={({isActive}) => `flex items-center px-3 py-2.5 rounded-lg text-[0.94rem] font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
    >
      <AlertTriangle size={20} className="mr-3" />
      <span>Alerts</span>
    </NavLink>
    <NavLink 
      to="/caregiver/trends" 
      className={({isActive}) => `flex items-center px-3 py-2.5 rounded-lg text-[0.94rem] font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
    >
      <LineChart size={20} className="mr-3" />
      <span>Trends</span>
    </NavLink>
  </div>
);

const AdminLinks = () => (
  <div className="space-y-2">
    <NavLink 
      to="/admin/dashboard" 
      className={({isActive}) => `flex items-center px-3 py-2.5 rounded-lg text-[0.94rem] font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
    >
      <Home size={20} className="mr-3" />
      <span>Overview</span>
    </NavLink>
    <NavLink 
      to="/admin/users" 
      className={({isActive}) => `flex items-center px-3 py-2.5 rounded-lg text-[0.94rem] font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
    >
      <Users size={20} className="mr-3" />
      <span>User Management</span>
    </NavLink>
    <NavLink 
      to="/admin/agents" 
      className={({isActive}) => `flex items-center px-3 py-2.5 rounded-lg text-[0.94rem] font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
    >
      <Mic size={20} className="mr-3" />
      <span>Agent Management</span>
    </NavLink>
    <NavLink 
      to="/admin/logs" 
      className={({isActive}) => `flex items-center px-3 py-2.5 rounded-lg text-[0.94rem] font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
    >
      <ClipboardList size={20} className="mr-3" />
      <span>Logs</span>
    </NavLink>
    <NavLink 
      to="/feedback" 
      className={({isActive}) => `flex items-center px-3 py-2.5 rounded-lg text-[0.94rem] font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
    >
      <SmilePlus size={20} className="mr-3" />
      <span>Feedback</span>
    </NavLink>
  </div>
);

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const { logout } = useAuth();
  
  let links;
  switch (role) {
    case 'elder':
      links = <ElderLinks />;
      break;
    case 'caregiver':
      links = <CaregiverLinks />;
      break;
    case 'admin':
      links = <AdminLinks />;
      break;
    default:
      links = <ElderLinks />;
  }

  return (
    <div className="bg-white h-full min-h-screen w-64 fixed left-0 shadow-sm py-6 px-3 flex flex-col font-sans border-r border-gray-100">
      <div className="mb-8 px-3">
        <div className="flex items-center space-x-3">
          <Heart size={26} className="text-blue-500" />
          <h1 className="text-xl font-semibold text-gray-800">NeuroCare</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1 font-normal">ElderEase AI System</p>
      </div>

      <nav className="flex-1">
        {links}
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-100 space-y-2">
        <NavLink 
          to="/settings" 
          className={({isActive}) => `flex items-center px-3 py-2.5 rounded-lg text-[0.94rem] font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
        >
          <Settings size={20} className="mr-3" />
          <span>Settings</span>
        </NavLink>
        <button 
          onClick={logout} 
          className="flex items-center w-full px-3 py-2.5 rounded-lg text-[0.94rem] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <LogOut size={20} className="mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;