import React from 'react';
import { Phone as PhoneType } from '@/types/phones';
import PhoneCardGrid from './PhoneCardGrid';
import PhoneCardList from './PhoneCardList';

interface PhoneCardProps {
  phone: PhoneType;
  viewType: 'grid' | 'list';
  isInComparison: boolean;
  onCompareToggle: () => void;
}

const PhoneCard = ({ 
  phone, 
  viewType, 
  isInComparison,
  onCompareToggle 
}: PhoneCardProps) => {
  // Return the appropriate view based on viewType
  return viewType === 'grid' ? (
    <PhoneCardGrid 
      phone={phone} 
      isInComparison={isInComparison} 
      onCompareToggle={onCompareToggle} 
    />
  ) : (
    <PhoneCardList 
      phone={phone} 
      isInComparison={isInComparison} 
      onCompareToggle={onCompareToggle} 
    />
  );
};

export default PhoneCard;