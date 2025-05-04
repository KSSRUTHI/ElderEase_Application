import React from 'react';
import { Clock, Heart } from 'lucide-react';

interface ActivityItemProps {
  type: 'health' | 'medication' | 'appointment' | 'system' | 'caregiver';
  title: string;
  description: string;
  time: string;
  status?: 'normal' | 'warning' | 'critical';
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  type,
  title,
  description,
  time,
  status = 'normal'
}) => {
  const getBorderColor = () => {
    if (status === 'critical') return 'border-error-500';
    if (status === 'warning') return 'border-warning-500';
    
    switch (type) {
      case 'health':
        return 'border-primary-500';
      case 'medication':
        return 'border-success-500';
      case 'appointment':
        return 'border-accent-500';
      case 'caregiver':
        return 'border-primary-500';
      default:
        return 'border-neutral-500';
    }
  };

  return (
    <div className={`border-l-2 ${getBorderColor()} pl-4 py-3`}>
      <div className="flex justify-between">
        <p className="font-medium">{title}</p>
        <span className="text-sm text-neutral-500 flex items-center">
          <Clock size={14} className="mr-1" /> {time}
        </span>
      </div>
      <p className="text-neutral-600">{description}</p>
    </div>
  );
};

export default ActivityItem;
