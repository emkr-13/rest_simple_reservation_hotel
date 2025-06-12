import { Router } from 'express';

import {
  createRoom,
  deleteRoom,
  getRoomById,
  listRoom,
  updateRoom,
} from '../controllers/roomController';

const router = Router();

router.post('/create', createRoom);
router.get('/list', listRoom);
router.get('/detail', getRoomById);
router.put('/update', updateRoom);
router.delete('/delete', deleteRoom);

export default router;
