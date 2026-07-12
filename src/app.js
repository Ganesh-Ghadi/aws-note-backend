import express from 'express';
import cors from 'cors';
import noteRoutes from './routes/note.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint for CI/CD pipeline verification
app.get('/api/health', (req, res) => res.status(200).send('OK'));

app.use('/api/notes', noteRoutes);

app.use(errorHandler);

export default app;
