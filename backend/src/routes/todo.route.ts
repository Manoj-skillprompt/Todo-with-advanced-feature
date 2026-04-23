import type { Application } from 'express';
import {
  createTodoController,
  deleteTodoController,
  getAllTodoController,
  getTodoByIdController,
  updateTodoController,
} from '../controllers/todo.controller.js';

export const todoRoutes = (app: Application) => {
  app.post('/api/todo/create', createTodoController);
  app.get('/api/todo/all', getAllTodoController);
  app.delete('/api/deleteTodo/:id', deleteTodoController);
  app.get('/api/todo/:id', getTodoByIdController);
  app.put('/api/updatetodo/:id', updateTodoController);
};
