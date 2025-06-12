import { Router } from 'express';

import {
  createRoomType,
  deleteRoomType,
  getRoomTypeById,
  listRoomType,
  updateRoomType,
} from '../controllers/roomTypeController';

const router = Router();

router.post('/create', createRoomType);
router.get('/list', listRoomType);
router.get('/detail', getRoomTypeById);
router.put('/update', updateRoomType);
router.delete('/delete', deleteRoomType);

export default router;
