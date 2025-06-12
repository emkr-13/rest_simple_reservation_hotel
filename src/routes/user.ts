import { Router } from 'express';

import { editUser, getProfile } from '../controllers/userController';

const router = Router();

// Rute untuk mendapatkan profil user
router.get('/profile',  getProfile);

// Rute untuk mengedit user
router.post('/edit', editUser);

export default router;