
export interface Product {
  id: string;
  brand: string;
  name: string;
  description: string;
  price: number;
  weight?: string;
  category: string;
  image_url: string; // Armazenará URL ou Base64
  tag?: string;
  created_at?: string;
}

export interface OperationalHours {
  weekday: string;
  hours: string;
}

export interface CartItem extends Product {
  quantity: number;
}
