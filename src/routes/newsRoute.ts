import express from 'express';
import { getDailyNews } from '../controllers/newsController';

const router = express.Router();

router.get('/news', getDailyNews);

export default router;
