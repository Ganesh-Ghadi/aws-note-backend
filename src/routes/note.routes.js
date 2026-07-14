import { Router } from 'express';
import multer from 'multer';
import * as noteController from '../controllers/note.controller.js';

const router = Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPG, JPEG, and PNG are allowed.'), false);
    }
  },
});

router.get('/', noteController.getNotes);
router.get('/:id', noteController.getNote);
router.post('/', upload.single('attachment'), noteController.createNote);
router.put('/:id', upload.single('attachment'), noteController.updateNote);
router.delete('/:id', noteController.deleteNote);

export default router;
