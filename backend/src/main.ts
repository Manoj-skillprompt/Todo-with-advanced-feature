import express from 'express';
import dotenv from 'dotenv';
import { todoRoutes } from './routes/todo.route.js';
import { CategoryRouter } from './routes/category.router.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());

todoRoutes(app);
CategoryRouter(app);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
