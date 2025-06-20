import { db } from '../config/db';
import { users } from '../models/user';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { sendResponse } from '../utils/responseHelper';
import { generateJwtToken, generateRefreshToken } from '../utils/helper';
import { registerRequestSchema, loginRequestSchema } from '../validator/user';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validasi input
    const { email, password } = loginRequestSchema.parse(req.body);

    if (!email || !password) {
      sendResponse(res, 400, 'Email and password are required');
    }

    // Cari user berdasarkan username
    const [user] = await db.select().from(users).where(eq(users.email, email));

    // Jika user tidak ditemukan
    if (!user) {
      sendResponse(res, 401, 'Invalid credentials');
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      sendResponse(res, 401, 'Invalid credentials');
      return;
    }

    // Generate token
    let authToken: string, refreshToken: string | undefined;

    try {
      const jwtResponse = await generateJwtToken({ id: user.id });
      authToken = jwtResponse.token ?? '';
      // Provide a fallback empty string if token is undefined
      const refreshTokenResponse = await generateRefreshToken({ id: user.id });
      refreshToken = refreshTokenResponse.token ?? ''; // Provide a fallback empty string if token is undefined
      if (!refreshToken) {
        throw new Error('Refresh token generation failed');
      }
    } catch (error) {
      console.error('JWT generation failed:', error);
      sendResponse(res, 501, 'Token generation failed');
      return;
    }

    // Update refresh token di database
    try {
      await db
        .update(users)
        .set({
          refreshToken,
          refreshTokenExp: new Date(Date.now() + parseInt(process.env.REFRESH_TOKEN_EXP!) * 1000),
        })
        .where(eq(users.id, user.id));
    } catch (dbError) {
      console.error('Database update failed:', dbError);
      sendResponse(res, 500, 'Failed to update refresh token');
      return;
    }

    sendResponse(res, 200, 'Login successful', {
      token: authToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Unexpected error during login:', error);
    sendResponse(res, 500, 'An unexpected error occurred', error);
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = registerRequestSchema.parse(req.body);

    if (!email || !password || !name) {
      sendResponse(res, 400, 'Email, password, and name are required');
      return;
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser) {
      sendResponse(res, 400, 'Email already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru ke database
    await db.insert(users).values({
      email,
      password: hashedPassword,
      name,
    });

    sendResponse(res, 201, 'User registered successfully');
  } catch (error) {
    console.error('Error during registration:', error);
    sendResponse(res, 500, 'Registration failed', error);
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // Ambil user ID dari request (dari middleware authenticate)
    const userId = (req as any).user.id;

    if (!userId) {
      sendResponse(res, 400, 'Unauthorized');
    }

    // Hapus refresh token dari database
    await db
      .update(users)
      .set({
        refreshToken: null,
        refreshTokenExp: null,
      })
      .where(eq(users.id, userId));

    sendResponse(res, 200, 'Logout successful');
  } catch (error) {
    console.error('Error during logout:', error);
    sendResponse(res, 500, 'Logout failed', error);
  }
};
