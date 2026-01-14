
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
  address: 'RUA RITA BATISTA 11A QD 14 LJ DOM BOSCO - CAMPO LINDO, SEROPÉDICA',
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
    price: 0,
    weight: '1 comprimido',
    category: 'Medicamentos',
    image_url: 'https://images.tcdn.com.br/img/editor/up/1063665/Simparic20mg.png',
    tag: 'Entrega Grátis',
    // Added missing stock_quantity
    stock_quantity: 10
  },
  {
    id: '2',
    brand: 'Quatree',
    name: 'Quatree Carne',
    description: 'Cachorros Adultos - Todas as raças.',
    price: 155.90,
    weight: '15kg-20kg',
    category: 'Rações',
    image_url: 'https://picsum.photos/seed/quatree1/400/400',
    tag: 'Destaque',
    // Added missing stock_quantity
    stock_quantity: 5
  },
  {
    id: '3',
    brand: 'A.R',
    name: 'Milho Grão',
    description: 'Milho em grão de alta qualidade.',
    price: 32.00,
    weight: '15kg',
    category: 'Rações',
    image_url: 'https://picsum.photos/seed/milho/400/400',
    // Added missing stock_quantity
    stock_quantity: 20
  },
  {
    id: '4',
    brand: 'WestDog',
    name: 'WestDog Adultos',
    description: 'Alimento completo para cães adultos.',
    price: 58.00,
    weight: '15kg',
    category: 'Rações',
    image_url: 'https://picsum.photos/seed/westdog/400/400',
    // Added missing stock_quantity
    stock_quantity: 8
  }
];
