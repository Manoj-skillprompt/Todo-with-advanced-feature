import type { CategoriesCreateInput, CategoriesUpdateInput } from '../../../generated/prisma/models.js';
import { prisma } from '../../../libs/prisma.js';

export const createCategory = async (data: CategoriesCreateInput) => {
  const category = await prisma.categories.create({
    data: {
      name: data.name,
      description: data.description ? data.description : null,
    },
  });

  return category;
};

export const getAllCategories = async () => {
  const allCategories = await prisma.categories.findMany();

  return allCategories;
};

export const getCategoryById = async (categoryId: number) => {
  const result = await prisma.categories.findFirst({
    where: {
      id: categoryId,
    },
  });

  if (!result) {
    throw new Error(`Category with id ${categoryId} does not exists`);
  }

  return result;
};

export const updateCategory = async (categoryId: number, data: CategoriesUpdateInput) => {
  const categoryExists = await prisma.categories.findFirst({
    where: {
      id: categoryId,
    },
  });

  if (!categoryExists) {
    throw new Error(`Category with id ${categoryId} does not exists`);
  }

  const updatedCategory = await prisma.categories.update({
    where: {
      id: categoryId,
    },
    data,
  });

  return updatedCategory;
};

export const deleteCategory = async (categoryId: number) => {
  const categoryExists = await prisma.categories.findFirst({
    where: {
      id: categoryId,
    },
  });

  if (!categoryExists) {
    throw new Error(`Category with id ${categoryId} does not exists`);
  }

  const deletedCategory = await prisma.categories.delete({
    where: {
      id: categoryId,
    },
  });

  return deletedCategory;
};
