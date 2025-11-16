import express from 'express';
import { prisma } from '../index';
import { assistantOrAdmin } from '../utils/auth';
import { smsService } from '../services/smsService';
import { renderTemplate } from '../utils/templateRenderer';
import z from 'zod';

const router = express.Router();

const absenceSchema = z.object({
  studentId: z.number(),
  date: z.string().date(),
  reason: z.string().optional(),
  sendSms: z.boolean().optional(),
});

router.get('/', assistantOrAdmin, async (req, res) => {
  const absences = await prisma.absence.findMany({ include: { student: true } });
  res.json(absences);
});

router.get('/student/:studentId', assistantOrAdmin, async (req, res) => {
  const { studentId } = req.params;
  const absences = await prisma.absence.findMany({ where: { studentId: parseInt(studentId) } });
  const count = await prisma.absence.count({ where: { studentId: parseInt(studentId) } });
  res.json({ absences, count });
});

router.post('/', assistantOrAdmin, async (req, res) => {
  const { studentId, date, reason, sendSms } = absenceSchema.parse(req.body);
  const absence = await prisma.absence.create({ data: { studentId, date: new Date(date), reason: reason || 'غیبت' } });

  if (sendSms) {
    const student = await prisma.student.findUnique({ where: { id: studentId } });
    const template = await prisma.template.findUnique({ where: { name: 'absence' } });
    if (student && template) {
      const absenceCount = await prisma.absence.count({ where: { studentId } });
      const message = renderTemplate(template.content, {
        studentName: `${student.firstName} ${student.lastName}`,
        date: date,
        reason: reason || 'غیبت',
        absenceCount: absenceCount.toString(),
      });
      const success = await smsService.send(student.parentPhone, message);
      await prisma.smsLog.create({
        data: {
          studentId,
          messageType: 'absence',
          messageContent: message,
          success,
          sentById: req.user!.id,
        },
      });
      await prisma.absence.update({ where: { id: absence.id }, data: { sentSms: true } });
    }
  }
  res.json(absence);
});

export default router;