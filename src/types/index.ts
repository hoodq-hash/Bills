export interface User {
  _id: string;
  name: string;
  role: "admin" | "user";
}

export interface Product {
  _id: string;
  title: string;
  image?: string;
  description: string;
  category: string;
  price: number;
  design: string;
  currency: string;
  mog: string;
  bills_quantity: string;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  _id: string;
  title: string;
  image?: string;
  quantity: number;
  selectedAmount: string;
  price: number;
}

export interface ProductFormData {
  title: string;
  description: string;
  price: string;
  category: string;
  image: string | null;
  design: string;
  currency: string;
  mog: string;
  bills_quantity: string;
}

export interface AuthContextValue {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

export interface CartContextValue {
  cartItems: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: string, selectedAmount: string) => void;
  updateItemQuantity: (
    productId: string,
    selectedAmount: string,
    newQuantity: number
  ) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getCartItemsCount: () => number;
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed";

export interface OrderCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
}

export interface OrderAddress {
  country: string;
  city: string;
  zipCode: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  receiptNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  shippingMethod: string;
  customer: OrderCustomer;
  billing: OrderAddress;
  shippingAddress?: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrderPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  country: string;
  city: string;
  zipCode: string;
  notes?: string;
  shippingAddress?: string | null;
  items: CartItem[];
  shippingMethod: string;
  paymentMethod: string;
  subtotal: number;
  shippingCost: number;
  discount?: number;
  total: number;
}

export interface AdminStats {
  totalOrders: number;
  pendingOrders: number;
  paidOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
}
