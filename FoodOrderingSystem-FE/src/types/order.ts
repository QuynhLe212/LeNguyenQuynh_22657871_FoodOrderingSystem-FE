export interface CreateOrderItemRequest {
  foodId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  userId: number;
  username?: string;
  items?: CreateOrderItemRequest[];
  movieId?: number;
  movieTitle?: string;
  seatNumber?: string;
}

export interface OrderItem {
  id: number;
  foodId: number;
  foodName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id: number;
  userId: number;
  username: string;
  totalAmount?: number;
  movieId?: number;
  movieTitle?: string;
  seatNumber?: string;
  status: 'PENDING' | 'PAYMENT_COMPLETED' | 'PAYMENT_FAILED' | 'CREATED' | 'PAID' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
}
