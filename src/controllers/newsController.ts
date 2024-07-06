import axios from 'axios';
import { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const NEWSAPI_KEY = process.env.NEWSAPI_KEY as string;

interface Article {
  title: string;
  description: string;
  url: string;
  source: {
    name: string;
  };
  publishedAt: string;
}

export const getDailyNews = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { query } = req.query;

  if (!query) {
    res.status(400).json({
      message: 'Query parameter is required.',
    });
    return;
  }

  try {
    const response = await axios.get(`https://newsapi.org/v2/everything`, {
      params: {
        q: query,
        apiKey: NEWSAPI_KEY,
        language: 'en',
        sortBy: 'publishedAt',
      },
    });

    const newsData = response.data.articles.map((article: Article) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt,
    }));

    res.status(200).json(newsData);
  } catch (error) {
    console.error('Error fetching news:', error);
    res
      .status(500)
      .json({ message: 'Failed to fetch news data. Please try again.' });
  }
};
