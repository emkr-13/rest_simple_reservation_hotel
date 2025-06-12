import { z } from 'zod';

export const reservationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  roomId: z.string(),
  checkInDate: z.string(),
  checkOutDate: z.string(),
  totalAmount: z.number(),
});

export const createReservationRequestSchema = reservationSchema.extend({
  userId: z.string().min(1, 'User id is required'),
  roomId: z.string().min(1, 'Room id is required'),
  checkInDate: z.string().min(1, 'Check in date is required'),
  checkOutDate: z.string().min(1, 'Check out date is required'),
  totalAmount: z.number().min(1, 'Total amount is required'),
});

export const updateReservationRequestSchema = reservationSchema.extend({
  userId: z.string().min(1, 'User id is required'),
  roomId: z.string().min(1, 'Room id is required'),
  checkInDate: z.string().min(1, 'Check in date is required'),
  checkOutDate: z.string().min(1, 'Check out date is required'),
  totalAmount: z.number().min(1, 'Total amount is required'),
});

export const deleteReservationRequestSchema = reservationSchema.extend({
  id: z.string().min(1, 'ID is required'),
});

export const getReservationRequestSchema = reservationSchema.extend({
  id: z.string().min(1, 'ID is required'),
});
