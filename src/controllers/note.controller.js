import * as noteService from '../services/note.service.js';
import { uploadFileToS3 } from '../services/aws.service.js';

export const getNotes = async (req, res, next) => {
  try {
    const notes = await noteService.getAllNotes();
    res.json(notes);
  } catch (error) {
    next(error);
  }
};

export const getNote = async (req, res, next) => {
  try {
    const noteId = parseInt(req.params.id, 10);
    const note = await noteService.getNoteById(noteId);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      const key = await uploadFileToS3(req.file.buffer, req.file.originalname, req.file.mimetype);
      data.attachmentPath = key;
    }
    const newNote = await noteService.createNote(data);
    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const noteId = parseInt(req.params.id, 10);
    const data = { ...req.body };
    if (req.file) {
      const key = await uploadFileToS3(req.file.buffer, req.file.originalname, req.file.mimetype);
      data.attachmentPath = key;
    }
    const updatedNote = await noteService.updateNote(noteId, data);
    res.json(updatedNote);
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const noteId = parseInt(req.params.id, 10);
    await noteService.deleteNote(noteId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
