import axios from 'axios';
import type { FoodItem, FoodItemRequest } from '../types/food';
import type { LoginRequest, RegisterRequest, UserAuthResponse, UserProfile } from '../types/user';
import type { PaymentRequest } from '../types/payment';
import type { CreateOrderRequest, Order } from '../types/order';

const gatewayUrl = import.meta.env.VITE_GATEWAY_URL ?? '/api';

const apiClient = (baseURL: string) =>
  axios.create({
    baseURL,
  });

const gatewayApi = apiClient(gatewayUrl);

export const authStorageKey = 'movie-ticket-auth';

export const authApi = {
  register: (payload: RegisterRequest) => gatewayApi.post<UserAuthResponse>('/users/register', payload),
  login: (payload: LoginRequest) => gatewayApi.post<UserAuthResponse>('/users/login', payload),
  getUsers: () => gatewayApi.get<UserProfile[]>('/users'),
};

export const foodServiceApi = {
  getFoods: () => gatewayApi.get<FoodItem[]>('/movies'),
  createFood: (payload: FoodItemRequest) => gatewayApi.post<FoodItem>('/movies', payload),
  updateFood: (id: number, payload: FoodItemRequest) => gatewayApi.put<FoodItem>(`/movies/${id}`, payload),
  deleteFood: (id: number) => gatewayApi.delete(`/movies/${id}`),
};

export const orderServiceApi = {
  createOrder: (payload: CreateOrderRequest) => gatewayApi.post<Order>('/bookings', payload),
  getOrders: () => gatewayApi.get<Order[]>('/bookings'),
};

export const paymentServiceApi = {
  createPayment: (payload: PaymentRequest) => gatewayApi.post<string>('/payments', payload),
};

export const bookingServiceApi = {
  createBooking: (payload: CreateOrderRequest) => gatewayApi.post<Order>('/bookings', payload),
  getBookings: () => gatewayApi.get<Order[]>('/bookings'),
};

export const normalizeErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as string) ?? error.message;
  }
  return 'Unexpected error';
};

export type { CreateOrderRequest };
