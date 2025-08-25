import { DbWorker } from "../db/dbWorker.js";
import { newsApi } from "../auth/newsApi.js";
import { Router } from "express";

export const countriesRoutes = Router()
countriesRoutes.get('/countries', (req, res) => {
const countries = newsApi.getAllCountries();
res.json({ countries });
});

countriesRoutes.get('/categories', (req, res) => {
const categories = newsApi.getCategories();
res.json({ categories });
});

countriesRoutes.get('/stats/countries', async (req, res) => {
try {
    const stats = await DbWorker.getArticleCountByCountry();
    res.json({ stats });
} catch (error) {
    console.error('Error fetching country stats:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
}
});