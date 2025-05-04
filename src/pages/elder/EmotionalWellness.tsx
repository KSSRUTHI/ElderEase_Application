import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smile, Calendar, Music, Zap, Heart, Film, BookOpen, Coffee, PieChart, ArrowLeft, ArrowRight } from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for mood history
const moodData = [
  { date: '06/01', mood: 4, note: 'Had a great video call with family' },
  { date: '06/02', mood: 3, note: 'Normal day, finished a book' },
  { date: '06/03', mood: 3, note: 'Went for a nice walk' },
  { date: '06/04', mood: 2, note: 'Feeling a bit tired' },
  { date: '06/05', mood: 1, note: 'Not sleeping well, worried about appointment' },
  { date: '06/06', mood: 2, note: 'Doctor appointment went well' },
  { date: '06/07', mood: 3, note: 'Made cookies with neighbor' },
  { date: '06/08', mood: 4, note: 'Beautiful weather, spent time in garden' },
  { date: '06/09', mood: 3, note: 'Quiet day, read newspaper' },
  { date: '06/10', mood: 3, note: 'Called old friend, good conversation' },
];

// Mock data for voice emotion
const voiceEmotionData = [
  { id: 1, timestamp: '10:15 AM', emotion: 'Happy', confidence: '87%', context: 'Talking about grandchildren' },
  { id: 2, timestamp: '2:30 PM', emotion: 'Calm', confidence: '92%', context: 'Reading news' },
  { id: 3, timestamp: '5:45 PM', emotion: 'Concerned', confidence: '78%', context: 'Discussing medication' },
  { id: 4, timestamp: 'Yesterday', emotion: 'Content', confidence: '85%', context: 'Evening routine' },
  { id: 5, timestamp: '2 days ago', emotion: 'Tired', confidence: '90%', context: 'Before bedtime' },
];

// Wellness suggestions
const wellnessSuggestions = [
  {
    category: 'Music',
    icon: <Music size={20} />,
    title: 'Relaxing Classical',
    description: 'Mozart and Bach compositions for relaxation',
  },
  {
    category: 'Exercise',
    icon: <Zap size={20} />,
    title: 'Chair Yoga',
    description: 'Gentle stretches you can do while seated',
  },
  {
    category: 'Meditation',
    icon: <Heart size={20} />,
    title: '5-min Breathing',
    description: 'Simple guided breathing exercise',
  },
  {
    category: 'Nature',
    icon: <Film size={20} />,
    title: 'Garden Birds',
    description: 'Calming video of birds in garden',
  },
  {
    category: 'Reading',
    icon: <BookOpen size={20} />,
    title: 'Short Stories',
    description: 'Collection of uplifting short reads',
  },
  {
    category: 'Social',
    icon: <Coffee size={20} />,
    title: 'Community Chat',
    description: 'Join the morning community discussion',
  },
];

// Mood emojis mapping
const moodEmojis = [
  { value: 0, emoji: '😢', label: 'Very Sad' },
  { value: 1, emoji: '😔', label: 'Sad' },
  { value: 2, emoji: '😐', label: 'Neutral' },
  { value: 3, emoji: '🙂', label: 'Good' },
  { value: 4, emoji: '😀', label: 'Great' },
];

