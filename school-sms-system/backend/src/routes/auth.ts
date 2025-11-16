import express from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../index';
import { generateToken } from '../utils/auth';
import z from 'zod';

const router = express.Router();

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'نام کاربری یا رمز عبور اشتباه است' });
    }
    const token = generateToken({ id: user.id, role: user.role });
    res.json({ token, role: user.role });
  } catch (e) {
    res.status(400).json({ message: 'ورودی نامعتبر' });
  }
});

// For initial setup, admin can create users
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { username, password: hashed, role } });
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: 'خطا در ثبت' });
  }
});

export default router;