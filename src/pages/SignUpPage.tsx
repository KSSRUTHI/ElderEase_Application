import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Mail, Lock, User, ArrowRight, UserCog } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

type UserRole = 'elder' | 'caregiver' | 'admin';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  ageGroup: string;
  role: UserRole;
}

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    ageGroup: '',
    role: 'elder',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signup, loading } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (role: UserRole) => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const { name, email, password, confirmPassword, ageGroup, role } = formData;
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      await signup(name, email, password, role, ageGroup);
      const dashboardRoute = role === 'elder' 
        ? '/elder/dashboard' 
        : role === 'caregiver' 
          ? '/caregiver/dashboard' 
          : '/admin/dashboard';
      
      navigate(dashboardRoute);
    } catch (error) {
      setError('Failed to create an account. Please try again.');
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
      
      <div className="bg-white w-full max-w-4xl rounded-elder shadow-elder">
        <motion.div 
          className="p-8 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-elder-heading text-center mb-8">Create Your Account</h2>
            
            {error && (
              <div className="mb-6 p-4 bg-error-50 border border-error-100 text-error-700 rounded-lg">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-group">
                <label className="form-label">I am a:</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('elder')}
                    className={`p-4 rounded-lg border text-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                      formData.role === 'elder'
                        ? 'bg-primary-100 border-primary-300 text-primary-800'
                        : 'border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    <User size={24} className="mx-auto mb-2" />
                    <span className="font-medium">Elder</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('caregiver')}
                    className={`p-4 rounded-lg border text-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                      formData.role === 'caregiver'
                        ? 'bg-primary-100 border-primary-300 text-primary-800'
                        : 'border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    <Heart size={24} className="mx-auto mb-2" />
                    <span className="font-medium">Caregiver</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('admin')}
                    className={`p-4 rounded-lg border text-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                      formData.role === 'admin'
                        ? 'bg-primary-100 border-primary-300 text-primary-800'
                        : 'border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    <UserCog size={24} className="mx-auto mb-2" />
                    <span className="font-medium">Admin</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                      <User size={20} />
                    </span>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className="form-input pl-10"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                      <Mail size={20} />
                    </span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="form-input pl-10"
                      placeholder="john.doe@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                      <Lock size={20} />
                    </span>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      className="form-input pl-10"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                      <Lock size={20} />
                    </span>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      className="form-input pl-10"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              
              {formData.role === 'elder' && (
                <div className="form-group">
                  <label htmlFor="ageGroup" className="form-label">Age Group</label>
                  <select
                    id="ageGroup"
                    name="ageGroup"
                    className="form-input"
                    value={formData.ageGroup}
                    onChange={handleChange}
                  >
                    <option value="">Select Age Group</option>
                    <option value="60-69">60-69 years</option>
                    <option value="70-79">70-79 years</option>
                    <option value="80-89">80-89 years</option>
                    <option value="90+">90+ years</option>
                  </select>
                </div>
              )}
              
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
                    Creating Account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Create Account <ArrowRight className="ml-2" size={20} />
                  </span>
                )}
              </button>
              
              <p className="text-center text-elder-body text-neutral-600">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  Log in
                </Link>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUpPage;