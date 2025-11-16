import express from 'express';
import { prisma } from '../index';
import z from 'zod';

const router = express.Router();

const templateSchema = z.object({
  name: z.string(),
  content: z.string(),
});

router.get('/', async (req, res) => {
  const templates = await prisma.template.findMany();
  res.json(templates);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const data = templateSchema.parse(req.body);
  const template = await prisma.template.update({ where: { id: parseInt(id) }, data });
  res.json(template);
});

export default router;