import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database file paths
const dbDir = path.join(__dirname, 'server', 'database');
const presentationsFile = path.join(dbDir, 'presentations.json');
const quizzesFile = path.join(dbDir, 'quizzes.json');
const presentationsSeedFile = path.join(dbDir, 'presentations-seed.json');
const quizzesSeedFile = path.join(dbDir, 'quizzes-seed.json');

// Initialize database directory and files if they don't exist
const initializeDatabase = () => {
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Initialize presentations - use seed data if empty
  if (!fs.existsSync(presentationsFile)) {
    try {
      if (fs.existsSync(presentationsSeedFile)) {
        const seedData = fs.readFileSync(presentationsSeedFile, 'utf-8');
        fs.writeFileSync(presentationsFile, seedData);
        console.log('✓ Initialized presentations from seed data');
      } else {
        fs.writeFileSync(presentationsFile, JSON.stringify([], null, 2));
      }
    } catch (error) {
      console.error('Error initializing presentations:', error);
      fs.writeFileSync(presentationsFile, JSON.stringify([], null, 2));
    }
  }

  // Initialize quizzes - use seed data if empty
  if (!fs.existsSync(quizzesFile)) {
    try {
      if (fs.existsSync(quizzesSeedFile)) {
        const seedData = fs.readFileSync(quizzesSeedFile, 'utf-8');
        fs.writeFileSync(quizzesFile, seedData);
        console.log('✓ Initialized quizzes from seed data');
      } else {
        fs.writeFileSync(quizzesFile, JSON.stringify({}, null, 2));
      }
    } catch (error) {
      console.error('Error initializing quizzes:', error);
      fs.writeFileSync(quizzesFile, JSON.stringify({}, null, 2));
    }
  }
};

// Initialize database on startup
initializeDatabase();

// Helper functions to read/write database
const readPresentations = () => {
  try {
    const data = fs.readFileSync(presentationsFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading presentations:', error);
    return [];
  }
};

const writePresentations = (data) => {
  try {
    fs.writeFileSync(presentationsFile, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing presentations:', error);
  }
};

const readQuizzes = () => {
  try {
    const data = fs.readFileSync(quizzesFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading quizzes:', error);
    return {};
  }
};

const writeQuizzes = (data) => {
  try {
    fs.writeFileSync(quizzesFile, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing quizzes:', error);
  }
};

// API Routes

// GET all presentations
app.get('/api/presentations', (req, res) => {
  const presentations = readPresentations();
  res.json(presentations);
});

// GET all quizzes
app.get('/api/quizzes', (req, res) => {
  const quizzes = readQuizzes();
  res.json(quizzes);
});

// POST - Add new presentation
app.post('/api/presentations', (req, res) => {
  try {
    const presentations = readPresentations();
    const newPresentation = req.body;
    presentations.push(newPresentation);
    writePresentations(presentations);
    res.status(201).json(newPresentation);
  } catch (error) {
    console.error('Error adding presentation:', error);
    res.status(500).json({ error: 'Failed to add presentation' });
  }
});

// POST - Add/Update quiz links
app.post('/api/quizzes', (req, res) => {
  try {
    const quizzes = readQuizzes();
    const { fileId, ...quizData } = req.body;
    quizzes[fileId] = quizData;
    writeQuizzes(quizzes);
    res.status(201).json({ fileId, ...quizData });
  } catch (error) {
    console.error('Error saving quizzes:', error);
    res.status(500).json({ error: 'Failed to save quizzes' });
  }
});

// PUT - Update all presentations
app.put('/api/presentations', (req, res) => {
  try {
    const presentations = req.body;
    writePresentations(presentations);
    res.json(presentations);
  } catch (error) {
    console.error('Error updating presentations:', error);
    res.status(500).json({ error: 'Failed to update presentations' });
  }
});

// PUT - Update all quizzes
app.put('/api/quizzes', (req, res) => {
  try {
    const quizzes = req.body;
    writeQuizzes(quizzes);
    res.json(quizzes);
  } catch (error) {
    console.error('Error updating quizzes:', error);
    res.status(500).json({ error: 'Failed to update quizzes' });
  }
});

// DELETE presentation by ID
app.delete('/api/presentations/:id', (req, res) => {
  try {
    const presentations = readPresentations();
    const filteredPresentations = presentations.filter(p => p.id !== req.params.id);
    writePresentations(filteredPresentations);

    const quizzes = readQuizzes();
    delete quizzes[req.params.id];
    writeQuizzes(quizzes);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting presentation:', error);
    res.status(500).json({ error: 'Failed to delete presentation' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', port: PORT });
});

// Start server
app.listen(PORT, () => {
  console.log(`📚 Server running on http://localhost:${PORT}`);
  console.log(`📁 Database location: ${dbDir}`);
});
