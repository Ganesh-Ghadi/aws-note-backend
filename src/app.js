import express from 'express';
import cors from 'cors';
import noteRoutes from './routes/note.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/notes', noteRoutes);

app.use(errorHandler);

export default app;
