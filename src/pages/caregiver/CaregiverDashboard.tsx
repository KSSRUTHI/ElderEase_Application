import React from 'react';
import { motion } from 'framer-motion';
import { Users, AlertTriangle, Bell, Clock, LineChart, Heart, Activity, ArrowRight, Plus } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer';
import { useAuth } from '../../context/AuthContext';

// Mock data for connected elders
const mockElders = [
  {
    id: '1',
    name: 'Martha Johnson',
    age: 78,
    status: 'normal',
    lastCheck: '10 minutes ago',
    avatar: 'https://images.pexels.com/photos/2050994/pexels-photo-2050994.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: '2',
    name: 'Robert Wilson',
    age: 85,
    status: 'warning',
    lastCheck: '1 hour ago',
    avatar: 'https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg?auto=compress&cs=tinysrgb&w=100'
  },
  {
    id: '3',
    name: 'Elizabeth Brown',
    age: 72,
    status: 'normal',
    lastCheck: '30 minutes ago',
    avatar: 'https://images.pexels.com/photos/3831645/pexels-photo-3831645.jpeg?auto=compress&cs=tinysrgb&w=100'
  }
];

// Mock data for recent alerts
const mockAlerts = [
  {
    id: '1',
    elderName: 'Robert Wilson',
    type: 'Fall Detection',
    time: '2 hours ago',
    status: 'critical',
    details: 'Possible fall detected in living room'
  },
  {
    id: '2',
    elderName: 'Martha Johnson',
    type: 'Medication',
    time: '3 hours ago',
    status: 'warning',
    details: 'Missed morning medication'
  },
  {
    id: '3',
    elderName: 'Elizabeth Brown',
    type: 'Health',
    time: 'Yesterday',
    status: 'normal',
    details: 'Blood pressure slightly elevated'
  }
];

const ElderCard = ({ elder }: { elder: typeof mockElders[0] }) => {
  const statusColor = {
    normal: 'bg-success-500',
    warning: 'bg-warning-500',
    critical: 'bg-error-500'
  };

  return (
    <motion.div 
      className="elder-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center mb-4">
        <div className="relative mr-4">
          <img 
            src={elder.avatar} 
            alt={elder.name} 
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${statusColor[elder.status]}`}></div>
        </div>
        
        <div>
          <h3 className="text-xl font-medium">{elder.name}</h3>
          <p className="text-neutral-500">Age: {elder.age}</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-neutral-500">Last check: {elder.lastCheck}</span>
        
        <div className="flex space-x-2">
          <button className="btn btn-small btn-secondary">
            <Heart size={16} className="mr-1" /> Status
          </button>
          <button className="btn btn-small btn-primary">
            <Bell size={16} className="mr-1" /> Check In
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const AlertItem = ({ alert }: { alert: typeof mockAlerts[0] }) => {
  const statusColor = {
    normal: 'bg-success-500',
    warning: 'bg-warning-500',
    critical: 'bg-error-500'
  };
  
  const statusTextColor = {
    normal: 'text-success-700',
    warning: 'text-warning-700',
    critical: 'text-error-700'
  };

  return (
    <div className="border-b border-neutral-200 py-4 last:border-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full ${statusColor[alert.status]} mr-3`}></div>
          <span className="font-medium">{alert.elderName}</span>
        </div>
        <span className="text-sm text-neutral-500">{alert.time}</span>
      </div>
      
      <div className="mt-2">
        <div className={`text-sm font-medium ${statusTextColor[alert.status]}`}>
          {alert.type}
        </div>
        <p className="text-neutral-700">{alert.details}</p>
      </div>
      
      <div className="mt-3 flex justify-end space-x-2">
        <button className="btn btn-small btn-secondary">Dismiss</button>
        <button className="btn btn-small btn-primary">Respond</button>
      </div>
    </div>
  );
};

