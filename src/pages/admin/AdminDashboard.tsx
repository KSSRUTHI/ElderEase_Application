import React from 'react';
import { motion } from 'framer-motion';
import { Users, Mic, AlertTriangle, FileText, UserPlus, Plus, Search, Filter, Download, ChevronsUpDown, MoreVertical } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer';
import { useAuth } from '../../context/AuthContext';

// Mock data for users
const mockUsers = [
  { id: 1, name: 'Martha Johnson', email: 'martha.j@example.com', role: 'Elder', status: 'Active', lastLogin: '2 hours ago' },
  { id: 2, name: 'Robert Wilson', email: 'robert.w@example.com', role: 'Elder', status: 'Active', lastLogin: '1 day ago' },
  { id: 3, name: 'Sarah Chen', email: 'sarah.c@example.com', role: 'Caregiver', status: 'Active', lastLogin: '3 hours ago' },
  { id: 4, name: 'Michael Brown', email: 'michael.b@example.com', role: 'Caregiver', status: 'Inactive', lastLogin: '2 weeks ago' },
  { id: 5, name: 'David Miller', email: 'david.m@example.com', role: 'Admin', status: 'Active', lastLogin: '1 hour ago' }
];

const StatCard = ({ icon, title, value, change, color }: {
  icon: React.ReactNode,
  title: string,
  value: string,
  change?: { value: string, positive: boolean },
  color: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error'
}) => {
  const colorVariants = {
    primary: 'from-primary-50 to-primary-100 border-primary-200',
    secondary: 'from-neutral-50 to-neutral-100 border-neutral-200',
    accent: 'from-accent-50 to-accent-100 border-accent-200',
    success: 'from-success-50 to-success-100 border-success-200',
    warning: 'from-warning-50 to-warning-100 border-warning-200',
    error: 'from-error-50 to-error-100 border-error-200'
  };
  
  const iconColors = {
    primary: 'bg-primary-200 text-primary-700',
    secondary: 'bg-neutral-200 text-neutral-700',
    accent: 'bg-accent-200 text-accent-700',
    success: 'bg-success-200 text-success-700',
    warning: 'bg-warning-200 text-warning-700',
    error: 'bg-error-200 text-error-700'
  };

  return (
    <motion.div 
      className={`elder-card bg-gradient-to-r ${colorVariants[color]} border`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${iconColors[color]} mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-neutral-600">{title}</p>
          <h3 className="text-3xl font-bold">{value}</h3>
          
          {change && (
            <p className={`text-sm mt-1 ${change.positive ? 'text-success-600' : 'text-error-600'}`}>
              {change.positive ? '▲' : '▼'} {change.value} {change.positive ? 'increase' : 'decrease'}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const name = user?.name || 'Admin';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <PageContainer title={`Welcome, ${name}`} subTitle="System overview and management">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={<Users size={24} />}
            title="Total Users"
            value="127"
            change={{ value: "15%", positive: true }}
            color="primary"
          />
          
          <StatCard 
            icon={<Mic size={24} />}
            title="Active Agents"
            value="8"
            color="success"
          />
          
          <StatCard 
            icon={<AlertTriangle size={24} />}
            title="Incidents This Week"
            value="12"
            change={{ value: "5%", positive: false }}
            color="warning"
          />
          
          <StatCard 
            icon={<FileText size={24} />}
            title="New Feedback"
            value="23"
            change={{ value: "10%", positive: true }}
            color="accent"
          />
        </div>
        
        {/* User Management */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
            <h2 className="text-elder-title text-neutral-800">User Management</h2>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input 
                  type="text" 
                  placeholder="Search users..."
                  className="form-input pl-10 py-2"
                />
              </div>
              
              <button className="btn btn-secondary py-2 flex items-center">
                <Filter size={18} className="mr-2" />
                Filter
              </button>
              
              <button className="btn btn-primary py-2 flex items-center">
                <UserPlus size={18} className="mr-2" />
                Add User
              </button>
            </div>
          </div>
          
          <motion.div 
            className="elder-card overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="px-4 py-3 font-semibold text-neutral-700 flex items-center">
                      Name <ChevronsUpDown size={16} className="ml-1" />
                    </th>
                    <th className="px-4 py-3 font-semibold text-neutral-700">Email</th>
                    <th className="px-4 py-3 font-semibold text-neutral-700">Role</th>
                    <th className="px-4 py-3 font-semibold text-neutral-700">Status</th>
                    <th className="px-4 py-3 font-semibold text-neutral-700">Last Login</th>
                    <th className="px-4 py-3 font-semibold text-neutral-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.map(user => (
                    <tr key={user.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                      <td className="px-4 py-4 font-medium">{user.name}</td>
                      <td className="px-4 py-4 text-neutral-600">{user.email}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'Elder' 
                            ? 'bg-primary-100 text-primary-800' 
                            : user.role === 'Caregiver'
                              ? 'bg-success-100 text-success-800'
                              : 'bg-accent-100 text-accent-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center ${
                          user.status === 'Active' ? 'text-success-700' : 'text-neutral-500'
                        }`}>
                          <span className={`w-2 h-2 rounded-full mr-2 ${
                            user.status === 'Active' ? 'bg-success-500' : 'bg-neutral-400'
                          }`}></span>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-neutral-600">{user.lastLogin}</td>
                      <td className="px-4 py-4">
                        <div className="flex space-x-2">
                          <button className="p-1 text-neutral-600 hover:text-primary-600">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-between items-center px-4 py-3 border-t border-neutral-200">
              <div className="text-sm text-neutral-600">
                Showing 5 of 127 users
              </div>
              
              <div className="flex space-x-1">
                <button className="px-3 py-1 rounded border border-neutral-200 text-neutral-600 hover:bg-neutral-50">
                  Previous
                </button>
                <button className="px-3 py-1 rounded border border-neutral-200 bg-primary-50 text-primary-700 font-medium">
                  1
                </button>
                <button className="px-3 py-1 rounded border border-neutral-200 text-neutral-600 hover:bg-neutral-50">
                  2
                </button>
                <button className="px-3 py-1 rounded border border-neutral-200 text-neutral-600 hover:bg-neutral-50">
                  3
                </button>
                <button className="px-3 py-1 rounded border border-neutral-200 text-neutral-600 hover:bg-neutral-50">
                  Next
                </button>
              </div>
              
              <button className="flex items-center text-neutral-600 hover:text-primary-600">
                <Download size={16} className="mr-1" />
                Export
              </button>
            </div>
          </motion.div>
        </section>
        
        {/* Agent Management */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-elder-title text-neutral-800">Agent Management</h2>
            
            <button className="btn btn-primary flex items-center">
              <Plus size={18} className="mr-2" />
              Add Agent
            </button>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {/* Health Monitoring Agent */}
            <div className="elder-card border-l-4 border-l-primary-500">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-primary-100 text-primary-700 mr-3">
                    <Activity size={20} />
                  </div>
                  <h3 className="font-medium text-lg">Health Monitoring</h3>
                </div>
                <span className="bg-success-100 text-success-700 px-2 py-1 rounded-full text-xs font-medium">Active</span>
              </div>
              
              <p className="text-neutral-600 mb-4">Monitors vital signs and health indicators in real-time.</p>
              
              <div className="flex justify-between text-sm text-neutral-500">
                <span>Incidents: 4 today</span>
                <span>Uptime: 99.9%</span>
              </div>
              
              <div className="mt-4 flex justify-end space-x-2">
                <button className="btn btn-small btn-secondary">Configure</button>
                <button className="btn btn-small btn-primary">View Logs</button>
              </div>
            </div>
            
            {/* Voice Assistant Agent */}
            <div className="elder-card border-l-4 border-l-accent-500">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-accent-100 text-accent-700 mr-3">
                    <Mic size={20} />
                  </div>
                  <h3 className="font-medium text-lg">Voice Assistant</h3>
                </div>
                <span className="bg-success-100 text-success-700 px-2 py-1 rounded-full text-xs font-medium">Active</span>
              </div>
              
              <p className="text-neutral-600 mb-4">Provides voice-based interaction and support services.</p>
              
              <div className="flex justify-between text-sm text-neutral-500">
                <span>Interactions: 56 today</span>
                <span>Accuracy: 94%</span>
              </div>
              
              <div className="mt-4 flex justify-end space-x-2">
                <button className="btn btn-small btn-secondary">Configure</button>
                <button className="btn btn-small btn-primary">View Logs</button>
              </div>
            </div>
            
            {/* Fall Detection Agent */}
            <div className="elder-card border-l-4 border-l-error-500">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-error-100 text-error-700 mr-3">
                    <AlertTriangle size={20} />
                  </div>
                  <h3 className="font-medium text-lg">Fall Detection</h3>
                </div>
                <span className="bg-success-100 text-success-700 px-2 py-1 rounded-full text-xs font-medium">Active</span>
              </div>
              
              <p className="text-neutral-600 mb-4">Detects falls and sends immediate alerts to caregivers.</p>
              
              <div className="flex justify-between text-sm text-neutral-500">
                <span>Detections: 2 today</span>
                <span>False positives: 1%</span>
              </div>
              
              <div className="mt-4 flex justify-end space-x-2">
                <button className="btn btn-small btn-secondary">Configure</button>
                <button className="btn btn-small btn-primary">View Logs</button>
              </div>
            </div>
          </motion.div>
        </section>
        
        {/* Recent Activity */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-elder-title text-neutral-800">Recent System Activity</h2>
            
            <button className="btn btn-secondary flex items-center">
              View All Logs
            </button>
          </div>
          
          <div className="elder-card">
            <div className="space-y-6">
              <div className="border-l-2 border-primary-500 pl-4">
                <div className="flex justify-between">
                  <p className="font-medium">New user registered</p>
                  <span className="text-sm text-neutral-500">10 minutes ago</span>
                </div>
                <p className="text-neutral-600">Richard Davis (richard.d@example.com) registered as a caregiver</p>
              </div>
              
              <div className="border-l-2 border-warning-500 pl-4">
                <div className="flex justify-between">
                  <p className="font-medium">Health alert triggered</p>
                  <span className="text-sm text-neutral-500">2 hours ago</span>
                </div>
                <p className="text-neutral-600">Elevated heart rate detected for Martha Johnson</p>
              </div>
              
              <div className="border-l-2 border-accent-500 pl-4">
                <div className="flex justify-between">
                  <p className="font-medium">Voice assistant model updated</p>
                  <span className="text-sm text-neutral-500">Yesterday, 8:30 PM</span>
                </div>
                <p className="text-neutral-600">System updated to voice recognition model v2.4</p>
              </div>
              
              <div className="border-l-2 border-error-500 pl-4">
                <div className="flex justify-between">
                  <p className="font-medium">Fall detection alert</p>
                  <span className="text-sm text-neutral-500">Yesterday, 6:15 PM</span>
                </div>
                <p className="text-neutral-600">Possible fall detected for Robert Wilson. Caregiver notified.</p>
              </div>
              
              <div className="border-l-2 border-success-500 pl-4">
                <div className="flex justify-between">
                  <p className="font-medium">System maintenance completed</p>
                  <span className="text-sm text-neutral-500">2 days ago</span>
                </div>
                <p className="text-neutral-600">Scheduled system updates and maintenance completed successfully</p>
              </div>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </PageContainer>
  );
};

export default AdminDashboard;