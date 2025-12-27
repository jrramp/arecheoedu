# 🏛️ Relics Reimagined - Interactive Educational Game

A fully functional React-based interactive Relics Reimagined with user authentication, artifact discovery gameplay, and global leaderboards.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
http://localhost:5173
```

## 📝 Default Test User

- **Email**: cyber@example.com
- **Password**: turtle2025

**To create this user:**
1. Visit http://localhost:5173
2. Click "Setup" button
3. Click "Create Default User"

## ✨ Features

- ✅ User authentication with Firebase
- ✅ Interactive artifact discovery game
- ✅ Multi-level progression system
- ✅ Hint system for gameplay assistance
- ✅ Global leaderboard with top 10 rankings
- ✅ Educational content about archaeology
- ✅ Fully responsive mobile/tablet/desktop design
- ✅ Protected routes requiring authentication
- ✅ User profile management
- ✅ Point-based scoring system

## 📚 Documentation

- **[PROJECT_COMPLETE.md](PROJECT_COMPLETE.md)** - Complete project overview and setup
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed setup and deployment guide
- **[DEFAULT_USER_SETUP.md](DEFAULT_USER_SETUP.md)** - Default user creation instructions

## 🎮 How to Play

1. **Register** or **Login** with your account
2. Go to **Dashboard** and click **"Play Game"**
3. Find **6 artifacts** by using hints and exploring
4. Click **"Find"** to collect each artifact
5. Earn **points** for each discovery (10-30 per artifact)
6. Advance to the **next level** when all artifacts are found
7. Check the **Leaderboard** to see your ranking

## 🛠️ Tech Stack

- React 19 + TypeScript
- Vite (build tool)
- React Router v6 (navigation)
- Firebase Authentication
- CSS3 (responsive styling)

## 📁 Project Structure

```
src/
├── components/
│   └── ProtectedRoute.tsx
├── context/
│   └── AuthContext.tsx
├── pages/
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── Game.tsx
│   ├── Leaderboard.tsx
│   ├── About.tsx
│   └── AdminSetup.tsx
├── styles/
│   ├── Auth.css
│   ├── Game.css
│   ├── Dashboard.css
│   ├── Leaderboard.css
│   ├── About.css
│   ├── Home.css
│   └── index.css
└── App.tsx
```

## 🔧 Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🌐 Deployment

### Firebase Hosting
```bash
firebase deploy
```

### Vercel
```bash
vercel
```

### Netlify
```bash
netlify deploy --prod --dir=dist
```

## 🔐 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** → **Email/Password**
4. Copy your Firebase config
5. Update `src/context/AuthContext.tsx` with your config

## 📱 Responsive Design

- ✅ Mobile (< 768px)
- ✅ Tablet (768px - 1024px)
- ✅ Desktop (> 1024px)

## 🎯 Game Features

| Feature | Details |
|---------|---------|
| Artifacts | 6 per level with unique emojis |
| Points | 10-30 per artifact discovery |
| Hints | Available for each artifact |
| Levels | Progressive difficulty levels |
| Leaderboard | Top 10 global rankings |
| Scoring | Cumulative points tracking |

## 🚨 Production Notes

Before deploying to production:
1. Update Firebase config with your credentials
2. Remove `/admin/setup` route
3. Delete `src/pages/AdminSetup.tsx`
4. Delete `src/utils/setupDefaultUser.ts`
5. Remove "Setup" button from Home page

## 💡 Customization

### Add More Artifacts
Edit `src/pages/Game.tsx` and add to the artifacts array:
```typescript
{ id: 7, name: 'Your Item', hint: 'Clue...', points: 20, found: false, emoji: '🎯' }
```

### Change Colors
Update gradient colors in CSS files:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Modify Game Text
Update content in page components:
- Game.tsx - Game descriptions
- About.tsx - Archaeological info
- Dashboard.tsx - Dashboard text

## 📞 Support

- Check [PROJECT_COMPLETE.md](PROJECT_COMPLETE.md) for troubleshooting
- Review [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions
- Check browser console (F12) for error messages

## 📄 License

Open source project for educational purposes.

---

**Start playing now**: [http://localhost:5173](http://localhost:5173)

**Happy Archaeological Adventures!** 🏺
