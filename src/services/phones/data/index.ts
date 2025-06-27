
import { Phone } from '@/types/phones';
import { getSamsungPhones } from './samsung';
import { getApplePhones } from './apple';
import { getOtherPhones } from './other';

// Export a consolidated function that returns all example phones
export const getAllExamplePhones = (): Phone[] => {
  return [
    ...getSamsungPhones(),
    ...getApplePhones(),
    ...getOtherPhones()
  ];
};

// Re-export individual brand phone getters
export { getSamsungPhones, getApplePhones, getOtherPhones };
