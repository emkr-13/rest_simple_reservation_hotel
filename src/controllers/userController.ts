import { db } from '../config/db';
import { users } from '../models/user';
import { eq } from 'drizzle-orm';
import { sendResponse } from '../utils/responseHelper';
import { Request, Response } from 'express';
import { editUserRequestSchema } from '../validator/user';

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id; // Ambil user ID dari token yang sudah diverifikasi

    if (!userId) {
      sendResponse(res, 400, 'Unauthorized');
    }
    // Cari user berdasarkan ID
    const [user] = await db.select().from(users).where(eq(users.id, userId));

    // Jika user tidak ditemukan
    if (!user) {
      sendResponse(res, 404, 'User not found');
      return;
    }
    const datauser = {
      email: user.email,
      name: user.name,
      usercreated: user.createdAt,
    };
    // Kirim response dengan data user
    sendResponse(res, 200, 'User profile retrieved successfully', datauser);
  } catch (error) {
    console.error('Error retrieving profile:', error);
    sendResponse(res, 500, 'Internal server error');
  }
};

export const editUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    if (!userId) {
      sendResponse(res, 400, 'Unauthorized');
    } // Ambil user ID dari token yang sudah diverifikasi
    const { name } = editUserRequestSchema.parse(req.body); // Ambil data dari request body

    // Validasi input
    if (!name) {
      sendResponse(res, 400, 'Name is required');
      return;
    }

    // Update user di database
    const updatedUser = await db.update(users).set({ name }).where(eq(users.id, userId));

    // Jika user tidak ditemukan
    if (!updatedUser) {
      sendResponse(res, 404, 'User not found');
      return;
    }

    // Kirim response sukses
    sendResponse(res, 200, 'User updated successfully');
  } catch (error) {
    console.error('Error editing user:', error);
    sendResponse(res, 500, 'Internal server error');
  }
};
