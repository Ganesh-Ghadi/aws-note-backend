import * as noteService from '../services/note.service.js';

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
    const newNote = await noteService.createNote(req.body);
    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const noteId = parseInt(req.params.id, 10);
    const updatedNote = await noteService.updateNote(noteId, req.body);
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
