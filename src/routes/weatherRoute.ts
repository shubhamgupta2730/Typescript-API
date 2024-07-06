import express from 'express';
import { getWeatherForecast } from '../controllers/weatherController';

const router = express.Router();

router.get('/weather', getWeatherForecast);

export default router;
