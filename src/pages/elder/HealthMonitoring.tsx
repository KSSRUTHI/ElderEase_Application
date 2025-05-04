import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, Settings as Lungs, Calendar, Clock, Download, AlertTriangle, Filter } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Mock data for vital signs
const heartRateData = [
  { time: '9:00', value: 72 },
  { time: '10:00', value: 75 },
  { time: '11:00', value: 79 },
  { time: '12:00', value: 82 },
  { time: '13:00', value: 77 },
  { time: '14:00', value: 74 },
  { time: '15:00', value: 72 },
  { time: '16:00', value: 70 },
  { time: '17:00', value: 73 },
];

const bloodPressureData = [
  { time: '9:00', systolic: 120, diastolic: 80 },
  { time: '10:00', systolic: 122, diastolic: 82 },
  { time: '11:00', systolic: 128, diastolic: 85 },
  { time: '12:00', systolic: 130, diastolic: 87 },
  { time: '13:00', systolic: 126, diastolic: 84 },
  { time: '14:00', systolic: 125, diastolic: 83 },
  { time: '15:00', systolic: 122, diastolic: 80 },
  { time: '16:00', systolic: 118, diastolic: 78 },
  { time: '17:00', systolic: 120, diastolic: 80 },
];

const oxygenData = [
  { time: '9:00', value: 97 },
  { time: '10:00', value: 98 },
  { time: '11:00', value: 97 },
  { time: '12:00', value: 97 },
  { time: '13:00', value: 98 },
  { time: '14:00', value: 96 },
  { time: '15:00', value: 97 },
  { time: '16:00', value: 98 },
  { time: '17:00', value: 97 },
];

// Mock data for fall detection events
const fallEvents = [
  { id: 1, time: '2023-06-10 08:23', location: 'Living Room', severity: 'Low', status: 'Resolved' },
  { id: 2, time: '2023-06-08 15:47', location: 'Bathroom', severity: 'Medium', status: 'Resolved' },
  { id: 3, time: '2023-06-05 12:15', location: 'Kitchen', severity: 'High', status: 'Resolved' },
  { id: 4, time: '2023-06-01 19:30', location: 'Bedroom', severity: 'Medium', status: 'Resolved' },
];

