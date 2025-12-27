# 🏛️ Relics Reimagined Website

An interactive educational game built with React that teaches players about archaeology while providing an engaging gaming experience. The website includes user authentication, a scoring system, leaderboards, and multiple game levels.

## Features

✨ **Key Features:**
- 🔐 **Secure Authentication**: Firebase-based login and registration system
- 🎮 **Interactive Game**: Artifact discovery game with multiple levels
- 📊 **Leaderboard**: Global rankings based on player scores
- 🏺 **Educational Content**: Learn about famous archaeological sites
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- ⭐ **Game Mechanics**: Hints, points system, and level progression

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Routing**: React Router v6
- **Authentication**: Firebase Authentication
- **Build Tool**: Vite
- **Styling**: CSS3 with responsive design
- **State Management**: React Context API

## Project Structure

```
src/
├── components/
│   └── ProtectedRoute.tsx       # Route protection component
├── context/
│   └── AuthContext.tsx          # Authentication context
├── pages/
│   ├── Home.tsx                 # Landing page
│   ├── Login.tsx                # Login page
│   ├── Register.tsx             # Registration page
│   ├── Dashboard.tsx            # User dashboard
│   ├── Game.tsx                 # Main game page
│   ├── Leaderboard.tsx          # Leaderboard page
│   └── About.tsx                # About archaeology page
├── styles/
│   ├── Auth.css                 # Authentication styles
│   ├── Game.css                 # Game styles
│   ├── Dashboard.css            # Dashboard styles
│   ├── Leaderboard.css          # Leaderboard styles
│   ├── About.css                # About page styles
│   ├── Home.css                 # Home page styles
│   └── index.css                # Global styles
├── App.tsx                      # Main app with routing
├── main.tsx                     # Entry point
└── index.html                   # HTML template
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the project:**
   ```bash
   cd c:\workspaces\arecheoedu
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password method)
   - Copy your Firebase config
   - Update the Firebase config in `src/context/AuthContext.tsx`:
     ```typescript
     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_STORAGE_BUCKET",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID"
     };
     ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   ```
   http://localhost:5173
   ```

## Usage

### User Flow

1. **Home Page**: Landing page with game overview
2. **Register**: Create a new account with email and password
3. **Login**: Sign in with your credentials
4. **Dashboard**: View game options and start playing
5. **Game**: Play artifact discovery game and earn points
6. **Leaderboard**: See your rank and compete with others
7. **About**: Learn about archaeology

### Game Rules

- Each level contains 6 artifacts to find
- Use hints 💡 to get clues about artifact locations
- Click "Find" 🔍 to collect artifacts
- Different artifacts have different point values (10-30 points)
- Complete all artifacts to advance to the next level
- Your score is displayed on the leaderboard

## Deployment

### Deploy to Firebase Hosting

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**
   ```bash
   firebase login
   ```

3. **Initialize Firebase:**
   ```bash
   firebase init hosting
   ```
   - Select your project
   - Set public directory to `dist`
   - Configure as SPA (single page app)

4. **Build the project:**
   ```bash
   npm run build
   ```

5. **Deploy:**
   ```bash
   firebase deploy
   ```

### Deploy to Google Sites

For Google Sites integration:
1. Build the project: `npm run build`
2. Use Google Sites' "Embed" feature to add custom HTML
3. Or host on Firebase and embed the hosted URL

### Deploy to Other Platforms

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**GitHub Pages:**
Update `vite.config.ts` with base path and deploy to gh-pages branch

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Authentication Details

### Firebase Configuration

The app uses Firebase Authentication with:
- Email/Password authentication
- User profile management (Display name)
- Persistent sessions (automatic login)
- Secure logout functionality

### Protected Routes

All game pages (Dashboard, Game, Leaderboard, About) are protected and require authentication.

## Game Features

### Artifact System
- 6 artifacts per level with unique emojis
- Each artifact worth 10-30 points
- Hint system for guidance
- Progress tracking with visual indicators

### Scoring System
- Points earned for finding artifacts
- Level progression system
- Cumulative score tracking
- Leaderboard rankings

## Customization

### Add More Artifacts

Edit `src/pages/Game.tsx` to add new artifacts:

```typescript
const [artifacts, setArtifacts] = useState<Artifact[]>([
  { id: 7, name: 'Bronze Mirror', hint: 'Search the mirror chamber', points: 20, found: false, emoji: '🪞' },
  // Add more artifacts...
]);
```

### Modify Colors

Update the gradient colors in CSS files:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## Performance Optimization

- Lazy loading with React Router
- Optimized CSS with media queries
- Responsive images
- Efficient re-renders with Context API

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security Considerations

- Firebase Authentication handles password security
- Protected API routes via authentication checks
- No sensitive data stored in localStorage
- HTTPS required for production

## Troubleshooting

### Firebase Connection Issues
- Verify Firebase config is correct
- Check Firebase project has Authentication enabled
- Ensure Email/Password auth method is enabled

### Game Not Loading
- Clear browser cache
- Check browser console for errors
- Verify all dependencies are installed

### Login Problems
- Ensure password is at least 6 characters
- Check email format
- Verify Firebase authentication is configured

## Contributing

To contribute improvements:
1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Future Enhancements

- 🏆 Achievement system
- 🌍 Multiplayer mode
- 📸 Artifact photo gallery
- 🎨 Theme customization
- 💾 Save/Load game progress
- 🎯 Difficulty levels
- 🏅 Daily challenges

## License

This project is open source and available for educational purposes.

## Support

For issues, questions, or suggestions:
- Check the documentation
- Review the FAQ
- Contact the development team

## About Archaeology

Archaeology is the scientific study of past human societies. This game aims to introduce players to the field while making learning fun and engaging!

---

**Happy Exploring! 🏺** 

Start your archaeological adventure today!
