import { Router } from 'express';
import { createReservation, getReservations, addPayment } from '../controllers/reservationController';


const router = Router();

// Create a new reservation
router.post('/create', createReservation);

// Get reservations by date range
router.get('/list', getReservations);

// Add payment to a reservation
router.post('/:id/payments', addPayment);

export default router; 