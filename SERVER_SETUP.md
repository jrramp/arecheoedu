# Server-Side Database Setup

## Overview
The application now uses a **server-side file-based database** instead of client-side localStorage. All presentations and quiz data are stored on the server.

## Database Location
- **Presentations**: `server/database/presentations.json`
- **Quizzes**: `server/database/quizzes.json`

These files are automatically created when the server starts for the first time.

## Installation

### 1. Install Dependencies
```bash
npm install
```

This installs both frontend and backend dependencies including:
- `express` - Web framework
- `cors` - Cross-Origin Resource Sharing
- `concurrently` - Run multiple scripts simultaneously

### 2. Start the Server

**Option A: Run both server and client together**
```bash
npm run dev:full
```
This starts:
- Backend server on `http://localhost:3001`
- Frontend on `http://localhost:5175` (or next available port)

**Option B: Run server only**
```bash
npm run server
```
Server runs on `http://localhost:3001`

**Option C: Run frontend only (requires server running separately)**
```bash
npm run dev
```

## API Endpoints

### GET `/api/presentations`
Retrieves all presentations
```bash
curl http://localhost:3001/api/presentations
```

### GET `/api/quizzes`
Retrieves all quiz configurations
```bash
curl http://localhost:3001/api/quizzes
```

### POST `/api/presentations`
Add a new presentation
```bash
curl -X POST http://localhost:3001/api/presentations \
  -H "Content-Type: application/json" \
  -d '{"id":"123","name":"Test","slides":[]}'
```

### PUT `/api/presentations`
Update all presentations (batch update)
```bash
curl -X PUT http://localhost:3001/api/presentations \
  -H "Content-Type: application/json" \
  -d '[{...}]'
```

### PUT `/api/quizzes`
Update all quizzes (batch update)
```bash
curl -X PUT http://localhost:3001/api/quizzes \
  -H "Content-Type: application/json" \
  -d '{...}'
```

### DELETE `/api/presentations/:id`
Delete a presentation by ID
```bash
curl -X DELETE http://localhost:3001/api/presentations/123
```

### GET `/api/health`
Health check
```bash
curl http://localhost:3001/api/health
```

## Database Structure

### presentations.json
```json
[
  {
    "id": "1234567890",
    "name": "Presentation Title",
    "uploadedAt": "2025-12-27",
    "slides": [
      {
        "id": 1,
        "title": "Slide Title",
        "content": "Slide content"
      }
    ],
    "googleSlidesUrl": "https://docs.google.com/..."
  }
]
```

### quizzes.json
```json
{
  "1234567890": {
    "preQuizUrl": "https://forms.gle/...",
    "postQuizUrl": "https://forms.gle/...",
    "googleSlidesUrl": "https://docs.google.com/..."
  }
}
```

## Data Persistence
- All data is stored as JSON files in `server/database/`
- Changes are immediately written to disk
- Data persists across server restarts
- No external database required

## Troubleshooting

### Server won't start
1. Check if port 3001 is already in use: `netstat -ano | find "3001"`
2. Kill the process: `taskkill /PID <PID> /F`
3. Try a different port by editing `server.js`

### Frontend can't connect to server
1. Ensure server is running on port 3001
2. Check browser console for CORS errors
3. Verify `API_BASE_URL` in Curriculum.tsx points to correct server

### Database files corrupted
1. Delete `server/database/` folder
2. Restart server to recreate fresh database files

## Development Notes
- Server auto-reloads database on each request (no caching)
- API requests use debouncing to avoid excessive writes
- CORS is enabled for all origins
- No authentication required (add for production)

## Next Steps
For production:
1. Add authentication/authorization
2. Use a proper database (MongoDB, PostgreSQL)
3. Add data validation and error handling
4. Implement rate limiting
5. Add logging and monitoring
