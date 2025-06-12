import { z } from 'zod';

export const roomSchema = z.object({
  id: z.string(),
  name: z.string(),
  roomNumber: z.number(),
  roomTypeId: z.string(),
});

export const createRoomRequestSchema = roomSchema.extend({
  name: z.string().min(1, 'Name is required'),
  roomNumber: z.number().min(1, 'Room number is required'),
  roomTypeId: z.string().min(1, 'Room type id is required'),
});

export const updateRoomRequestSchema = roomSchema.extend({
  name: z.string().min(1, 'Name is required'),
  roomNumber: z.number().min(1, 'Room number is required'),
  roomTypeId: z.string().min(1, 'Room type id is required'),
});

export const deleteRoomRequestSchema = roomSchema.extend({
  id: z.string().min(1, 'ID is required'),
});

export const getRoomRequestSchema = roomSchema.extend({
  id: z.string().min(1, 'ID is required'),
});
