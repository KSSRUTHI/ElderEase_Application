import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  Calendar, 
  Clock, 
  Download, 
  Filter, 
  Search, 
  ChevronDown,
  Bell,
  Check,
  X,
  User
} from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';

// Mock data for emergency alerts
const mockAlerts = [
  {
    id: 1,
    date: '2023-06-14',
    time: '08:23 AM',
    elderName: 'Martha Johnson',
    elderImage: 'https://images.pexels.com/photos/2050994/pexels-photo-2050994.jpeg?auto=compress&cs=tinysrgb&w=100',
    alertType: 'Fall Detection',
    location: 'Bathroom',
    severity: 'critical',
    notifiedCaregiver: 'Sarah Chen',
    responseTime: '2 minutes',
    resolved: true,
    notes: 'Elder was helped back to bed. No injuries reported.'
  },
  {
    id: 2,
    date: '2023-06-13',
    time: '10:45 AM',
    elderName: 'Robert Wilson',
    elderImage: 'https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg?auto=compress&cs=tinysrgb&w=100',
    alertType: 'Medication',
    location: 'Kitchen',
    severity: 'warning',
    notifiedCaregiver: 'Michael Brown',
    responseTime: '5 minutes',
    resolved: true,
    notes: 'Reminder sent to take morning medication.'
  },
  {
    id: 3,
    date: '2023-06-12',
    time: '03:18 PM',
    elderName: 'Elizabeth Brown',
    elderImage: 'https://images.pexels.com/photos/3831645/pexels-photo-3831645.jpeg?auto=compress&cs=tinysrgb&w=100',
    alertType: 'Vital Signs',
    location: 'Living Room',
    severity: 'warning',
    notifiedCaregiver: 'Sarah Chen',
    responseTime: '4 minutes',
    resolved: true,
    notes: 'Blood pressure elevated. Caregiver notified and scheduled follow-up.'
  },
  {
    id: 4,
    date: '2023-06-12',
    time: '09:52 PM',
    elderName: 'Martha Johnson',
    elderImage: 'https://images.pexels.com/photos/2050994/pexels-photo-2050994.jpeg?auto=compress&cs=tinysrgb&w=100',
    alertType: 'Fall Detection',
    location: 'Bedroom',
    severity: 'critical',
    notifiedCaregiver: 'Sarah Chen',
    responseTime: '3 minutes',
    resolved: true,
    notes: 'False alarm. Elder was bending down to pick up a book.'
  },
  {
    id: 5,
    date: '2023-06-11',
    time: '11:30 AM',
    elderName: 'Robert Wilson',
    elderImage: 'https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg?auto=compress&cs=tinysrgb&w=100',
    alertType: 'SOS Button',
    location: 'Kitchen',
    severity: 'critical',
    notifiedCaregiver: 'Michael Brown',
    responseTime: '1 minute',
    resolved: true,
    notes: 'Elder needed help reaching cabinet. No emergency.'
  },
  {
    id: 6,
    date: '2023-06-10',
    time: '02:45 PM',
    elderName: 'Elizabeth Brown',
    elderImage: 'https://images.pexels.com/photos/3831645/pexels-photo-3831645.jpeg?auto=compress&cs=tinysrgb&w=100',
    alertType: 'Location',
    location: 'Outside',
    severity: 'warning',
    notifiedCaregiver: 'Sarah Chen',
    responseTime: '10 minutes',
    resolved: true,
    notes: 'Elder wandered to neighbor\'s yard. Safely returned home.'
  }
];

const alertTypeFilters = [
  { value: 'all', label: 'All Types' },
  { value: 'Fall Detection', label: 'Fall Detection' },
  { value: 'Medication', label: 'Medication' },
  { value: 'Vital Signs', label: 'Vital Signs' },
  { value: 'SOS Button', label: 'SOS Button' },
  { value: 'Location', label: 'Location' }
];

const severityFilters = [
  { value: 'all', label: 'All Severities' },
  { value: 'critical', label: 'Critical' },
  { value: 'warning', label: 'Warning' },
  { value: 'information', label: 'Information' }
];

interface AlertDetailModalProps {
  alert: typeof mockAlerts[0];
  onClose: () => void;
}

