import express from 'express';
import { prisma } from '../index';
import { smsService } from '../services/smsService';
import { renderTemplate } from '../utils/templateRenderer';
import z from 'zod';

const router = express.Router();

const sendSchema = z.object({
  studentId: z.number(),
  type: z.string(),
  customMessage: z.string().optional(),
  variables: z.record(z.string()).optional(),
});

router.post('/send', async (req, res) => {
  const { studentId, type, customMessage, variables } = sendSchema.parse(req.body);
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) return res.status(404).json({ message: 'دانش آموز یافت نشد' });

  let message = customMessage;
  if (!message) {
    const template = await prisma.template.findUnique({ where: { name: type } });
    if (!template) return res.status(404).json({ message: 'الگو یافت نشد' });
    message = renderTemplate(template.content, variables || {});
  }

  const success = await smsService.send(student.parentPhone, message);
  await prisma.smsLog.create({
    data: {
      studentId,
      messageType: type,
      messageContent: message,
      success,
      sentById: req.user!.id,
    },
  });
  res.json({ success });
});

export default router;