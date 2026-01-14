
export interface Product {
  id: string;
  brand: string;
  name: string;
  description: string;
  price: number;
  weight?: string;
  category: string;
  image_url: string; 
  tag?: string;
  stock_quantity: number; // Novo campo para controle de estoque
  created_at?: string;
}

export interface OperationalHours {
  weekday: string;
  hours: string;
}

export interface CartItem extends Product {
  quantity: number;
}
