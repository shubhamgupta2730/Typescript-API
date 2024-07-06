import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import logger from './logger';
import authRoutes from './routes/authRoute';
import weatherRoutes from './routes/weatherRoute';
import newsRoutes from './routes/newsRoute';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api', weatherRoutes);
app.use('/api', newsRoutes);

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
