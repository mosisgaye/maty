
export interface InternetBox {
  id: number;
  name: string;
  operator: string;
  price: string;
  downloadSpeed: string;
  uploadSpeed: string;
  wifiType: string;
  commitment?: string;
  tvOption?: string;
  callOption?: string;
  features: string[];
  image?: string;
  specialOffer?: string;
  operatorLogo?: React.ReactNode;
  affiliate_url?: string;
}

export type ConnectionType = 'all' | 'fibre' | 'adsl' | 'box4g';
export type SortOption = 'price-asc' | 'price-desc' | 'speed-asc' | 'speed-desc';
