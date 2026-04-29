import type { Prisma, todoStatus } from '../../../generated/prisma/client.js';
import type { TodoUpdateInput, TodoWhereInput } from '../../../generated/prisma/models.js';
import { prisma } from '../../../libs/prisma.js';
import type { AssignCategoryToTodoSchema } from '../controllers/todo.controller.js';

type TWhereInput = {
  status?: todoStatus;
  completed_at?: string;
  title?: string;
};

type TPagination = {
  page: number;
  perPage: number;
};

export const createTodoModel = async (data: Prisma.TodoCreateInput) => {
  const createTodo = await prisma.todo.create({
    data: {
      title: data.title,
      user_id: 1,
      description: data.description ?? null,
      status: data.status ?? 'Pending',
    },
  });

  if (!createTodo) {
    throw new Error('Failed to create Todo');
  }

  return createTodo;
};

export const getAllTodoModel = async (whereInput: TWhereInput, pagination: TPagination) => {
  let tempWhereInput: TodoWhereInput = {};

  if (whereInput.status) {
    tempWhereInput.status = whereInput.status;
  }

  if (whereInput.completed_at) {
    tempWhereInput.completed_at = {
      gte: new Date(whereInput.completed_at),
    };
  }
  if (whereInput.title) {
    tempWhereInput.title = {
      contains: whereInput.title,
    };
  }

  const totalCount = await prisma.todo.count({
    where: tempWhereInput,
  });

  const allTodos = await prisma.todo.findMany({
    where: tempWhereInput,
    take: pagination.perPage,
    skip: (pagination.page - 1) * pagination.perPage,
  });

  return { allTodos, totalCount };
};

export const deleteTodo = async (todoId: number) => {
  const todoExists = await prisma.todo.findFirst({
    where: {
      id: todoId,
    },
  });

  if (!todoExists) {
    throw new Error('Todo does not exists');
  }

  const result = await prisma.todo.delete({
    where: {
      id: todoId,
    },
  });

  return result;
};

export const getTodoById = async (todoId: number) => {
  const todoExists = await prisma.todo.findFirst({
    where: {
      id: todoId,
    },
  });

  if (!todoExists) {
    throw new Error('todo not found');
  }
  return todoExists;
};

export const updateTodo = async (todoId: number, data: TodoUpdateInput) => {
  const todoExists = await prisma.todo.findFirst({
    where: {
      id: todoId,
    },
  });

  if (!todoExists) {
    throw new Error('todo not found');
  }

  const updatedTodo = await prisma.todo.update({
    where: {
      id: todoId,
    },

    data,
  });
  return updatedTodo;
};

export const assignCategoryToTodo = async (data: AssignCategoryToTodoSchema) => {
  const result = await prisma.todo_categories.create({
    data: {
      todo_id: data.todo_id,
      category_id: data.category_id,
    },
    include: {
      categories: true,
      todo: true,
    },
  });

  return result;
};
