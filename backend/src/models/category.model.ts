import type { CategoryCreateInput, CategoryUpdateInput } from '../../../generated/prisma/models.js';
import { prisma } from '../../../libs/prisma.js';

export const createCategory = async (data: CategoryCreateInput) => {
  const category = await prisma.category.create({
    data: {
      name: data.name,
      description: data.description ? data.description : null,
    },
  });

  return category;
};

export const getAllCategories = async () => {
  const allCategories = await prisma.category.findMany();

  return allCategories;
};

export const getCategoryById = async (categoryId: number) => {
  const result = await prisma.category.findFirst({
    where: {
      id: categoryId,
    },
  });

  if (!result) {
    throw new Error(`Category with id ${categoryId} does not exists`);
  }

  return result;
};

export const updateCategory = async (categoryId: number, data: CategoryUpdateInput) => {
  const categoryExists = await prisma.category.findFirst({
    where: {
      id: categoryId,
    },
  });

  if (!categoryExists) {
    throw new Error(`Category with id ${categoryId} does not exists`);
  }

  const updatedCategory = await prisma.category.update({
    where: {
      id: categoryId,
    },
    data,
  });

  return updatedCategory;
};

export const deleteCategory = async (categoryId: number) => {
  const categoryExists = await prisma.category.findFirst({
    where: {
      id: categoryId,
    },
  });

  if (!categoryExists) {
    throw new Error(`Category with id ${categoryId} does not exists`);
  }

  const deletedCategory = await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });

  return deletedCategory;
};