const AlertDetailModal: React.FC<AlertDetailModalProps> = ({ alert, onClose }) => {
  return (
    <motion.div 
      className="fixed inset-0 bg-neutral-900 bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-white rounded-elder p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center">
            <div className={`p-2 rounded-full mr-3 ${
              alert.severity === 'critical' ? 'bg-error-100 text-error-700' :
              alert.severity === 'warning' ? 'bg-warning-100 text-warning-700' :
              'bg-primary-100 text-primary-700'
            }`}>
              <AlertTriangle size={20} />
            </div>
            <h2 className="text-2xl font-semibold text-neutral-800">Alert Details</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-500 hover:text-neutral-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="flex items-center mb-4">
              <img 
                src={alert.elderImage} 
                alt={alert.elderName}
                className="w-16 h-16 rounded-full object-cover mr-3"
              />
              <div>
                <h3 className="text-xl font-medium">{alert.elderName}</h3>
                <p className="text-neutral-600">Elder</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-neutral-500">Alert Type</p>
                <p className="text-lg font-medium">{alert.alertType}</p>
              </div>
              
              <div>
                <p className="text-sm text-neutral-500">Location</p>
                <p className="text-lg font-medium">{alert.location}</p>
              </div>
              
              <div>
                <p className="text-sm text-neutral-500">Severity</p>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  alert.severity === 'critical' ? 'bg-error-100 text-error-800' :
                  alert.severity === 'warning' ? 'bg-warning-100 text-warning-800' :
                  'bg-neutral-100 text-neutral-800'
                }`}>
                  {alert.severity === 'critical' ? 'Critical' :
                   alert.severity === 'warning' ? 'Warning' : 'Information'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-neutral-500">Date & Time</p>
              <p className="text-lg font-medium">{alert.date} at {alert.time}</p>
            </div>
            
            <div>
              <p className="text-sm text-neutral-500">Notified Caregiver</p>
              <p className="text-lg font-medium">{alert.notifiedCaregiver}</p>
            </div>
            
            <div>
              <p className="text-sm text-neutral-500">Response Time</p>
              <p className="text-lg font-medium">{alert.responseTime}</p>
            </div>
            
            <div>
              <p className="text-sm text-neutral-500">Status</p>
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                alert.resolved ? 'bg-success-100 text-success-800' : 'bg-warning-100 text-warning-800'
              }`}>
                {alert.resolved ? 'Resolved' : 'Pending'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-neutral-500 mb-2">Notes</p>
          <p className="p-4 bg-neutral-50 rounded-lg text-neutral-800">{alert.notes}</p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="btn btn-secondary"
          >
            Close
          </button>
          <button className="btn btn-primary">
            Generate Report
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const EmergencyAlerts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [alertTypeFilter, setAlertTypeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState<typeof mockAlerts[0] | null>(null);
  
  const filteredAlerts = mockAlerts.filter(alert => {
    const matchesSearch = 
      alert.elderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.alertType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesAlertType = alertTypeFilter === 'all' || alert.alertType === alertTypeFilter;
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    
    return matchesSearch && matchesAlertType && matchesSeverity;
  });
  
  const handleViewDetails = (alert: typeof mockAlerts[0]) => {
    setSelectedAlert(alert);
  };
  
  const handleCloseModal = () => {
    setSelectedAlert(null);
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-error-100 text-error-800';
      case 'warning':
        return 'bg-warning-100 text-warning-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };
  
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
    <PageContainer title="Emergency Alerts" subTitle="Monitor and respond to emergency situations">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Filter Controls */}
        <motion.div 
          variants={itemVariants}
          className="elder-card"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="form-label">Search</label>
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  id="search"
                  type="text"
                  className="form-input pl-10"
                  placeholder="Search by name, alert type, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="dateStart" className="form-label">Date Range</label>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Calendar size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    id="dateStart"
                    type="date"
                    className="form-input pl-10"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  />
                </div>
                <span className="text-neutral-400">to</span>
                <input
                  type="date"
                  className="form-input"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="alertType" className="form-label">Alert Type</label>
              <div className="relative">
                <select
                  id="alertType"
                  className="form-input appearance-none pr-10"
                  value={alertTypeFilter}
                  onChange={(e) => setAlertTypeFilter(e.target.value)}
                >
                  {alertTypeFilters.map(filter => (
                    <option key={filter.value} value={filter.value}>{filter.label}</option>
                  ))}
                </select>
                <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              </div>
            </div>
            
            <div>
              <label htmlFor="severity" className="form-label">Severity</label>
              <div className="relative">
                <select
                  id="severity"
                  className="form-input appearance-none pr-10"
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                >
                  {severityFilters.map(filter => (
                    <option key={filter.value} value={filter.value}>{filter.label}</option>
                  ))}
                </select>
                <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between mt-6">
            <button className="btn btn-secondary flex items-center">
              <Filter size={18} className="mr-2" />
              Reset Filters
            </button>
            
            <button className="btn btn-primary flex items-center">
              <Download size={18} className="mr-2" />
              Export Alerts (CSV)
            </button>
          </div>
        </motion.div>
        
        {/* Alerts Summary */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="elder-card bg-gradient-to-r from-error-50 to-error-100 border border-error-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-error-200 text-error-700 mr-4">
                <AlertTriangle size={24} />
              </div>
              <div>
                <p className="text-neutral-600">Critical Alerts</p>
                <h3 className="text-3xl font-bold text-error-900">
                  {mockAlerts.filter(a => a.severity === 'critical').length}
                </h3>
              </div>
            </div>
          </div>
          
          <div className="elder-card bg-gradient-to-r from-warning-50 to-warning-100 border border-warning-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-warning-200 text-warning-700 mr-4">
                <Bell size={24} />
              </div>
              <div>
                <p className="text-neutral-600">Warning Alerts</p>
                <h3 className="text-3xl font-bold text-warning-900">
                  {mockAlerts.filter(a => a.severity === 'warning').length}
                </h3>
              </div>
            </div>
          </div>
          
          <div className="elder-card bg-gradient-to-r from-success-50 to-success-100 border border-success-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-success-200 text-success-700 mr-4">
                <Check size={24} />
              </div>
              <div>
                <p className="text-neutral-600">Resolved</p>
                <h3 className="text-3xl font-bold text-success-900">
                  {mockAlerts.filter(a => a.resolved).length}
                </h3>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Alerts Table */}
        <motion.div 
          variants={itemVariants}
          className="elder-card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-neutral-50 border-b border-neutral-200 sticky top-0">
                <tr>
                  <th className="px-6 py-4 text-neutral-700 font-semibold">Date & Time</th>
                  <th className="px-6 py-4 text-neutral-700 font-semibold">Elder</th>
                  <th className="px-6 py-4 text-neutral-700 font-semibold">Alert Type</th>
                  <th className="px-6 py-4 text-neutral-700 font-semibold">Location</th>
                  <th className="px-6 py-4 text-neutral-700 font-semibold">Severity</th>
                  <th className="px-6 py-4 text-neutral-700 font-semibold">Response</th>
                  <th className="px-6 py-4 text-neutral-700 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredAlerts.map(alert => (
                  <tr key={alert.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-neutral-900 font-medium">{alert.date}</span>
                        <span className="text-neutral-500 text-sm flex items-center">
                          <Clock size={14} className="mr-1" /> {alert.time}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img 
                          src={alert.elderImage} 
                          alt={alert.elderName}
                          className="w-10 h-10 rounded-full object-cover mr-3"
                        />
                        <span className="text-neutral-900 font-medium">{alert.elderName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-neutral-900">{alert.alertType}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-neutral-900">{alert.location}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                        {alert.severity === 'critical' ? 'Critical' : 
                         alert.severity === 'warning' ? 'Warning' : 'Information'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-neutral-900">{alert.notifiedCaregiver}</span>
                        <span className="text-neutral-500 text-sm">
                          Response: {alert.responseTime}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleViewDetails(alert)}
                        className="text-primary-600 hover:text-primary-800 font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredAlerts.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle size={40} className="mx-auto text-neutral-300 mb-3" />
              <h3 className="text-lg font-medium text-neutral-800 mb-1">No alerts found</h3>
              <p className="text-neutral-600">
                Try adjusting your filters or search criteria
              </p>
            </div>
          )}
          
          <div className="flex justify-between items-center px-6 py-4 border-t border-neutral-200">
            <div className="text-sm text-neutral-600">
              Showing {filteredAlerts.length} of {mockAlerts.length} alerts
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
                Next
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      {selectedAlert && (
        <AlertDetailModal alert={selectedAlert} onClose={handleCloseModal} />
      )}
    </PageContainer>
  );
};

export default EmergencyAlerts;