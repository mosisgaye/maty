
import React from 'react';
import { Phone } from '@/types/phones';

interface PhoneStructuredDataProps {
  phones: Phone[];
}

const PhoneStructuredData: React.FC<PhoneStructuredDataProps> = ({ phones }) => {
  // Format data for structured data
  const phoneListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'itemListElement': phones.map((phone, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'Product',
        'name': `${phone.trademark} ${phone.title}`,
        'description': phone.description || `${phone.trademark} ${phone.title} - ${phone.storage}`,
        'image': phone.image,
        'brand': {
          '@type': 'Brand',
          'name': phone.trademark
        },
        'offers': {
          '@type': 'Offer',
          'price': phone.price,
          'priceCurrency': 'EUR',
          'availability': phone.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
        }
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(phoneListSchema) }}
    />
  );
};

export default PhoneStructuredData;