const CaregiverDashboard: React.FC = () => {
  const { user } = useAuth();
  const name = user?.name || 'Caregiver';
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <PageContainer title={`Welcome, ${name}`} subTitle="Monitor and care for your elders">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Overview Stats */}
        <motion.section 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="elder-card bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary-200 text-primary-700 mr-4">
                <Users size={24} />
              </div>
              <div>
                <p className="text-neutral-600">Connected Elders</p>
                <h3 className="text-3xl font-bold text-primary-900">3</h3>
              </div>
            </div>
          </div>
          
          <div className="elder-card bg-gradient-to-r from-warning-50 to-warning-100 border border-warning-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-warning-200 text-warning-700 mr-4">
                <AlertTriangle size={24} />
              </div>
              <div>
                <p className="text-neutral-600">Active Alerts</p>
                <h3 className="text-3xl font-bold text-warning-900">2</h3>
              </div>
            </div>
          </div>
          
          <div className="elder-card bg-gradient-to-r from-success-50 to-success-100 border border-success-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-success-200 text-success-700 mr-4">
                <Bell size={24} />
              </div>
              <div>
                <p className="text-neutral-600">Reminders Set</p>
                <h3 className="text-3xl font-bold text-success-900">8</h3>
              </div>
            </div>
          </div>
        </motion.section>
        
        {/* Connected Elders Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-elder-title text-neutral-800">Connected Elders</h2>
            <button className="btn btn-primary btn-small flex items-center">
              <Plus size={18} className="mr-2" />
              Add Elder
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {mockElders.map(elder => (
              <ElderCard key={elder.id} elder={elder} />
            ))}
          </div>
        </section>
        
        {/* Recent Alerts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-elder-title text-neutral-800">Recent Alerts</h2>
              <button className="btn btn-secondary btn-small flex items-center">
                View All <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
            
            <div className="elder-card">
              {mockAlerts.map(alert => (
                <AlertItem key={alert.id} alert={alert} />
              ))}
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-elder-title text-neutral-800">Quick Actions</h2>
            </div>
            
            <div className="elder-card space-y-4">
              <button className="btn btn-primary w-full flex items-center justify-center py-3">
                <Bell size={20} className="mr-2" />
                Send Reminders
              </button>
              
              <button className="btn btn-secondary w-full flex items-center justify-center py-3">
                <Activity size={20} className="mr-2" />
                Health Check
              </button>
              
              <button className="btn bg-accent-500 text-white hover:bg-accent-600 w-full flex items-center justify-center py-3">
                <Clock size={20} className="mr-2" />
                Schedule Visit
              </button>
              
              <button className="btn bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 w-full flex items-center justify-center py-3">
                <LineChart size={20} className="mr-2" />
                View Reports
              </button>
            </div>
          </motion.div>
        </section>
        
        {/* Send Reminder Form */}
        <motion.section variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-elder-title text-neutral-800">Send Quick Reminder</h2>
          </div>
          
          <div className="elder-card">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="form-group">
                  <label htmlFor="reminderText" className="form-label">Reminder Message</label>
                  <textarea 
                    id="reminderText" 
                    className="form-input h-24"
                    placeholder="Type your reminder message here..."
                  ></textarea>
                </div>
              </div>
              
              <div>
                <div className="form-group">
                  <label htmlFor="selectElder" className="form-label">Select Elder</label>
                  <select id="selectElder" className="form-input">
                    <option value="">Select Elder</option>
                    {mockElders.map(elder => (
                      <option key={elder.id} value={elder.id}>{elder.name}</option>
                    ))}
                    <option value="all">All Elders</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="reminderTime" className="form-label">Time</label>
                  <input
                    id="reminderTime"
                    type="time"
                    className="form-input"
                  />
                </div>
                
                <button className="btn btn-primary w-full py-3">
                  Send Reminder
                </button>
              </div>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </PageContainer>
  );
};

export default CaregiverDashboard;