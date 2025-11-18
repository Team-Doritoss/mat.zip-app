export interface Restaurant {
  id: string;
  name: string;
  category: string;
  rating: number;
  address: string;
  phone: string;
  hours: string;
  latitude: number;
  longitude: number;
  images: string[];
  features: string[];
  summary: string;
  reviewCount: number;
  priceRange?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  restaurants?: Restaurant[];
}
