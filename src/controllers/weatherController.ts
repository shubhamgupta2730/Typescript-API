import axios from 'axios';
import { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.OPENWEATHERMAP_API_KEY as string;

export const getWeatherForecast = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { latitude, longitude, location } = req.query;

  if (!location && (!latitude || !longitude)) {
    res.status(400).json({
      message: 'Location name or latitude and longitude are required.',
    });
    return;
  }

  try {
    let response;
    if (location) {
      response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            q: location,
            appid: API_KEY,
            units: 'metric',
          },
        }
      );
    } else if (latitude && longitude) {
      response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            lat: latitude,
            lon: longitude,
            appid: API_KEY,
            units: 'metric',
          },
        }
      );
    }

    if (response && response.data) {
      const weatherData = {
        location: {
          city: response.data.name,
          country: response.data.sys.country,
        },
        weather: {
          description: response.data.weather[0].description,
          temperature: response.data.main.temp,
          humidity: response.data.main.humidity,
          windSpeed: response.data.wind.speed,
        },
      };

      res.status(200).json(weatherData);
    } else {
      res
        .status(500)
        .json({ message: 'Failed to fetch weather data. Please try again.' });
    }
  } catch (error) {
    console.error('Error fetching weather:', error);
    res
      .status(500)
      .json({ message: 'Failed to fetch weather data. Please try again.' });
  }
};
