
import { Product, OperationalHours } from './types';

export const COLORS = {
  primary: '#002395', // Royal Blue
  secondary: '#FFD700', // Vibrant Yellow
  accent: '#E60000', // Red
  white: '#FFFFFF'
};

export const CONTACT = {
  whatsapp: '5521998703626',
  displayPhone: '(21) 99870-3626',
  address: 'Campo Tiradentes | Centro km40 - Seropédica/RJ',
  instagram: '@ar_casaderacoes'
};

export const OPERATIONAL_HOURS: OperationalHours[] = [
  { weekday: 'Segunda - Sexta', hours: '08:00 - 18:00' },
  { weekday: 'Sábado', hours: '08:00 - 14:00' },
  { weekday: 'Domingo', hours: 'Fechado' }
];

// Data extracted from images (OCR)
export const PRODUCTS_DATA: Product[] = [
  {
    id: '1',
    brand: 'Zoetis',
    name: 'Simparic 20mg',
    description: 'Proteção contra pulgas, carrapatos e sarnas.',
    price: 0, // Price was not explicitly in this specific image tag, but highlighted as "Entrega Grátis"
    weight: '1 comprimido',
    category: 'Cachorro',
    // Fix: Changed imageUrl to image_url
    image_url: 'https://images.tcdn.com.br/img/editor/up/1063665/Simparic20mg.png',
    tag: 'Entrega Grátis'
  },
  {
    id: '2',
    brand: 'Quatree',
    name: 'Quatree Carne',
    description: 'Cachorros Adultos - Todas as raças.',
    price: 155.90,
    weight: '15kg-20kg',
    category: 'Cachorro',
    // Fix: Changed imageUrl to image_url
    image_url: 'https://picsum.photos/seed/quatree1/400/400',
    tag: 'Destaque'
  },
  {
    id: '3',
    brand: 'A.R',
    name: 'Milho Grão',
    description: 'Milho em grão de alta qualidade.',
    price: 32.00,
    weight: '15kg',
    category: 'Aves',
    // Fix: Changed imageUrl to image_url
    image_url: 'https://picsum.photos/seed/milho/400/400'
  },
  {
    id: '4',
    brand: 'WestDog',
    name: 'WestDog Adultos',
    description: 'Alimento completo para cães adultos.',
    price: 58.00,
    weight: '15kg',
    category: 'Cachorro',
    // Fix: Changed imageUrl to image_url
    image_url: 'https://picsum.photos/seed/westdog/400/400'
  },
  {
    id: '5',
    brand: 'Canister',
    name: 'Canister Premium Original',
    description: 'Cachorros Adultos - Alta performance.',
    price: 69.99,
    weight: '15kg',
    category: 'Cachorro',
    // Fix: Changed imageUrl to image_url
    image_url: 'https://picsum.photos/seed/canister/400/400'
  },
  {
    id: '6',
    brand: 'Goldog',
    name: 'Goldog Premium Carne e Ossinhos',
    description: 'Cachorros Adultos - Proteína hidrolisada.',
    price: 85.90,
    weight: '15kg',
    category: 'Cachorro',
    // Fix: Changed imageUrl to image_url
    image_url: 'https://picsum.photos/seed/goldog/400/400'
  },
  {
    id: '7',
    brand: 'Quatree Gourmet',
    name: 'Gatos Castrados Mix Carnes',
    description: '4 fontes de proteínas de origem animal.',
    price: 174.90,
    weight: '10kg',
    category: 'Gato',
    // Fix: Changed imageUrl to image_url
    image_url: 'https://picsum.photos/seed/quatreegourmet/400/400'
  },
  {
    id: '8',
    brand: 'Quatree Gourmet',
    name: 'Gatos Castrados Delícias do Mar',
    description: 'Sabor Salmão e Peixe Branco.',
    price: 149.90,
    weight: '10kg',
    category: 'Gato',
    // Fix: Changed imageUrl to image_url
    image_url: 'https://picsum.photos/seed/quatreeocean/400/400'
  },
  {
    id: '9',
    brand: 'Toro',
    name: 'Toro Adultos',
    description: 'Ração econômica de qualidade.',
    price: 74.90,
    weight: '15kg',
    category: 'Cachorro',
    // Fix: Changed imageUrl to image_url
    image_url: 'https://picsum.photos/seed/toro/400/400'
  },
  {
    id: '10',
    brand: 'Avatar',
    name: 'Avatar Carne',
    description: 'Cachorros Adultos - Sabor Carne.',
    price: 79.90,
    weight: '15kg',
    category: 'Cachorro',
    // Fix: Changed imageUrl to image_url
    image_url: 'https://picsum.photos/seed/avatar/400/400'
  },
  {
    id: '11',
    brand: 'Papa Tudo',
    name: 'Papa Tudo Mix',
    description: 'Cachorros Adultos - Mix de sabores.',
    price: 78.90,
    weight: '15kg',
    category: 'Cachorro',
    // Fix: Changed imageUrl to image_url
    image_url: 'https://picsum.photos/seed/papatudo1/400/400'
  },
  {
    id: '12',
    brand: 'Papa Tudo',
    name: 'Papa Tudo Original',
    description: 'Cachorros Adultos - Formulação original.',
    price: 75.90,
    weight: '15kg',
    category: 'Cachorro',
    // Fix: Changed imageUrl to image_url
    image_url: 'https://picsum.photos/seed/papatudo2/400/400'
  }
];
