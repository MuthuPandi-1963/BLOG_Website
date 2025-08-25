import { DbWorker } from "../db/dbWorker.js";
import { newsApi } from "../auth/newsApi.js";
import { Router } from "express";
import { Article } from "../db/schema.js";

export const newsRouter = Router()

newsRouter.post('/save',async(req,res)=>{
  try {
    console.log(req.body);
    
    const response : Article[] = await DbWorker.saveArticle(req.body?.data || [])
    return res.json({message : "uploaded successfully"})
  } catch (error) {
    
  }
})
newsRouter.get('/', async (req, res) => {
    try {
      const { country, category, page = 1, limit = 20 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);
      
      // First try to get from database
      let articles = await DbWorker.getArticles(
        country as string, 
        category as string, 
        Number(limit), 
        offset
      );

      // If no articles in database, fetch from NewsAPI
      if (articles.length === 0 && Number(page) === 1) {
        try {
          const newsArticles = await newsApi.fetchTopHeadlines(
            country as string, 
            category as string, 
            Number(limit)
          );
          console.log("news" ,newsArticles);
          

          // Store articles in database
          for (const newsArticle of newsArticles) {
            const articleData = {
              title: newsArticle.title,
              description: newsArticle.description || '',
              content: newsArticle.content || '',
              url: newsArticle.url,
              urlToImage: newsArticle.urlToImage || '',
              source: newsArticle.source.name,
              author: newsArticle.author || '',
              publishedAt: new Date(newsArticle.publishedAt),
              country: country as string || 'global',
              category: category as string || 'general',
            };

            await DbWorker.upsertArticle(articleData);
            console.log("Inserted:", articleData.title);

          }

          // Fetch updated articles from database
          articles = await DbWorker.getArticles(
            country as string, 
            category as string, 
            Number(limit), 
            offset
          );
        } catch (newsError) {
          console.warn('Failed to fetch from NewsAPI:', newsError);
          // Continue with empty articles array if NewsAPI fails
        }
      }

      res.json({ articles, hasMore: articles.length === Number(limit) });
    } catch (error) {
      console.error('Error fetching news:', error);
      res.status(500).json({ message: 'Failed to fetch news' });
    }
  });

  newsRouter.get('/search', async (req, res) => {
    try {
      const { q, country } = req.query;
      
      if (!q) {
        return res.status(400).json({ message: 'Search query is required' });
      }

      let articles = await DbWorker.searchArticles(q as string, country as string);

      // If no results from database, try NewsAPI
      if (articles.length === 0) {
        try {
          const newsArticles = await newsApi.searchNews(q as string, country as string);
          
          // Store articles in database
          for (const newsArticle of newsArticles) {
            const articleData = {
              title: newsArticle.title,
              description: newsArticle.description || '',
              content: newsArticle.content || '',
              url: newsArticle.url,
              urlToImage: newsArticle.urlToImage || '',
              source: newsArticle.source.name,
              author: newsArticle.author || '',
              publishedAt: new Date(newsArticle.publishedAt),
              country: country as string || 'global',
              category: 'general',
            };

            await DbWorker.upsertArticle(articleData);
          }

          articles = await DbWorker.searchArticles(q as string, country as string);
        } catch (newsError) {
          console.warn('Failed to search from NewsAPI:', newsError);
        }
      }

      res.json({ articles });
    } catch (error) {
      console.error('Error searching news:', error);
      res.status(500).json({ message: 'Failed to search news' });
    }
  });

  newsRouter.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const article = await DbWorker.getArticleById(id);
      
      if (!article) {
        return res.status(404).json({ message: 'Article not found' });
      }

      res.json(article);
    } catch (error) {
      console.error('Error fetching article:', error);
      res.status(500).json({ message: 'Failed to fetch article' });
    }
  });