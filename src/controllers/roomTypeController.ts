import { db } from "../config/db";
import { roomTypes } from "../models/roomType​";
import { and, eq, ilike, isNull, sql } from "drizzle-orm";
import { sendResponse } from "../utils/responseHelper";
import { Request, Response } from "express";
import { createRoomTypeRequestSchema, deleteRoomTypeRequestSchema, updateRoomTypeRequestSchema } from "../validator/roomType";
import { pagination } from "../utils/helper";

export const createRoomType = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = createRoomTypeRequestSchema.parse(req.body);

        const existingRoomType = await db.select().from(roomTypes).where(eq(roomTypes.name, name));
        
        if (existingRoomType) {
            sendResponse(res, 400, "Room type already exists");
            return;
        }

        await db.insert(roomTypes).values({ name });
        
        sendResponse(res, 201, "Room type created successfully");
    } catch (error) {
        console.error("Error creating room type:", error);
        sendResponse(res, 500, "Internal server error");
    }
}

export const listRoomType = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1; // Default to page 1 if not provided
      const limit = parseInt(req.query.limit as string) || 10; // Default to 10 items per page if not provided
      const search = req.query.search as string | undefined; // Search parameter (optional)
  
      // Build the base query with soft delete filter
      let query = db
        .select()
        .from(roomTypes)
        .where(
          search
            ? and(isNull(roomTypes.deletedAt), ilike(roomTypes.name, `%${search}%`))
            : isNull(roomTypes.deletedAt)
        );
  
      // Count the total number of records in the database
      const [total] = await db
        .select({ count: sql<number>`count(*)` })
        .from(roomTypes)
        .where(
          search
            ? and(isNull(roomTypes.deletedAt), ilike(roomTypes.name, `%${search}%`))
            : isNull(roomTypes.deletedAt)
        );
  
      // Call the pagination helper function
      const paginationResult = await pagination(total.count, page, limit);
  
      // Fetch the data for the current page
      const data = await query.limit(limit).offset((page - 1) * limit);
  
      sendResponse(res, 200, "Room types retrieved successfully", {
        data,
        pagination: paginationResult,
      });
    } catch (error) {
      console.error("Error retrieving room types:", error);
      sendResponse(res, 500, "Internal server error");
    }
  };

  export const getRoomTypeById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const roomTypeId = req.body;
      if (!roomTypeId) {
        sendResponse(res, 400, "Room type ID is required");
        return;
      }
  
      // Fetch the room type by ID
      const roomType = await db
        .select()
        .from(roomTypes)  
        .where(and(eq(roomTypes.id, roomTypeId), isNull(roomTypes.deletedAt)));
  
      if (!roomType) {
        sendResponse(res, 404, "Room type not found");
        return;
      }
  
      sendResponse(res, 200, "Room type retrieved successfully", { data: roomType });
    } catch (error) {
      console.error("Error retrieving room type:", error);
      sendResponse(res, 500, "Internal server error");
    }
  };

  export const updateRoomType = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
        const { id, name } = updateRoomTypeRequestSchema.parse(req.body);

        const existingRoomType = await db.select().from(roomTypes).where(eq(roomTypes.id, id));
        
        if (!existingRoomType) {
            sendResponse(res, 404, "Room type not found");  
            return;
        }

        await db.update(roomTypes).set({ name }).where(eq(roomTypes.id, id));

        sendResponse(res, 200, "Room type updated successfully");
    } catch (error) {
        console.error("Error updating room type:", error);
        sendResponse(res, 500, "Internal server error");
    }
  };

  export const deleteRoomType = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
        const { id } = deleteRoomTypeRequestSchema.parse(req.body);

        const existingRoomType = await db.select().from(roomTypes).where(eq(roomTypes.id, id));
        
        if (!existingRoomType) {
            sendResponse(res, 404, "Room type not found");
            return;
        }

        await db.update(roomTypes).set({ deletedAt: new Date() }).where(eq(roomTypes.id, id));

        sendResponse(res, 200, "Room type deleted successfully");
    } catch (error) {
        console.error("Error deleting room type:", error);
        sendResponse(res, 500, "Internal server error");
    }
  };
