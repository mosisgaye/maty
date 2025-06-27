export interface Plan {
  id: number;
  name: string;
  data: string;
  price: string;
  features: string[];
  operator?: string;
  coverage?: string;
}
