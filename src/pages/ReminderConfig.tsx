import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Clock, Calendar, Repeat, Plus, Edit2, Trash2, Volume2, Check, X, Filter, Search } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';

// Mock data for reminders
const initialReminders = [
  {
    id: 1,
    title: 'Morning Medication',
    description: 'Take blood pressure pills with breakfast',
    time: '08:00',
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    voice: true,
    category: 'medication'
  },
  {
    id: 2,
    title: 'Doctor\'s Appointment',
    description: 'Virtual check-up with Dr. Johnson',
    time: '10:30',
    days: ['friday'],
    voice: true,
    category: 'appointment'
  },
  {
    id: 3,
    title: 'Afternoon Walk',
    description: '15 minutes of light exercise',
    time: '15:00',
    days: ['monday', 'wednesday', 'friday'],
    voice: false,
    category: 'exercise'
  },
  {
    id: 4,
    title: 'Evening Medication',
    description: 'Take heart medication before dinner',
    time: '18:00',
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    voice: true,
    category: 'medication'
  },
  {
    id: 5,
    title: 'Call Family',
    description: 'Weekly video call with children',
    time: '19:00',
    days: ['sunday'],
    voice: false,
    category: 'social'
  }
];

// Categories
const categories = [
  { id: 'medication', name: 'Medication', color: 'bg-blue-100 text-blue-800' },
  { id: 'appointment', name: 'Appointment', color: 'bg-purple-100 text-purple-800' },
  { id: 'exercise', name: 'Exercise', color: 'bg-green-100 text-green-800' },
  { id: 'social', name: 'Social', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'other', name: 'Other', color: 'bg-gray-100 text-gray-800' }
];

interface Reminder {
  id: number;
  title: string;
  description: string;
  time: string;
  days: string[];
  voice: boolean;
  category: string;
}

