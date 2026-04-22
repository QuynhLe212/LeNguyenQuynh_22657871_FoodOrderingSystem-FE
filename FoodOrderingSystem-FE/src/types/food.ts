export interface FoodItemRequest {
  name?: string;
  title?: string;
  description?: string;
  price?: number;
  ticketPrice?: number;
  category?: string;
  genre?: string;
  durationMinutes?: number;
  imageUrl?: string;
  posterUrl?: string;
  available?: boolean;
}

export interface FoodItem {
  id: number;
  name: string;
  title?: string;
  description?: string;
  price: number;
  ticketPrice?: number;
  category?: string;
  genre?: string;
  durationMinutes?: number;
  imageUrl?: string;
  posterUrl?: string;
  available: boolean;
  createdAt: string; // ISO 8601 string from LocalDateTime
  updatedAt: string; // ISO 8601 string from LocalDateTime
}
