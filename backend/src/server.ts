import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';



import { logger } from './lib/logger.js';
import { EnvLoader } from './env.js';
import { newsRouter } from './routes/news.js';
import { AdminRoutes } from './routes/admin.js';
import { bookmarkRoutes } from './routes/bookmarks.js';
import { commentsRoutes } from './routes/comments.js';
import { countriesRoutes } from './routes/countries.js';
import {AuthRoutes} from './routes/user.js';


const app = express();


app.use(logger);
app.use(helmet());
app.use(cors({ origin: [EnvLoader("CLIENT_URL","string")], credentials: true }));
app.use(compression());
app.use(express.json());


app.use('/api/auth', AuthRoutes);
app.use('/api/news',newsRouter)
app.use('/api/admin',AdminRoutes)
app.use('/api/bookmark',bookmarkRoutes)
app.use("/api/article",commentsRoutes)
app.use("/api/article",countriesRoutes)


app.get('/api', (_req, res) => res.send('API running'));

const port = EnvLoader("PORT","number",3000)

app.listen(port, () => {
console.log(`Server listening on http://localhost:${port}`);
});