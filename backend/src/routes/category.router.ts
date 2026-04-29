import type { Application } from 'express';
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
} from '../controllers/categroy.controller.js';

export const CategoryRouter = (app: Application) => {
  app.post('/categories', createCategoryController);
  app.get('/categories', getAllCategoriesController);
  app.get('/categories/:categoryId', getCategoryByIdController);
  app.put('/categories/:categoryId', updateCategoryController);
  app.delete('/categories/:categoryId', deleteCategoryController);
};
