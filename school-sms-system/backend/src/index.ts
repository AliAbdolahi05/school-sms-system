import express from 'express';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
const app = express();
app.use(express.json());

// Middleware
import { verifyToken, adminOnly, assistantOrAdmin } from './utils/auth';

// Routes
import authRoutes from './routes/auth';
import studentRoutes from './routes/students';
import absenceRoutes from './routes/absences';
import templateRoutes from './routes/templates';
import smsRoutes from './routes/sms';
import logRoutes from './routes/logs';

app.use('/api/auth', authRoutes);
app.use('/api/students', verifyToken, studentRoutes);
app.use('/api/absences', verifyToken, absenceRoutes);
app.use('/api/templates', verifyToken, assistantOrAdmin, templateRoutes);
app.use('/api/sms', verifyToken, assistantOrAdmin, smsRoutes);
app.use('/api/logs', verifyToken, logRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));