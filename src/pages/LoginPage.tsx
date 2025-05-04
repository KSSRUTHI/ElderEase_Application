import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      await login(email, password);
      navigate('/elder/dashboard');
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-neutral-50 flex flex-col items-center justify-center p-4">
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Heart size={48} className="text-primary-500 mx-auto" />
        <h1 className="text-3xl font-bold text-primary-800 mt-2">NeuroCare: ElderEase</h1>
        <p className="text-neutral-600 mt-1">Empowering Elderly Care with AI</p>
      </motion.div>
      
      <div className="w-full max-w-5xl mx-auto overflow-hidden rounded-elder shadow-elder">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left side - Login Form */}
          <motion.div 
            className="bg-white p-8 md:p-12"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-md mx-auto">
              <h2 className="text-elder-heading text-center mb-8">Welcome Back</h2>
              
              {error && (
                <div className="mb-6 p-4 bg-error-50 border border-error-100 text-error-700 rounded-lg">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                      <Mail size={20} />
                    </span>
                    <input
                      id="email"
                      type="email"
                      className="form-input pl-10"
                      placeholder="john.doe@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <div className="flex justify-between mb-2">
                    <label htmlFor="password" className="form-label">Password</label>
                    <Link to="/forgot-password" className="text-primary-600 hover:text-primary-700 text-sm">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                      <Lock size={20} />
                    </span>
                    <input
                      id="password"
                      type="password"
                      className="form-input pl-10"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary btn-large w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Logging in...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Login <ArrowRight className="ml-2" size={20} />
                    </span>
                  )}
                </button>
                
                <p className="text-center text-elder-body text-neutral-600">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </motion.div>
          
          {/* Right side - Illustration */}
          <motion.div 
            className="bg-primary-500 p-8 md:p-12 text-white hidden md:flex md:flex-col md:justify-center"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="max-w-md mx-auto">
              <h2 className="text-elder-heading mb-6">Compassionate Care at Your Fingertips</h2>
              <p className="text-elder-body mb-8 text-primary-50">
                Our AI-powered platform brings peace of mind to elders and caregivers alike. 
                Access health monitoring, emotional support, and emergency services all in one place.
              </p>
              
              <img 
                src="https://images.pexels.com/photos/7551617/pexels-photo-7551617.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Elderly care" 
                className="rounded-xl shadow-lg w-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;