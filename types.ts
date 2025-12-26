
export enum Category {
  SHOES = 'Shoes',
  PERFUMES = 'Perfumes',
  WATCHES = 'Watches',
  BELTS = 'Belts',
  GOGGLES = 'Goggles',
  ELECTRONICS = 'Electronics'
}

export enum OrderStatus {
  PENDING = 'Order Placed',
  PROCESSING = 'Packed',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  images: string[];
  description: string;
  stock: number;
  isAssured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  shippingAddress: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
}
