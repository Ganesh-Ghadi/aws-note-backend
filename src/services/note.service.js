import { z } from 'zod';
import prisma from '../prisma.js';
import { generateSignedUrl } from './aws.service.js';

const noteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  content: z.string().min(1, 'Content is required'),
  attachmentPath: z.string().optional().nullable(),
});

const formatNote = (note) => {
  if (!note) return null;
  return {
    ...note,
    attachmentUrl: note.attachmentPath ? generateSignedUrl(note.attachmentPath) : undefined,
  };
};

export const getAllNotes = async () => {
  const notes = await prisma.note.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return notes.map(formatNote);
};

export const getNoteById = async (id) => {
  const note = await prisma.note.findUnique({
    where: { id },
  });
  return formatNote(note);
};

export const createNote = async (data) => {
  const validatedData = noteSchema.parse(data);
  const note = await prisma.note.create({
    data: validatedData,
  });
  return formatNote(note);
};

export const updateNote = async (id, data) => {
  const validatedData = noteSchema.partial().parse(data);
  const note = await prisma.note.update({
    where: { id },
    data: validatedData,
  });
  return formatNote(note);
};

export const deleteNote = async (id) => {
  return await prisma.note.delete({
    where: { id },
  });
};
