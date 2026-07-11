import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation Error',
      errors: err,
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Record not found' });
    }
  }

  res.status(500).json({
    message: 'Internal Server Error', error: err
  });
};