const ReminderConfig: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [formData, setFormData] = useState<Omit<Reminder, 'id'>>({
    title: '',
    description: '',
    time: '',
    days: [],
    voice: false,
    category: 'other'
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      time: '',
      days: [],
      voice: false,
      category: 'other'
    });
  };

  const handleCreateReminder = () => {
    setIsCreating(true);
    resetForm();
  };

  const handleEditReminder = (reminder: Reminder) => {
    setIsEditing(reminder.id);
    setFormData({ ...reminder });
  };

  const handleDeleteReminder = (id: number) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
  };

  const handleSaveReminder = () => {
    if (!formData.title || !formData.time) return;

    if (isEditing) {
      setReminders(reminders.map(reminder => 
        reminder.id === isEditing ? { ...formData, id: isEditing } : reminder
      ));
      setIsEditing(null);
    } else {
      const newReminder = {
        ...formData,
        id: Math.max(0, ...reminders.map(r => r.id)) + 1
      };
      setReminders([...reminders, newReminder]);
      setIsCreating(false);
    }
    
    resetForm();
  };

  const handleCancelForm = () => {
    setIsCreating(false);
    setIsEditing(null);
    resetForm();
  };

  const handleDayToggle = (day: string) => {
    if (formData.days.includes(day)) {
      setFormData({
        ...formData,
        days: formData.days.filter(d => d !== day)
      });
    } else {
      setFormData({
        ...formData,
        days: [...formData.days, day]
      });
    }
  };

  const handleVoiceToggle = () => {
    setFormData({
      ...formData,
      voice: !formData.voice
    });
  };

  const filteredReminders = reminders
    .filter(reminder => filter === 'all' || reminder.category === filter)
    .filter(reminder => 
      reminder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reminder.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : 'bg-gray-100 text-gray-800';
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Other';
  };

  return (
    <PageContainer title="Reminder Configuration" subTitle="Create and manage your daily tasks">
      <div className="space-y-6">
        {/* Filter and Search Bar */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            
            {categories.map(category => (
              <button 
                key={category.id}
                onClick={() => setFilter(category.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filter === category.id 
                    ? 'bg-blue-500 text-white' 
                    : `${category.color} hover:opacity-80`
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search reminders..."
                className="pl-9 pr-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full max-w-[200px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button 
              onClick={handleCreateReminder}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1.5 rounded-lg flex items-center transition-colors"
            >
              <Plus size={16} className="mr-1.5" />
              New Reminder
            </button>
          </div>
        </motion.div>
        
        {/* Form for Creating/Editing Reminders */}
        {(isCreating || isEditing !== null) && (
          <motion.div 
            className="bg-white rounded-xl shadow-sm p-5"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-lg font-medium mb-4 text-gray-800">
              {isEditing !== null ? 'Edit Reminder' : 'Create New Reminder'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-3">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Reminder Title</label>
                  <input
                    id="title"
                    type="text"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter reminder title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    id="description"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 h-20"
                    placeholder="Enter reminder details"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    id="category"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      id="time"
                      type="time"
                      className="w-full pl-9 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Repeat on Days</label>
                  <div className="flex flex-wrap gap-1.5">
                    {['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDayToggle(day)}
                        className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                          formData.days.includes(day)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {day.charAt(0).toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center">
                    <input
                      id="voiceReminder"
                      type="checkbox"
                      className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                      checked={formData.voice}
                      onChange={handleVoiceToggle}
                    />
                    <label htmlFor="voiceReminder" className="ml-2 text-sm text-gray-800 font-medium flex items-center">
                      <Volume2 size={16} className="mr-1.5" />
                      Enable voice reminder
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-2">
              <button 
                onClick={handleCancelForm}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-3 py-1.5 rounded-lg flex items-center transition-colors"
              >
                <X size={16} className="mr-1.5" />
                Cancel
              </button>
              
              <button 
                onClick={handleSaveReminder}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1.5 rounded-lg flex items-center transition-colors"
              >
                <Check size={16} className="mr-1.5" />
                {isEditing !== null ? 'Update Reminder' : 'Create Reminder'}
              </button>
            </div>
          </motion.div>
        )}
        
        {/* Reminders List */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h2 className="text-lg font-medium text-gray-800 mb-2">
            {filter === 'all' ? 'All Reminders' : `${getCategoryName(filter)} Reminders`}
          </h2>
          
          {filteredReminders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <Bell size={40} className="mx-auto text-gray-300 mb-3" />
              <h3 className="text-base font-medium text-gray-600 mb-1">No reminders found</h3>
              <p className="text-gray-500 text-sm mb-5">
                {searchTerm 
                  ? "No reminders match your search criteria" 
                  : "You haven't created any reminders yet"}
              </p>
              <button 
                onClick={handleCreateReminder}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1.5 rounded-lg inline-flex items-center transition-colors"
              >
                <Plus size={16} className="mr-1.5" />
                Create Your First Reminder
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReminders.map((reminder) => (
                <motion.div 
                  key={reminder.id}
                  className="bg-white rounded-xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${getCategoryColor(reminder.category).split(' ')[0]} flex-shrink-0`}>
                      <Bell size={20} className={getCategoryColor(reminder.category).split(' ')[1]} />
                    </div>
                    
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-base font-medium text-gray-800">{reminder.title}</h3>
                        {reminder.voice && (
                          <Volume2 size={14} className="ml-1.5 text-blue-600" />
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-1">{reminder.description}</p>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center text-gray-500">
                          <Clock size={14} className="mr-1" />
                          {reminder.time}
                        </div>
                        
                        <div className="flex items-center text-gray-500">
                          <Repeat size={14} className="mr-1" />
                          {reminder.days.length === 7 
                            ? 'Daily' 
                            : reminder.days.length === 0 
                              ? 'Never' 
                              : reminder.days.map(d => d.charAt(0).toUpperCase()).join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button 
                      onClick={() => handleEditReminder(reminder)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-lg flex items-center transition-colors"
                    >
                      <Edit2 size={14} className="mr-1" />
                      Edit
                    </button>
                    
                    <button 
                      onClick={() => handleDeleteReminder(reminder.id)}
                      className="bg-red-100 hover:bg-red-200 text-red-800 text-xs px-2 py-1 rounded-lg flex items-center transition-colors"
                    >
                      <Trash2 size={14} className="mr-1" />
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
        
        {/* Upcoming Reminders - Improved Design */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium text-gray-800">Today's Schedule</h2>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-2.5 py-1 rounded-lg flex items-center transition-colors">
              <Calendar size={14} className="mr-1.5" />
              Full Calendar
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4">
            {/* Time Blocks - 3 columns for morning/afternoon/evening */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Morning Block (6AM-12PM) */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">Morning</h3>
                <div className="space-y-2">
                  {reminders
                    .filter(r => {
                      const hour = parseInt(r.time.split(':')[0]);
                      return hour >= 6 && hour < 12;
                    })
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map(reminder => (
                      <div key={reminder.id} className={`flex items-start p-2 rounded-lg ${getCategoryColor(reminder.category)}`}>
                        <div className={`w-2 h-2 rounded-full mt-1.5 ${getCategoryColor(reminder.category).replace('text', 'bg')}`}></div>
                        <div className="ml-2">
                          <div className="text-sm font-medium text-gray-800">{reminder.title}</div>
                          <div className="text-xs text-gray-600 flex items-center">
                            <Clock size={12} className="mr-1" />
                            {reminder.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  {reminders.filter(r => {
                    const hour = parseInt(r.time.split(':')[0]);
                    return hour >= 6 && hour < 12;
                  }).length === 0 && (
                    <div className="text-sm text-gray-400 italic p-2">No morning reminders</div>
                  )}
                </div>
              </div>
              
              {/* Afternoon Block (12PM-6PM) */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-lg">Afternoon</h3>
                <div className="space-y-2">
                  {reminders
                    .filter(r => {
                      const hour = parseInt(r.time.split(':')[0]);
                      return hour >= 12 && hour < 18;
                    })
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map(reminder => (
                      <div key={reminder.id} className={`flex items-start p-2 rounded-lg ${getCategoryColor(reminder.category)}`}>
                        <div className={`w-2 h-2 rounded-full mt-1.5 ${getCategoryColor(reminder.category).replace('text', 'bg')}`}></div>
                        <div className="ml-2">
                          <div className="text-sm font-medium text-gray-800">{reminder.title}</div>
                          <div className="text-xs text-gray-600 flex items-center">
                            <Clock size={12} className="mr-1" />
                            {reminder.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  {reminders.filter(r => {
                    const hour = parseInt(r.time.split(':')[0]);
                    return hour >= 12 && hour < 18;
                  }).length === 0 && (
                    <div className="text-sm text-gray-400 italic p-2">No afternoon reminders</div>
                  )}
                </div>
              </div>
              
              {/* Evening Block (6PM-12AM) */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-lg">Evening</h3>
                <div className="space-y-2">
                  {reminders
                    .filter(r => {
                      const hour = parseInt(r.time.split(':')[0]);
                      return hour >= 18 || hour < 6;
                    })
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map(reminder => (
                      <div key={reminder.id} className={`flex items-start p-2 rounded-lg ${getCategoryColor(reminder.category)}`}>
                        <div className={`w-2 h-2 rounded-full mt-1.5 ${getCategoryColor(reminder.category).replace('text', 'bg')}`}></div>
                        <div className="ml-2">
                          <div className="text-sm font-medium text-gray-800">{reminder.title}</div>
                          <div className="text-xs text-gray-600 flex items-center">
                            <Clock size={12} className="mr-1" />
                            {reminder.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  {reminders.filter(r => {
                    const hour = parseInt(r.time.split(':')[0]);
                    return hour >= 18 || hour < 6;
                  }).length === 0 && (
                    <div className="text-sm text-gray-400 italic p-2">No evening reminders</div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Current Time Indicator */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-600">
                <Clock size={14} className="mr-2 text-blue-500" />
                Current time: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </PageContainer>
  );
};

export default ReminderConfig;