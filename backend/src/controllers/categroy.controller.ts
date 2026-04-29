import type { Request, Response } from 'express';
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from '../models/category.model.js';

export const createCategoryController = async (req: Request, res: Response) => {
  const createdCategory = await createCategory(req.body);

  res.status(201).json({
    message: 'Category created successfully',
    data: createdCategory,
  });
};

export const getAllCategoriesController = async (req: Request, res: Response) => {
  const result = await getAllCategories();

  if (result.length <= 0) {
    res.status(404).json({
      message: 'Categories not found',
      data: result,
    });
  }
  res.status(200).json({
    message: 'All categories found',
    data: result,
  });
};

export const getCategoryByIdController = async (req: Request, res: Response) => {
  const categoryId = Number(req.params.categoryId);

  const category = await getCategoryById(categoryId);

  if (!category) {
    res.status(404).json({
      message: 'No category found',
      data: category,
    });
  }
  res.status(200).json({
    message: 'category found',
    data: category,
  });
};

export const updateCategoryController = async (req: Request, res: Response) => {
  const categoryId = Number(req.params.categoryId);
  const body = req.body;
  const updatedCategory = await updateCategory(categoryId, body);

  if (!updatedCategory) {
    res.status(404).json({
      message: 'No category found',
      data: updatedCategory,
    });
  }
  res.status(200).json({
    message: 'category updated',
    data: updatedCategory,
  });
};

export const deleteCategoryController = async (req: Request, res: Response) => {
  const categoryId = Number(req.params.categoryId);
  const deletedCategory = await deleteCategory(categoryId);

  if (!deletedCategory) {
    res.status(404).json({
      message: 'No category found',
      data: deletedCategory,
    });
  }
  res.status(200).json({
    message: 'category deleted',
    data: deletedCategory,
  });
};