const HealthMonitoring: React.FC = () => {
  const [timeRange, setTimeRange] = useState('day');
  
  return (
    <PageContainer 
      title="Health Monitoring" 
      subTitle="Track your vital signs and health status"
      className="font-sans"
    >
      <div className="space-y-6">
        {/* Time Range Selector */}
        <motion.div 
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center space-x-2">
            <Calendar size={18} className="text-slate-500" />
            <span className="text-sm font-medium text-slate-700">Time Range:</span>
          </div>
          
          <div className="flex rounded-lg overflow-hidden border border-slate-200">
            <button 
              onClick={() => setTimeRange('day')}
              className={`px-3 py-1.5 text-sm ${timeRange === 'day' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
            >
              Day
            </button>
            <button 
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1.5 text-sm ${timeRange === 'week' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
            >
              Week
            </button>
            <button 
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1.5 text-sm ${timeRange === 'month' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
            >
              Month
            </button>
          </div>
          
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center">
            <Download size={16} className="mr-1.5" />
            Export Data
          </button>
        </motion.div>
        
        {/* Health Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Heart Rate Chart */}
          <motion.div 
            className="bg-white rounded-xl p-5 shadow-sm border border-slate-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center mb-5 gap-3">
              <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                <Heart size={20} />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-800">Heart Rate</h2>
                <p className="text-sm text-slate-500">Current: 73 bpm | Average: 74 bpm</p>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                Normal Range
              </div>
            </div>
            
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={heartRateData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                  <defs>
                    <linearGradient id="heartRateGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#64748b" 
                    tick={{ fontSize: 12 }}
                    tickMargin={8}
                  />
                  <YAxis 
                    domain={[60, 90]} 
                    stroke="#64748b" 
                    tick={{ fontSize: 12 }}
                    tickMargin={8}
                  />
                  <Tooltip 
                    contentStyle={{
                      background: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      fontSize: '12px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    fill="url(#heartRateGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex justify-between mt-3 text-xs text-slate-500">
              <span>Min: 70 bpm</span>
              <span>Max: 82 bpm</span>
              <span>Resting: 68 bpm</span>
            </div>
          </motion.div>
          
          {/* Blood Pressure Chart */}
          <motion.div 
            className="bg-white rounded-xl p-5 shadow-sm border border-slate-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center mb-5 gap-3">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <Activity size={20} />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-800">Blood Pressure</h2>
                <p className="text-sm text-slate-500">Current: 120/80 mmHg | Average: 124/83 mmHg</p>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                Slightly Elevated
              </div>
            </div>
            
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bloodPressureData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#64748b" 
                    tick={{ fontSize: 12 }}
                    tickMargin={8}
                  />
                  <YAxis 
                    domain={[50, 150]} 
                    stroke="#64748b" 
                    tick={{ fontSize: 12 }}
                    tickMargin={8}
                  />
                  <Tooltip 
                    contentStyle={{
                      background: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      fontSize: '12px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="systolic" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="diastolic" 
                    stroke="#93c5fd" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex items-center mt-3 text-xs text-slate-600">
              <span className="flex items-center mr-3">
                <span className="w-2.5 h-2.5 inline-block bg-indigo-500 rounded-full mr-1.5"></span>
                Systolic
              </span>
              <span className="flex items-center">
                <span className="w-2.5 h-2.5 inline-block bg-indigo-300 rounded-full mr-1.5"></span>
                Diastolic
              </span>
            </div>
          </motion.div>
          
          {/* Oxygen Saturation Chart */}
          <motion.div 
            className="bg-white rounded-xl p-5 shadow-sm border border-slate-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center mb-5 gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <Lungs size={20} />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-slate-800">Oxygen Saturation</h2>
                <p className="text-sm text-slate-500">Current: 97% | Average: 97.2%</p>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                Normal Range
              </div>
            </div>
            
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={oxygenData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                  <defs>
                    <linearGradient id="oxygenGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#64748b" 
                    tick={{ fontSize: 12 }}
                    tickMargin={8}
                  />
                  <YAxis 
                    domain={[90, 100]} 
                    stroke="#64748b" 
                    tick={{ fontSize: 12 }}
                    tickMargin={8}
                  />
                  <Tooltip 
                    contentStyle={{
                      background: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      fontSize: '12px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    fill="url(#oxygenGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex justify-between mt-3 text-xs text-slate-500">
              <span>Min: 96%</span>
              <span>Max: 98%</span>
              <span>Target: &gt;95%</span>
            </div>
          </motion.div>
          
          {/* Fall Detection Summary */}
          <motion.div 
            className="bg-white rounded-xl p-5 shadow-sm border border-slate-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                <AlertTriangle size={20} className="text-amber-500 mr-2" />
                Fall Detection
              </h2>
              <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center">
                <Filter size={16} className="mr-1.5" />
                Filter
              </button>
            </div>
            
            <div className="space-y-3">
              {fallEvents.slice(0, 3).map(event => (
                <div key={event.id} className="p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <Clock size={16} className="text-slate-400 mt-0.5 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">{event.time}</p>
                        <p className="text-xs text-slate-500">{event.location}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        event.severity === 'High' 
                          ? 'bg-rose-100 text-rose-800' 
                          : event.severity === 'Medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-800'
                      }`}>
                        {event.severity}
                      </span>
                      <button className="text-xs text-indigo-600 hover:text-indigo-700 mt-1">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button className="w-full text-center text-sm text-indigo-600 hover:text-indigo-700 pt-2">
                View all events
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Alert Thresholds Configuration */}
        <motion.div
          className="bg-white rounded-xl p-5 shadow-sm border border-slate-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <h2 className="text-lg font-semibold text-slate-800 mb-5">Alert Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Heart Rate Alerts</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Min (bpm)</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    defaultValue={50}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Max (bpm)</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    defaultValue={100}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Blood Pressure Alerts</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Systolic</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    defaultValue={140}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Diastolic</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    defaultValue={90}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Oxygen Saturation</label>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Min (%)</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                  defaultValue={92}
                />
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-200 pt-5 space-y-3">
            <div className="flex items-center">
              <input 
                id="enableFallDetection" 
                type="checkbox" 
                className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300" 
                defaultChecked 
              />
              <label htmlFor="enableFallDetection" className="ml-2 text-sm text-slate-700">
                Enable Fall Detection
              </label>
            </div>
            
            <div className="flex items-center">
              <input 
                id="notifyCaregivers" 
                type="checkbox" 
                className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300" 
                defaultChecked 
              />
              <label htmlFor="notifyCaregivers" className="ml-2 text-sm text-slate-700">
                Notify caregivers for all alerts
              </label>
            </div>
            
            <div className="flex items-center">
              <input 
                id="emergencyServices" 
                type="checkbox" 
                className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300" 
              />
              <label htmlFor="emergencyServices" className="ml-2 text-sm text-slate-700">
                Contact emergency services for critical alerts
              </label>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg border border-slate-200">
              Reset to Default
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm">
              Save Changes
            </button>
          </div>
        </motion.div>
      </div>
    </PageContainer>
  );
};

export default HealthMonitoring;