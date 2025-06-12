import { z } from 'zod';

export const roomTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const createRoomTypeRequestSchema = roomTypeSchema.extend({
  name: z.string().min(1, 'Name is required'),
});

export const updateRoomTypeRequestSchema = roomTypeSchema.extend({
  name: z.string().min(1, 'Name is required'),
});

export const deleteRoomTypeRequestSchema = roomTypeSchema.extend({
  id: z.string().min(1, 'ID is required'),
});
