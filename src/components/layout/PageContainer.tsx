import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import { Bell, User } from 'lucide-react';

interface PageContainerProps {
  children: React.ReactNode;
  title: string;
  subTitle?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, title, subTitle }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const role = user?.role || 'elder';

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar role={role} />
      
      <main className="flex-1 ml-64">
        <header className="bg-white shadow-soft px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">{title}</h1>
            {subTitle && <p className="text-sm text-neutral-500">{subTitle}</p>}
          </div>
          
          <div className="flex items-center space-x-6">
            <button className="relative p-2 rounded-full hover:bg-neutral-100 transition-colors">
              <Bell size={24} className="text-neutral-700" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-error-500"></span>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <User size={20} className="text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-neutral-800">{user?.name || 'User'}</p>
                <p className="text-xs text-neutral-500 capitalize">{role}</p>
              </div>
            </div>
          </div>
        </header>
        
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default PageContainer;