import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smile, Star, Send, MessageSquare, ThumbsUp, Award } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';

// Mock testimonials
const testimonials = [
  {
    id: 1,
    name: "Dorothy M.",
    role: "Elder",
    content: "This app has been a lifesaver for me. I feel much safer knowing my caregivers can check in on me, and the medication reminders have helped me stay on track with my health.",
    rating: 5,
    date: "May 15, 2023"
  },
  {
    id: 2,
    name: "James W.",
    role: "Caregiver",
    content: "As a caregiver for my mother, this system gives me peace of mind. I can check her vitals remotely and make sure she's taking her medication on time.",
    rating: 4,
    date: "April 28, 2023"
  },
  {
    id: 3,
    name: "Sarah T.",
    role: "Elder",
    content: "The voice assistant is wonderful! It's like having a companion who helps me remember important things and checks how I'm feeling.",
    rating: 5,
    date: "June 2, 2023"
  }
];

interface RatingInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  icon?: React.ReactNode;
}

const RatingInput: React.FC<RatingInputProps> = ({ label, value, onChange, icon }) => {
  return (
    <div className="mb-6">
      <label className="form-label flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </label>
      
      <div className="flex space-x-2 mt-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className={`h-12 w-12 rounded-full flex items-center justify-center text-lg transition-colors ${
              value >= rating
                ? 'bg-primary-500 text-white'
                : 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200'
            }`}
          >
            {rating}
          </button>
        ))}
      </div>
      
      <div className="flex justify-between mt-1 text-sm text-neutral-500 px-1">
        <span>Poor</span>
        <span>Excellent</span>
      </div>
    </div>
  );
};

interface TestimonialCardProps {
  testimonial: typeof testimonials[0];
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <motion.div 
      className="elder-card border border-neutral-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start mb-4">
        <div className="bg-primary-100 text-primary-700 p-2 rounded-full mr-3">
          <MessageSquare size={24} />
        </div>
        <div>
          <p className="font-medium text-lg">{testimonial.name}</p>
          <p className="text-neutral-500 text-sm">{testimonial.role}</p>
        </div>
      </div>
      
      <p className="text-neutral-700 mb-4 italic">"{testimonial.content}"</p>
      
      <div className="flex items-center justify-between">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={18} 
              className={i < testimonial.rating ? 'text-warning-500 fill-warning-500' : 'text-neutral-300'} 
            />
          ))}
        </div>
        <p className="text-sm text-neutral-500">{testimonial.date}</p>
      </div>
    </motion.div>
  );
};

const FeedbackPage: React.FC = () => {
  const [formData, setFormData] = useState({
    satisfactionRating: 0,
    easeOfUseRating: 0,
    helpfulnessRating: 0,
    feedbackText: '',
    name: '',
    email: '',
    role: '',
    contactConsent: false
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleRatingChange = (field: string, value: number) => {
    setFormData({ ...formData, [field]: value });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Feedback submitted:', formData);
    setIsSubmitted(true);
    
    // Reset form after a delay
    setTimeout(() => {
      setFormData({
        satisfactionRating: 0,
        easeOfUseRating: 0,
        helpfulnessRating: 0,
        feedbackText: '',
        name: '',
        email: '',
        role: '',
        contactConsent: false
      });
      setIsSubmitted(false);
    }, 5000);
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
    <PageContainer title="Feedback & Suggestions" subTitle="Help us improve your experience">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Feedback Form */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-2"
        >
          <div className="elder-card">
            <h2 className="text-xl font-medium text-neutral-800 mb-6">Share Your Thoughts</h2>
            
            {isSubmitted ? (
              <motion.div 
                className="bg-success-50 border border-success-200 rounded-lg p-6 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-success-100 text-success-700 p-3 rounded-full inline-flex mb-4">
                  <ThumbsUp size={28} />
                </div>
                <h3 className="text-xl font-medium text-success-800 mb-2">Thank You for Your Feedback!</h3>
                <p className="text-success-700 mb-4">Your input helps us improve NeuroCare for everyone.</p>
                <p className="text-neutral-600">
                  We appreciate your time and will use your suggestions to make our service even better.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <RatingInput
                    label="Overall Satisfaction"
                    value={formData.satisfactionRating}
                    onChange={(value) => handleRatingChange('satisfactionRating', value)}
                    icon={<Smile size={20} />}
                  />
                  
                  <RatingInput
                    label="Ease of Use"
                    value={formData.easeOfUseRating}
                    onChange={(value) => handleRatingChange('easeOfUseRating', value)}
                  />
                  
                  <RatingInput
                    label="Helpfulness"
                    value={formData.helpfulnessRating}
                    onChange={(value) => handleRatingChange('helpfulnessRating', value)}
                  />
                  
                  <div className="form-group">
                    <label htmlFor="feedbackText" className="form-label">
                      Detailed Feedback
                    </label>
                    <textarea
                      id="feedbackText"
                      name="feedbackText"
                      rows={4}
                      className="form-input"
                      placeholder="Please share your experience, suggestions, or any issues you've encountered..."
                      value={formData.feedbackText}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  
                  <div className="border-t border-b border-neutral-200 py-6 my-6">
                    <h3 className="text-lg font-medium text-neutral-800 mb-4">About You (Optional)</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="form-group">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className="form-input"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="form-input"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="form-group mt-4">
                      <label htmlFor="role" className="form-label">Your Role</label>
                      <select
                        id="role"
                        name="role"
                        className="form-input"
                        value={formData.role}
                        onChange={handleInputChange}
                      >
                        <option value="">Select your role</option>
                        <option value="elder">Elder</option>
                        <option value="caregiver">Caregiver</option>
                        <option value="admin">Administrator</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div className="form-group mt-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="contactConsent"
                          name="contactConsent"
                          className="h-5 w-5 rounded text-primary-600 focus:ring-primary-500 border-neutral-300"
                          checked={formData.contactConsent}
                          onChange={handleCheckboxChange}
                        />
                        <label htmlFor="contactConsent" className="ml-2 text-neutral-700">
                          I agree to be contacted about my feedback if needed
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button 
                      type="submit" 
                      className="btn bg-success-600 hover:bg-success-700 text-white focus:ring-success-500 flex items-center"
                    >
                      <Send size={18} className="mr-2" />
                      Submit Feedback
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </motion.div>
        
        {/* Testimonials */}
        <motion.div variants={itemVariants}>
          <div className="sticky top-8">
            <h2 className="text-xl font-medium text-neutral-800 mb-6 flex items-center">
              <Award size={24} className="text-primary-600 mr-2" />
              User Testimonials
            </h2>
            
            <div className="space-y-6">
              {testimonials.map(testimonial => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
            
            <div className="elder-card mt-6 bg-primary-50 border border-primary-100">
              <div className="flex items-center mb-4">
                <div className="bg-primary-200 text-primary-800 p-2 rounded-full mr-3">
                  <MessageSquare size={20} />
                </div>
                <h3 className="text-lg font-medium text-primary-800">Your Feedback Matters</h3>
              </div>
              <p className="text-primary-700">
                We're constantly working to improve NeuroCare. Your feedback helps us understand what's working and what could be better.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </PageContainer>
  );
};

export default FeedbackPage;