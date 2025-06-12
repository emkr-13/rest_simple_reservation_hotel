import { db } from '../config/db';
import { reservations } from '../models/reservation​';
import { payments } from '../models/payment';
import { and, eq, gte, lte, sql } from 'drizzle-orm';
import { sendResponse } from '../utils/responseHelper';
import { Request, Response } from 'express';
import {
  createReservationRequestSchema,
  getReservationRequestSchema,
} from '../validator/reservation​';
import { createPaymentRequestSchema } from '../validator/payment';
import { isNull } from 'drizzle-orm';

// Create a new reservation
export const createReservation = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id; // Ambil user ID dari token yang sudah diverifikasi

    const { roomId, checkInDate, checkOutDate, totalAmount } = createReservationRequestSchema.parse({
      ...req.body,
      userId: userId, // Assuming we have user from auth middleware
    });

    // Check for overlapping reservations
    const overlappingReservations = await db
      .select()
      .from(reservations)
      .where(
        and(
          eq(reservations.roomId, roomId),
          sql`${reservations.checkInDate} <= ${checkOutDate}`,
          sql`${reservations.checkOutDate} >= ${checkInDate}`,
          isNull(reservations.deletedAt)
        )
      );

    if (overlappingReservations.length > 0) {
      sendResponse(res, 400, 'Room is already reserved for these dates');
      return;
    }

    // Create the reservation
    const [newReservation] = await db
      .insert(reservations)
      .values({
        roomId,
        userId: userId,
        checkInDate: new Date(checkInDate),
        checkOutDate: new Date(checkOutDate),
        totalAmount,
      })
      .returning();

    // If initial payment is provided
    if (req.body.initialPayment) {
      await db.insert(payments).values({
        reservationId: newReservation.id,
        amount: req.body.initialPayment,
        paidAt: new Date(),
      });
    }

    sendResponse(res, 201, 'Reservation created successfully', newReservation);
  } catch (error) {
    console.error('Error creating reservation:', error);
    sendResponse(res, 500, 'Internal server error');
  }
};

// Get reservations by date range
export const getReservations = async (req: Request, res: Response): Promise<void> => {
  try {
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    if (!startDate || !endDate) {
      sendResponse(res, 400, 'Start date and end date are required');
      return;
    }

    // Find all reservations that overlap with the given date range
    const overlappingReservations = await db
      .select({
        id: reservations.id,
        roomId: reservations.roomId,
        checkInDate: reservations.checkInDate,
        checkOutDate: reservations.checkOutDate,
        totalAmount: reservations.totalAmount,
      })
      .from(reservations)
      .where(
        and(
          sql`${reservations.checkInDate} <= ${endDate}`,
          sql`${reservations.checkOutDate} >= ${startDate}`,
          isNull(reservations.deletedAt)
        )
      );

    sendResponse(res, 200, 'Reservations retrieved successfully', overlappingReservations);
  } catch (error) {
    console.error('Error getting reservations:', error);
    sendResponse(res, 500, 'Internal server error');
  }
};

// Add payment to a reservation
export const addPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: reservationId } = getReservationRequestSchema.parse({ id: req.params.id });
    const { amount } = createPaymentRequestSchema.parse(req.body);

    // Get the reservation
    const reservation = await db
      .select()
      .from(reservations)
      .where(and(eq(reservations.id, reservationId), isNull(reservations.deletedAt)))
      .limit(1);

    if (!reservation.length) {
      sendResponse(res, 404, 'Reservation not found');
      return;
    }

    // Get total payments made so far
    const totalPayments = await db
      .select({ sum: sql<number>`sum(${payments.amount})` })
      .from(payments)
      .where(eq(payments.reservationId, reservationId));

    const currentTotal = totalPayments[0].sum || 0;
    const remainingBalance = reservation[0].totalAmount - currentTotal;

    if (amount > remainingBalance) {
      sendResponse(res, 400, 'Payment amount exceeds remaining balance');
      return;
    }

    // Add the new payment
    const [newPayment] = await db
      .insert(payments)
      .values({
        reservationId,
        amount,
        paidAt: new Date(),
      })
      .returning();

    const response = {
      payment: newPayment,
      remainingBalance: remainingBalance - amount,
    };

    sendResponse(res, 201, 'Payment added successfully', response);
  } catch (error) {
    console.error('Error adding payment:', error);
    sendResponse(res, 500, 'Internal server error');
  }
}; 