import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { generalLimiter } from './middleware/rateLimiter.middleware.js';
import errorHandler from './middleware/errorHandler.middleware.js';
import routes from './routes/index.js';

dotenv.config();
const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(mongoSanitize());
app.use(hpp());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

app.use('/api', generalLimiter);

app.use('/api', routes);

app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

app.use('*', (req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

app.use(errorHandler);

export default app;
