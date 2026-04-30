import type { Request, Response } from 'express';
import { z } from 'zod';
import { createUser, deleteUser, getAllUsers, getUserById, loginUser, updateUser } from '../models/user.model.js';

const SignUpUserSchema = z.object({
  email: z.email({ message: 'invalid email address' }),
  username: z.string().min(5, { message: 'username must be greater than 5' }).max(15),
  password: z.string().min(6, { message: 'Password must be at least 6 words' }).max(15),
});

export type TSignUpUserSchema = z.infer<typeof SignUpUserSchema>;

export const signUpUserController = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    // validation
    const parsedData = SignUpUserSchema.safeParse(body);

    if (!parsedData.success) {
      res.status(400).json({
        message: 'Invalid data',
        error: parsedData.error,
      });
      return;
    }

    const userData = await createUser(parsedData.data);
    if (!userData) {
      res.status(204).json({
        message: 'user is not created',
      });
      return;
    }

    res.status(201).json({
      message: 'User created successfully',
      data: userData,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || 'An error occurred during sign up',
    });
  }
};

const LoginUserSchema = z.object({
  username: z.string().min(5, { message: 'username must be greater than 5' }).max(15),
  password: z.string().min(6, { message: 'Password must be at least 15 words' }).max(15),
});

export type TLoginUserSchema = z.infer<typeof LoginUserSchema>;

export const loginUserController = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const parsedData = LoginUserSchema.safeParse(body);

    if (!parsedData.success) {
      res.status(400).json({
        message: 'Invalid data',
        error: parsedData.error,
      });
      return;
    }

    const user = await loginUser(parsedData.data);

    res.status(200).json({
      message: 'Login successfully',
      data: user,
    });
  } catch (error: any) {
    res.status(401).json({
      message: error.message || 'Invalid username or password',
    });
  }
};

const GetAllUserSchema = z.object({
  page: z.string(),
  perPage: z.string(),
  email: z.email().optional(),
  username: z.string().optional(),
  createdAt: z.string().optional(),
});

export type TGetAllUserSchema = z.infer<typeof GetAllUserSchema>;

export const getAllUsersController = async (req: Request, res: Response) => {
  const query = req.query;

  const parsedData = GetAllUserSchema.safeParse(query);

  if (!parsedData.success) {
    res.status(400).json({
      message: 'Invalid data',
      error: parsedData.error,
    });
    return;
  }

  const allUsersData = await getAllUsers(parsedData.data);

  if (allUsersData.users.length <= 0) {
    res.status(404).json({
      message: 'users not found',
    });
    return;
  }
  res.status(200).json({
    message: 'Fetched all users data',
    data: allUsersData.users,
    pagination: {
      page: parsedData.data.page,
      perPage: parsedData.data.perPage,
      total: allUsersData.total,
    },
  });
};

const GetUserByIdSchema = z.object({
  userId: z.coerce.number().int().positive(),
});

export type TGetuserByIdSchema = z.infer<typeof GetUserByIdSchema>;

export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const params = req.params.user_id;
    const parsedData = GetUserByIdSchema.safeParse({
      userId: params,
    });

    if (!parsedData.success) {
      res.status(400).json({
        message: 'Invalid data',
        error: parsedData.error,
      });
      return;
    }

    const user = await getUserById(parsedData.data);

    if (!user) {
      res.status(404).json({
        message: 'user not found',
      });
      return;
    }

    res.status(200).json({
      message: 'user found',
      data: user,
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message || 'User not found',
    });
  }
};

const UpdateUserSchema = z.object({
  params: z.object({
    userId: z.coerce.number().int().positive(),
  }),
  body: z.object({
    email: z.email({ message: 'invalid email address' }).optional(),
    username: z.string().min(5, { message: 'username must be greater than 5' }).max(15).optional(),
    password: z.string().min(6, { message: 'Password must be at least 15 words' }).max(15).optional(),
  }),
});

export type TUpdateUserSchema = z.infer<typeof UpdateUserSchema>;

export const updateUserByIdController = async (req: Request, res: Response) => {
  try {
    const parsedData = UpdateUserSchema.safeParse({
      params: {
        userId: req.params.user_id,
      },
      body: req.body,
    });

    if (!parsedData.success) {
      res.status(400).json({
        message: 'Invalid data',
        error: parsedData.error,
      });
      return;
    }

    const updatedUser = await updateUser(parsedData.data);

    res.status(200).json({
      message: 'user updated successfully',
      data: updatedUser,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || 'An error occurred while updating the user',
    });
  }
};

const DeleteUserByIdSchema = z.object({
  userId: z.coerce.number().int().positive(),
});

export type TDeleteuserByIdSchema = z.infer<typeof DeleteUserByIdSchema>;

export const deleteUserByIdController = async (req: Request, res: Response) => {
  try {
    const parsedData = DeleteUserByIdSchema.safeParse({
      userId: req.params.user_id,
    });

    if (!parsedData.success) {
      res.status(400).json({
        message: 'Invalid data',
        error: parsedData.error,
      });
      return;
    }

    const deletedUser = await deleteUser(parsedData.data);

    res.status(200).json({
      message: 'user deleted successfully',
      data: deletedUser,
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message || 'An error occurred while deleting the user',
    });
  }
};
