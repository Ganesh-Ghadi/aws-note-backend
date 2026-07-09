import { z } from 'zod';
import prisma from '../prisma.js';

const noteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  content: z.string().min(1, 'Content is required'),
});

export const getAllNotes = async () => {
  return await prisma.note.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getNoteById = async (id) => {
  return await prisma.note.findUnique({
    where: { id },
  });
};

export const createNote = async (data) => {
  const validatedData = noteSchema.parse(data);
  return await prisma.note.create({
    data: validatedData,
  });
};

export const updateNote = async (id, data) => {
  const validatedData = noteSchema.partial().parse(data);
  return await prisma.note.update({
    where: { id },
    data: validatedData,
  });
};

export const deleteNote = async (id) => {
  return await prisma.note.delete({
    where: { id },
  });
};
