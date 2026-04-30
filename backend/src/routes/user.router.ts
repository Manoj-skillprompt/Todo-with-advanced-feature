import type { Application } from 'express';
import {
  deleteUserByIdController,
  getAllUsersController,
  getUserByIdController,
  loginUserController,
  signUpUserController,
  updateUserByIdController,
} from '../controllers/user.controller.js';

export const userRouter = (app: Application) => {
  app.post('/users/sign-up', signUpUserController);
  app.post('/users/login', loginUserController);
  app.get('/users', getAllUsersController);
  app.get('/users/:user_id', getUserByIdController);
  app.put('/users/:user_id', updateUserByIdController);
  app.delete('/users/:user_id', deleteUserByIdController);
};
