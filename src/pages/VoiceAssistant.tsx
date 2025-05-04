import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Send, Trash2, MessageSquare, Phone, PhoneOff } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateElderCareResponse } from './Model';
import PageContainer from '../components/layout/PageContainer';
import { useAuth } from '../context/AuthContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const VoiceAssistant: React.FC = () => {
  const { user } = useAuth();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'voice'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "👋 **Hello! I'm your ElderEase Assistant**\n\nHow can I help you today?",
      sender: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const remoteStream = useRef<MediaStream | null>(null);

  const quickSuggestions = [
    "What medications do I take today?",
    "Start video call with my daughter",
    "I'm feeling dizzy, what should I do?",
    "When is my next doctor's appointment?",
    "Remind me to take my pills at 2 PM",
    "What's my blood pressure reading?"
  ];

  // Initialize WebRTC
  const setupWebRTC = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStream.current = stream;
      
      const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
      peerConnection.current = new RTCPeerConnection(configuration);
      
      // Add local stream to connection
      stream.getTracks().forEach(track => {
        peerConnection.current?.addTrack(track, stream);
      });
      
      // Handle incoming tracks
      peerConnection.current.ontrack = (event) => {
        remoteStream.current = event.streams[0];
        // In a real app, you would attach this to an <audio> element
      };
      
      // ICE candidate handling
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          // Send the candidate to the remote peer (in a real app)
          console.log('ICE candidate:', event.candidate);
        }
      };
      
    } catch (error) {
      console.error('Error setting up WebRTC:', error);
      addSystemMessage("Could not access microphone. Please check permissions.");
    }
  };

  const addSystemMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'assistant',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputText('');
    setIsLoading(true);
    
    try {
      // Check if user wants to call
      if (inputText.toLowerCase().includes('call') || 
          inputText.toLowerCase().includes('video') || 
          inputText.toLowerCase().includes('contact')) {
        initiateCall();
      } else {
        const aiResponse = await generateElderCareResponse(inputText, messages);
        addSystemMessage(aiResponse);
        
        if (isSpeaking) {
          const utterance = new SpeechSynthesisUtterance(aiResponse.replace(/\*\*/g, ''));
          window.speechSynthesis.speak(utterance);
        }
      }
    } catch (error) {
      console.error("Error generating response:", error);
      addSystemMessage("I'm having trouble responding right now. Could you try again?");
    } finally {
      setIsLoading(false);
    }
  };

  const initiateCall = async () => {
    if (!peerConnection.current) {
      await setupWebRTC();
    }
    
    setIsCalling(true);
    addSystemMessage("📞 Preparing call connection...");
    
    try {
      // In a real app, you would exchange offer/answer with a signaling server
      const offer = await peerConnection.current?.createOffer();
      await peerConnection.current?.setLocalDescription(offer);
      
      // Simulate receiving an answer (in a real app, this would come from signaling)
      setTimeout(() => {
        if (isCalling) {
          addSystemMessage("✅ Call connected! Speak now.");
          
          if (isSpeaking) {
            const utterance = new SpeechSynthesisUtterance("Call connected. You can now speak.");
            window.speechSynthesis.speak(utterance);
          }
        }
      }, 1500);
      
    } catch (error) {
      console.error('Call setup failed:', error);
      addSystemMessage("❌ Could not start the call. Please try again.");
      setIsCalling(false);
    }
  };

  const endCall = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
      localStream.current = null;
    }
    
    remoteStream.current = null;
    setIsCalling(false);
    addSystemMessage("📞 Call ended.");
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      window.speechSynthesis.cancel();
    } else {
      setIsListening(true);
      setTimeout(() => {
        const simulatedQuery = quickSuggestions[Math.floor(Math.random() * quickSuggestions.length)];
        setInputText(simulatedQuery);
        setIsListening(false);
      }, 2000);
    }
  };

  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking);
    if (!isSpeaking && messages.length > 0) {
      const lastMessage = messages[messages.length - 1].text;
      const utterance = new SpeechSynthesisUtterance(lastMessage.replace(/\*\*/g, ''));
      window.speechSynthesis.speak(utterance);
    } else {
      window.speechSynthesis.cancel();
    }
  };

  const toggleCalling = () => {
    if (isCalling) {
      endCall();
    } else {
      initiateCall();
    }
  };

  const clearConversation = () => {
    setMessages([
      {
        id: 'welcome',
        text: "👋 **Hello! I'm your ElderEase Assistant**\n\nHow can I help you today?",
        sender: 'assistant',
        timestamp: new Date(),
      }
    ]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Clean up WebRTC on unmount
    return () => {
      if (peerConnection.current) {
        peerConnection.current.close();
      }
      if (localStream.current) {
        localStream.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

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
    <PageContainer 
      title="Voice Assistant" 
      subTitle="Your personal AI companion for health and wellness"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Assistant Controls */}
        <motion.section variants={itemVariants}>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full mr-4 ${activeTab === 'chat' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'}`}>
                  {activeTab === 'chat' ? <MessageSquare size={20} /> : <Mic size={20} />}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    {activeTab === 'chat' ? 'Chat Assistant' : 'Voice Assistant'}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {activeTab === 'chat' ? 
                      'Type your questions below' : 
                      'Speak or type your request'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setActiveTab('chat')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'chat' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  Chat Mode
                </button>
                <button 
                  onClick={() => setActiveTab('voice')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'voice' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  Voice Mode
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex space-x-2">
                <button 
                  onClick={toggleSpeaking} 
                  className={`p-2.5 rounded-full ${isSpeaking ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'} hover:bg-slate-200 transition-colors`}
                  title={isSpeaking ? "Mute assistant" : "Unmute assistant"}
                >
                  {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <button 
                  onClick={toggleCalling}
                  className={`p-2.5 rounded-full ${isCalling ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-slate-100 text-slate-600'} hover:bg-slate-200 transition-colors`}
                  title={isCalling ? "End call" : "Start call"}
                >
                  {isCalling ? <PhoneOff size={18} /> : <Phone size={18} />}
                </button>
                <button 
                  onClick={clearConversation}
                  className="p-2.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                  title="Clear conversation"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {activeTab === 'voice' && (
              <div className="bg-slate-50 p-4 rounded-lg mb-6">
                <div className="flex items-center justify-center">
                  <button 
                    onClick={toggleListening}
                    className={`p-4 rounded-full transition-all ${isListening ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                  >
                    {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                  </button>
                </div>
                <p className="text-center mt-3 text-sm text-slate-600">
                  {isListening ? "Listening... Speak now" : "Press the microphone button to speak"}
                </p>
                {isCalling && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center text-sm text-blue-700">
                    Call in progress... Speak normally
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.section>

        {/* Chat Area */}
        <motion.section variants={itemVariants}>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="space-y-4 h-[400px] overflow-y-auto pr-2">
              {messages.map(message => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-4 rounded-xl text-sm ${
                      message.sender === 'user' 
                        ? 'bg-blue-50 text-slate-800 rounded-br-none' 
                        : 'bg-slate-50 text-slate-800 rounded-bl-none'
                    }`}
                  >
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                    <p className="text-xs text-slate-500 mt-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-4 rounded-xl bg-slate-50 text-slate-800 rounded-bl-none">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </motion.section>

        {/* Input Area */}
        <motion.section variants={itemVariants}>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center mb-4">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={
                  activeTab === 'chat' 
                    ? "Type your message here..." 
                    : "Or type here if you prefer..."
                }
                className="flex-1 border border-slate-200 rounded-l-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isListening || isLoading}
              />
              
              <button 
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                className={`bg-blue-600 text-white p-3 rounded-r-lg ${!inputText.trim() || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'} transition-colors`}
              >
                <Send size={20} />
              </button>
            </div>

            <div>
              <p className="text-xs text-slate-500 mb-3 text-center">Quick suggestions</p>
              <div className="flex flex-wrap justify-center gap-2">
                {quickSuggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setInputText(suggestion)}
                    className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs transition-colors"
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </PageContainer>
  );
};

export default VoiceAssistant;