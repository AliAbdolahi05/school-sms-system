import express from 'express';
import { prisma } from '../index';
import { adminOnly } from '../utils/auth';

const router = express.Router();

router.get('/', adminOnly, async (req, res) => {
  const { studentId, sentById } = req.query;
  const where: any = {};
  if (studentId) where.studentId = parseInt(studentId as string);
  if (sentById) where.sentById = parseInt(sentById as string);
  const logs = await prisma.smsLog.findMany({ where, include: { student: true, sentBy: true } });
  res.json(logs);
});

export default router;