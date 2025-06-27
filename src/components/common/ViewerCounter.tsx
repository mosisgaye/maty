import React, { useState, useEffect } from 'react';
import { Timer, Users } from 'lucide-react';

interface ViewerCounterProps {
  operatorName: string;
  productType: 'forfait' | 'box' | 'téléphone';
  className?: string;
}

const ViewerCounter: React.FC<ViewerCounterProps> = ({ 
  operatorName, 
  productType,
  className 
}) => {
  const [viewerCount, setViewerCount] = useState<number>(0);
  
  // Simulate random viewer count - in a real app, this would be from a real-time service
  useEffect(() => {
    const randomCount = Math.floor(Math.random() * 15) + 3; // Between 3-18 people
    setViewerCount(randomCount);
    
    // Simulate count changes periodically
    const interval = setInterval(() => {
      setViewerCount(prev => {
        // Random slight fluctuation, but keeps within reasonable bounds
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const newValue = Math.max(2, Math.min(20, prev + change));
        return newValue;
      });
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className={`flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/50 ${className || ''}`}>
      <Users className="h-4 w-4 text-primary" />
      <span>
        <strong>{viewerCount}</strong> personnes consultent {productType === 'forfait' ? 'ce' : 'cette'} {productType} {operatorName} en ce moment
      </span>
    </div>
  );
};

export default ViewerCounter;
