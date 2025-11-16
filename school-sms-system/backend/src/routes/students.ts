import express from 'express';
import { prisma } from '../index';
import { adminOnly } from '../utils/auth';
import z from 'zod';

const router = express.Router();

const studentSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  grade: z.string(),
  parentPhone: z.string(),
});

router.get('/', adminOnly, async (req, res) => {
  const students = await prisma.student.findMany();
  res.json(students);
});

router.post('/', adminOnly, async (req, res) => {
  const data = studentSchema.parse(req.body);
  const student = await prisma.student.create({ data });
  res.json(student);
});

router.put('/:id', adminOnly, async (req, res) => {
  const { id } = req.params;
  const data = studentSchema.parse(req.body);
  const student = await prisma.student.update({ where: { id: parseInt(id) }, data });
  res.json(student);
});

router.delete('/:id', adminOnly, async (req, res) => {
  const { id } = req.params;
  await prisma.student.delete({ where: { id: parseInt(id) } });
  res.json({ message: 'حذف شد' });
});

export default router;