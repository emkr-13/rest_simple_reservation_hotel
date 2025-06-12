import { z } from 'zod';

export const paymentSchema = z.object({
  id: z.string(),
  reservationId: z.string(),
  amount: z.number(),
  paidAt: z.date(),
});

export const createPaymentRequestSchema = paymentSchema.extend({
  reservationId: z.string().min(1, 'Reservation id is required'),
  amount: z.number().min(1, 'Amount is required'),
  paidAt: z.date().min(new Date(), 'Paid at is required'),
});

export const updatePaymentRequestSchema = paymentSchema.extend({
  reservationId: z.string().min(1, 'Reservation id is required'),
  amount: z.number().min(1, 'Amount is required'),
  paidAt: z.date().min(new Date(), 'Paid at is required'),
});

export const deletePaymentRequestSchema = paymentSchema.extend({
  id: z.string().min(1, 'ID is required'),
});

export const getPaymentRequestSchema = paymentSchema.extend({
  id: z.string().min(1, 'ID is required'),
});