import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, Thermometer, Smile, AlertTriangle, Calendar, Clock, Volume2 } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer';
import { useAuth } from '../../context/AuthContext';

const HealthCard = ({ icon, title, value, unit, status, trend }: { 
  icon: React.ReactNode,
  title: string,
  value: string,
  unit: string,
  status: 'normal' | 'warning' | 'critical',
  trend?: 'up' | 'down' | 'stable'
}) => {
  const statusColor = {
    normal: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    critical: 'bg-rose-50 text-rose-700'
  };

  const trendIcon = {
    up: <span className="text-rose-500">↑</span>,
    down: <span className="text-emerald-500">↓</span>,
    stable: <span className="text-slate-400">→</span>
  };

  return (
    <motion.div 
      className="flex items-start p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`p-3 rounded-full mr-4 ${statusColor[status]}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium text-slate-600">{title}</h3>
        <p className="text-2xl font-semibold text-slate-800">
          {value} <span className="text-base font-normal text-slate-500">{unit}</span>
          {trend && <span className="ml-1 text-base">{trendIcon[trend]}</span>}
        </p>
      </div>
    </motion.div>
  );
};

const ReminderCard = ({ time, title, description }: {
  time: string,
  title: string,
  description: string
}) => {
  return (
    <motion.div 
      className="border border-slate-100 rounded-xl p-4 flex items-center bg-white hover:shadow transition-shadow"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg mr-4">
        <Clock size={18} />
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-slate-800">{title}</h4>
        <p className="text-slate-500 text-sm">{description}</p>
      </div>
      <div className="text-right">
        <p className="bg-slate-50 px-2 py-1 rounded text-slate-700 text-sm font-medium">{time}</p>
      </div>
    </motion.div>
  );
};

const ElderDashboard: React.FC = () => {
  const { user } = useAuth();
  const name = user?.name || 'User';
  
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
    <PageContainer title={`Hello, ${name.split(' ')[0]}`} subTitle="Welcome to your health dashboard">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Health Status Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Health Status</h2>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center">
              <Activity size={16} className="mr-1" />
              View Details
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <HealthCard 
              icon={<Heart size={20} />}
              title="Heart Rate"
              value="72"
              unit="bpm"
              status="normal"
              trend="stable"
            />
            
            <HealthCard 
              icon={<Activity size={20} />}
              title="Blood Pressure"
              value="128/85"
              unit="mmHg"
              status="warning"
              trend="up"
            />
            
            <HealthCard 
              icon={<Thermometer size={20} />}
              title="Body Temperature"
              value="98.6"
              unit="°F"
              status="normal"
            />
          </div>
        </section>
        
        {/* Emergency Button */}
        <motion.section 
          variants={itemVariants}
          className="bg-rose-50 border border-rose-100 rounded-xl p-4"
        >
          <div className="flex flex-col sm:flex-row items-center">
            <button className="bg-rose-600 hover:bg-rose-700 text-white py-3 px-6 rounded-full text-lg font-semibold shadow-md flex items-center transition-colors">
              <AlertTriangle size={20} className="mr-2" />
              Emergency SOS
            </button>
            
            <div className="mt-3 sm:mt-0 sm:ml-5 text-center sm:text-left">
              <h3 className="text-base font-medium text-rose-800">Need immediate help?</h3>
              <p className="text-rose-700 text-sm">Press the SOS button to alert your caregivers.</p>
            </div>
          </div>
        </motion.section>
        
        {/* Daily Reminders Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Today's Reminders</h2>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center">
              <Calendar size={16} className="mr-1" />
              View All
            </button>
          </div>
          
          <motion.div 
            variants={itemVariants}
            className="space-y-3"
          >
            <ReminderCard 
              time="8:00 AM"
              title="Morning Medication"
              description="Take your blood pressure pills with breakfast"
            />
            
            <ReminderCard 
              time="10:30 AM"
              title="Doctor's Appointment"
              description="Virtual check-up with Dr. Johnson"
            />
            
            <ReminderCard 
              time="4:00 PM"
              title="Light Exercise"
              description="15 minutes of stretching exercises"
            />
          </motion.div>
        </section>
        
        {/* Mood Indicator and Voice Assistant */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mood Indicator */}
          <motion.section variants={itemVariants}>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Emotional Wellness</h2>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
              <div className="flex items-center mb-5">
                <div className="bg-amber-50 text-amber-600 p-2 rounded-lg mr-3">
                  <Smile size={20} />
                </div>
                <div>
                  <h3 className="text-base font-medium text-slate-800">Your Mood Today</h3>
                  <p className="text-slate-500 text-sm">How are you feeling?</p>
                </div>
              </div>
              
              <div className="grid grid-cols-5 gap-2 mb-5">
                <button className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors flex flex-col items-center">
                  <span className="text-xl">😀</span>
                  <span className="text-xs mt-1">Great</span>
                </button>
                
                <button className="p-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors flex flex-col items-center">
                  <span className="text-xl">🙂</span>
                  <span className="text-xs mt-1">Good</span>
                </button>
                
                <button className="p-2 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors flex flex-col items-center">
                  <span className="text-xl">😐</span>
                  <span className="text-xs mt-1">Okay</span>
                </button>
                
                <button className="p-2 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors flex flex-col items-center">
                  <span className="text-xl">😔</span>
                  <span className="text-xs mt-1">Low</span>
                </button>
                
                <button className="p-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors flex flex-col items-center">
                  <span className="text-xl">😢</span>
                  <span className="text-xs mt-1">Bad</span>
                </button>
              </div>
              
              <p className="text-slate-500 text-xs">Last update: Today, 9:30 AM</p>
            </div>
          </motion.section>
          
          {/* Voice Assistant Shortcut */}
          <motion.section variants={itemVariants}>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Voice Assistant</h2>
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
              <div className="flex items-center">
                <div className="bg-indigo-600 text-white p-3 rounded-lg mr-4">
                  <Volume2 size={20} />
                </div>
                <div>
                  <h3 className="text-base font-medium text-indigo-900">Talk to ElderEase</h3>
                  <p className="text-indigo-800 text-sm">Ask questions, set reminders, or request help</p>
                </div>
              </div>
              
              <button className="w-full mt-5 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-base font-medium transition-colors">
                Start Voice Assistant
              </button>
            </div>
          </motion.section>
        </div>
      </motion.div>
    </PageContainer>
  );
};

export default ElderDashboard;