const EmotionalWellness: React.FC = () => {
  const [currentDate] = useState(new Date());
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodNote, setMoodNote] = useState('');
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleMoodSelection = (mood: number) => {
    setSelectedMood(mood);
  };

  const handleSubmitMood = () => {
    console.log('Mood submitted:', { mood: selectedMood, note: moodNote, date: new Date() });
    setSelectedMood(null);
    setMoodNote('');
    alert('Your mood has been recorded!');
  };

  return (
    <PageContainer title="Emotional Wellness" subTitle="Track and improve your emotional health">
      <div className="space-y-6 font-sans">
        {/* Today's Mood Tracker */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-medium text-gray-800">Today's Mood Check-in</h2>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar size={16} className="mr-1" />
              {formatDate(currentDate)}
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-800 mb-4">How are you feeling today?</h3>
            
            <div className="grid grid-cols-5 gap-3 mb-5">
              {moodEmojis.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => handleMoodSelection(mood.value)}
                  className={`p-3 rounded-lg flex flex-col items-center transition-all duration-200 ${
                    selectedMood === mood.value
                      ? 'bg-blue-50 ring-2 ring-blue-300 shadow-sm'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-3xl mb-1">{mood.emoji}</span>
                  <span className="text-xs font-medium text-gray-700">{mood.label}</span>
                </button>
              ))}
            </div>
            
            <div className="mb-5">
              <label htmlFor="moodNote" className="block text-sm font-medium text-gray-700 mb-1">Add a note (optional)</label>
              <textarea
                id="moodNote"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                placeholder="What's on your mind today?"
                value={moodNote}
                onChange={(e) => setMoodNote(e.target.value)}
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleSubmitMood}
                disabled={selectedMood === null}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  selectedMood === null 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Record Today's Mood
              </button>
            </div>
          </div>
        </motion.section>
        
        {/* Mood History */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-medium text-gray-800">Mood History</h2>
            <button className="flex items-center px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              <Calendar size={14} className="mr-1" />
              View Calendar
            </button>
          </div>
          
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-5">
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <ArrowLeft size={16} />
              </button>
              <h3 className="text-base font-medium text-gray-700">June 2023</h3>
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <ArrowRight size={16} />
              </button>
            </div>
            
            <div className="h-56 mb-5">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[0, 4]} 
                    ticks={[0, 1, 2, 3, 4]} 
                    stroke="#6b7280"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      const mood = moodEmojis.find(m => m.value === value);
                      return mood ? mood.emoji : '';
                    }}
                  />
                  <Tooltip 
                    formatter={(value, name) => {
                      const mood = moodEmojis.find(m => m.value === value);
                      return [mood ? mood.label : '', 'Mood'];
                    }}
                    contentStyle={{ 
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      fontSize: '12px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#3b82f6' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-base font-medium text-gray-700">Recent Entries</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-3 py-2 text-left text-gray-700 font-medium">Date</th>
                      <th className="px-3 py-2 text-left text-gray-700 font-medium">Mood</th>
                      <th className="px-3 py-2 text-left text-gray-700 font-medium">Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {moodData.slice(0, 5).map((entry, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2">{entry.date}</td>
                        <td className="px-3 py-2">
                          <span className="text-xl">{moodEmojis[entry.mood].emoji}</span>
                          <span className="ml-2 text-gray-600">{moodEmojis[entry.mood].label}</span>
                        </td>
                        <td className="px-3 py-2 text-gray-600">{entry.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.section>
        
        {/* Voice Emotion Recognition */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-medium text-gray-800">Voice Emotion Analysis</h2>
            <button className="flex items-center px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              <PieChart size={14} className="mr-1" />
              Detailed Report
            </button>
          </div>
          
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="mb-5">
              <div className="flex flex-wrap gap-3 mb-5">
                <div className="p-3 rounded-lg bg-blue-50 flex-1 min-w-[120px]">
                  <h3 className="text-sm font-medium text-blue-800 mb-1">Primary Tone</h3>
                  <p className="text-xl font-semibold text-blue-700">Calm</p>
                </div>
                
                <div className="p-3 rounded-lg bg-green-50 flex-1 min-w-[120px]">
                  <h3 className="text-sm font-medium text-green-800 mb-1">Weekly Trend</h3>
                  <p className="text-xl font-semibold text-green-700">Positive</p>
                </div>
                
                <div className="p-3 rounded-lg bg-purple-50 flex-1 min-w-[120px]">
                  <h3 className="text-sm font-medium text-purple-800 mb-1">Stress Level</h3>
                  <p className="text-xl font-semibold text-purple-700">Low</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Our AI analyzes your voice patterns during conversations to detect emotional states. 
                This helps us provide personalized wellness suggestions.
              </p>
              
              <h3 className="text-base font-medium text-gray-700 mb-2">Recent Voice Analysis</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-3 py-2 text-left text-gray-700 font-medium">Time</th>
                      <th className="px-3 py-2 text-left text-gray-700 font-medium">Emotion Detected</th>
                      <th className="px-3 py-2 text-left text-gray-700 font-medium">Confidence</th>
                      <th className="px-3 py-2 text-left text-gray-700 font-medium">Context</th>
                    </tr>
                  </thead>
                  <tbody>
                    {voiceEmotionData.map(entry => (
                      <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2">{entry.timestamp}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            entry.emotion === 'Happy' || entry.emotion === 'Content'
                              ? 'bg-green-100 text-green-800'
                              : entry.emotion === 'Calm'
                                ? 'bg-blue-100 text-blue-800'
                                : entry.emotion === 'Tired'
                                  ? 'bg-gray-100 text-gray-800'
                                  : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {entry.emotion}
                          </span>
                        </td>
                        <td className="px-3 py-2">{entry.confidence}</td>
                        <td className="px-3 py-2 text-gray-600">{entry.context}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.section>
        
        {/* Wellness Suggestions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-medium text-gray-800">Wellness Suggestions</h2>
            <div className="text-sm text-gray-600 font-medium">
              Based on your recent mood and activities
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wellnessSuggestions.map((suggestion, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <div className="flex items-center mb-3">
                  <div className={`p-2 rounded-full mr-3 ${
                    suggestion.category === 'Music' ? 'bg-blue-100 text-blue-600' :
                    suggestion.category === 'Exercise' ? 'bg-green-100 text-green-600' :
                    suggestion.category === 'Meditation' ? 'bg-purple-100 text-purple-600' :
                    suggestion.category === 'Nature' ? 'bg-green-100 text-green-600' :
                    suggestion.category === 'Reading' ? 'bg-blue-100 text-blue-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {suggestion.icon}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{suggestion.category}</p>
                    <h3 className="text-base font-medium text-gray-800">{suggestion.title}</h3>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 flex-grow">{suggestion.description}</p>
                
                <button className="w-full mt-auto px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  Try Now
                </button>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </PageContainer>
  );
};

export default EmotionalWellness;