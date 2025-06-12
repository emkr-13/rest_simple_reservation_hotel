import { db } from '../config/db';
import { rooms } from '../models/room​';
import { and, eq, ilike, isNull, sql } from 'drizzle-orm';
import { sendResponse } from '../utils/responseHelper';
import { Request, Response } from 'express';
import {
  createRoomRequestSchema,
  deleteRoomRequestSchema,
  updateRoomRequestSchema,
  getRoomRequestSchema,
  listRoomRequestSchema,
} from '../validator/room';
import { pagination } from '../utils/helper';
import { roomTypes } from '@models/roomType​';

export const createRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, roomNumber, roomTypeId } = createRoomRequestSchema.parse(req.body);

    const existingRoom = await db.select().from(rooms).where(eq(rooms.roomNumber, roomNumber));

    if (existingRoom) {
      sendResponse(res, 400, 'Room already exists');
      return;
    }

    await db.insert(rooms).values({ name, roomNumber, roomTypeId });

    sendResponse(res, 201, 'Room created successfully');
  } catch (error) {
    console.error('Error creating room:', error);
    sendResponse(res, 500, 'Internal server error');
  }
};

export const listRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit, search } = listRoomRequestSchema.parse(req.query);

     // Build the base query with soft delete filter
     const query = db
     .select()
     .from(rooms)
     .where(
       search
         ? and(isNull(rooms.deletedAt), ilike(rooms.name, `%${search}%`))
         : isNull(rooms.deletedAt),
     );

   // Count the total number of records in the database
   const [total] = await db
     .select({ count: sql<number>`count(*)` })
     .from(rooms)
     .where(
       search
         ? and(isNull(rooms.deletedAt), ilike(rooms.name, `%${search}%`))
         : isNull(rooms.deletedAt),
     );

   // Call the pagination helper function
   const paginationResult = await pagination(total.count, page, limit);

   // Fetch the data for the current page
   const data = await query.limit(limit).offset((page - 1) * limit);

   sendResponse(res, 200, 'Rooms retrieved successfully', {
     data,
     pagination: paginationResult,
   });
  } catch (error) {
    console.error('Error listing rooms:', error);
    sendResponse(res, 500, 'Internal server error');
  }
};

export const getRoomById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = getRoomRequestSchema.parse(req.body);

    const room = await db.select().from(rooms).where(eq(rooms.id, id));

    if (!room) {
      sendResponse(res, 404, 'Room not found');
      return;
    }

    sendResponse(res, 200, 'Room retrieved successfully', { data: room });
  } catch (error) {
    console.error('Error retrieving room:', error);
    sendResponse(res, 500, 'Internal server error');
  }
};

export const updateRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, name, roomNumber, roomTypeId } = updateRoomRequestSchema.parse(req.body);

    const existingRoom = await db.select().from(rooms).where(eq(rooms.id, id));

    if (!existingRoom) {
      sendResponse(res, 404, 'Room not found');
      return;
    }

    await db.update(rooms).set({ name, roomNumber, roomTypeId }).where(eq(rooms.id, id));

    sendResponse(res, 200, 'Room updated successfully');
  } catch (error) {
    console.error('Error updating room:', error);
    sendResponse(res, 500, 'Internal server error');
  }
};

export const deleteRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = deleteRoomRequestSchema.parse(req.body);

    const existingRoom = await db.select().from(rooms).where(eq(rooms.id, id));

    if (!existingRoom) {
      sendResponse(res, 404, 'Room not found');
      return;
    }

    await db.update(rooms).set({ deletedAt: new Date() }).where(eq(rooms.id, id));

    sendResponse(res, 200, 'Room deleted successfully');
  } catch (error) {
    console.error('Error deleting room:', error);
    sendResponse(res, 500, 'Internal server error');
  }
};
