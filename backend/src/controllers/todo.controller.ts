import type { Request, Response } from 'express';
import type { todoStatus } from '../../../generated/prisma/client.js';
import {
  assignCategoryToTodo,
  createTodoModel,
  deleteTodo,
  getAllTodoModel,
  getTodoById,
  updateTodo,
} from '../models/todo.model.js';

export const getAllTodoController = async (req: Request, res: Response) => {
  const query = req.query;
  const status = query.status as todoStatus;
  const completedAt = query.completed_at as string;
  const title = query.title as string;
  const page = query.page ?? '1';
  const perPage = query.perPage ?? '10';
  const pageNum = Number(page);
  const perPageNum = Number(perPage);
  const result = await getAllTodoModel(
    {
      status,
      completed_at: completedAt,
      title,
    },
    {
      page: pageNum,
      perPage: perPageNum,
    }
  );

  res.status(201).json({
    message: 'All todos fetched successfully',
    data: result.allTodos,
    pagination: {
      page: pageNum,
      perPage: perPageNum,
      total: result.totalCount,
    },
  });
};

export const createTodoController = async (req: Request, res: Response) => {
  const body = req.body;

  const createdTodo = await createTodoModel(body);

  res.json({
    message: 'todo created successfully',
    data: createdTodo,
  });
};

export const deleteTodoController = async (req: Request, res: Response) => {
  const id = req.params.id;
  const idNum = Number(id);
  const deleteRes = await deleteTodo(idNum);

  res.status(200).json({
    message: 'Deleted successfully',
    data: deleteRes,
  });
};

export const getTodoByIdController = async (req: Request, res: Response) => {
  const id = req.params.id;
  const idNum = Number(id);
  const response = await getTodoById(idNum);

  res.status(200).json({
    message: 'todo by id fetched successfully',
    data: response,
  });
};

export const updateTodoController = async (req: Request, res: Response) => {
  const id = req.params.id;
  const idNum = Number(id);
  const body = req.body;
  const response = await updateTodo(idNum, body);

  res.status(200).json({
    message: 'Updated successfully',
    data: response,
  });
};

export interface AssignCategoryToTodoSchema {
  todo_id: number;
  category_id: number;
}

export const assignCategoryToTodoController = async (req: Request, res: Response) => {
  const body = req.body as AssignCategoryToTodoSchema;

  const assignedCategory = await assignCategoryToTodo(body);

  res.status(201).json({
    message: 'Category assigned to todo successfully',
    data: assignedCategory,
  });
};
