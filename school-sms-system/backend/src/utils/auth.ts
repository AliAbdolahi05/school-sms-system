import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface UserPayload {
  id: number;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export function generateToken(user: { id: number; role: string }) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'هیچ توکنی ارائه نشده است' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as UserPayload;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'توکن نامعتبر است' });
  }
}

export function adminOnly(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== 'ADMIN') return res.status(403).json({ message: 'فقط مدیر مجاز است' });
  next();
}

export function assistantOrAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role === 'ADMIN' || req.user?.role === 'ASSISTANT') return next();
  res.status(403).json({ message: 'فقط مدیر یا معاون مجاز است' });
}