
import { Category, Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Nike Air Max Pulse',
    brand: 'Nike',
    category: Category.SHOES,
    price: 10400,
    originalPrice: 12800,
    rating: 4.8,
    reviews: 1240,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1605405748313-a416a1b84491?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'Iconic cushioning meets a sleek, sporty design. Perfect for everyday style.',
    stock: 45,
    isAssured: true
  },
  {
    id: '2',
    name: 'Sauvage Eau de Parfum',
    brand: 'Dior',
    category: Category.PERFUMES,
    price: 7600,
    originalPrice: 8800,
    rating: 4.9,
    reviews: 5600,
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'A powerful and noble fragrance with a raw and fresh trail.',
    stock: 30,
    isAssured: true
  },
  {
    id: '3',
    name: 'Apple Watch Series 9',
    brand: 'Apple',
    category: Category.WATCHES,
    price: 31900,
    originalPrice: 34300,
    rating: 4.7,
    reviews: 890,
    images: [
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'The most powerful watch yet. Features an always-on display and crash detection.',
    stock: 12,
    isAssured: true
  },
  {
    id: '4',
    name: 'Premium Leather Classic',
    brand: 'Fossil',
    category: Category.BELTS,
    price: 3600,
    originalPrice: 5200,
    rating: 4.5,
    reviews: 210,
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb80583dc?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'Genuine leather belt with a timeless design for any formal occasion.',
    stock: 100,
    isAssured: false
  },
  {
    id: '5',
    name: 'Classic Aviator RB3025',
    brand: 'Ray-Ban',
    category: Category.GOGGLES,
    price: 13200,
    originalPrice: 15600,
    rating: 4.6,
    reviews: 3400,
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'The original pilot style sunglasses. Timeless and universally loved.',
    stock: 25,
    isAssured: true
  }
];

export const MOCK_ADMIN: any = {
  id: 'admin-1',
  name: 'Store Manager',
  email: 'admin@shopper.com',
  role: 'ADMIN'
};

export const MOCK_CUSTOMER: any = {
  id: 'cust-1',
  name: 'John Doe',
  email: 'john@gmail.com',
  role: 'CUSTOMER'
};
