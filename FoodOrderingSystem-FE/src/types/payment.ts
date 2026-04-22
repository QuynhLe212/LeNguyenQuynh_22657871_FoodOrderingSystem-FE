export interface Payment {
  id: string;
  orderId?: number;
  bookingId?: number;
  paymentMethod: string;
  status: string;
  createdAt: string; // ISO 8601 string from LocalDateTime
}

export interface PaymentRequest {
  orderId?: number;
  bookingId?: number;
  paymentMethod: string;
  username: string;
}
