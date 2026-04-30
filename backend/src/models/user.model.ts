import type { Prisma } from '../../../generated/prisma/client.js';
import { prisma } from '../../../libs/prisma.js';
import type {
  TDeleteuserByIdSchema,
  TGetAllUserSchema,
  TGetuserByIdSchema,
  TLoginUserSchema,
  TSignUpUserSchema,
  TUpdateUserSchema,
} from '../controllers/user.controller.js';

export const createUser = async (data: TSignUpUserSchema) => {
  const userExists = await prisma.user.findFirst({
    where: {
      OR: [
        {
          email: data.email,
        },
        {
          username: data.username,
        },
      ],
    },
  });

  if (userExists) {
    throw new Error('User already exists');
  }

  const createdUser = await prisma.user.create({
    data: {
      email: data.email,
      password: data.password,
      username: data.username,
    },
    include: {
      todos: true,
    },
  });

  return createdUser;
};

export async function loginUser(data: TLoginUserSchema) {
  const userExists = await prisma.user.findFirst({
    where: {
      username: data.username,
    },
  });

  if (!userExists) {
    throw new Error('You are not registered! please register first');
  }

  const isValidUser = userExists.username === data.username && userExists.password === data.password;

  if (!isValidUser) {
    throw new Error('Invalid username or password');
  }

  return userExists;
}

export async function getAllUsers(data: TGetAllUserSchema) {
  const limit = +data.page;
  const perPage = +data.perPage;

  const whereInput: Prisma.UserWhereInput = {
    ...(data.email !== undefined && {
      email: {
        equals: data.email,
      },
    }),
    ...(data.username !== undefined && {
      username: {
        contains: data.username,
      },
    }),
    ...(data.createdAt !== undefined && {
      created_at: {
        gte: new Date(data.createdAt),
      },
    }),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: whereInput,
      take: perPage,
      skip: (limit - 1) * perPage,
    }),
    prisma.user.count({
      where: whereInput,
    }),
  ]);

  return { users, total };
}

export async function getUserById(data: TGetuserByIdSchema) {
  const userExists = await prisma.user.findFirst({
    where: {
      id: +data.userId,
    },
  });

  if (!userExists) {
    throw new Error('User not found');
  }

  return userExists;
}

export async function updateUser(data: TUpdateUserSchema) {
  const userExists = await prisma.user.findFirst({
    where: {
      id: data.params.userId,
    },
  });

  if (!userExists) {
    throw new Error('User not found');
  }

  if (data.body.email || data.body.username) {
    const conflict = await prisma.user.findFirst({
      where: {
        id: { not: data.params.userId },
        OR: [
          ...(data.body.email ? [{ email: data.body.email }] : []),
          ...(data.body.username ? [{ username: data.body.username }] : []),
        ],
      },
    });

    if (conflict) {
      if (data.body.email === conflict.email) {
        throw new Error('Email already taken');
      }
      if (data.body.username === conflict.username) {
        throw new Error('Username already taken');
      }
    }
  }

  const result = await prisma.user.update({
    where: {
      id: data.params.userId,
    },
    data: {
      email: data.body.email ?? userExists.email,
      username: data.body.username ?? userExists.username,
      password: data.body.password ?? userExists.password,
    },
  });

  return result;
}

export async function deleteUser(data: TDeleteuserByIdSchema) {
  const userExists = await prisma.user.findFirst({
    where: {
      id: data.userId,
    },
  });

  if (!userExists) {
    throw new Error('User not found');
  }

  const result = await prisma.user.delete({
    where: {
      id: data.userId,
    },
  });

  return result;
}
