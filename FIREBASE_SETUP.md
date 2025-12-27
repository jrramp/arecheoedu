# 🔧 Firebase Setup Guide

## ⚠️ Current Issue

You're seeing this error:
```
Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.).
```

This happens because the Firebase config needs **real credentials** from a Firebase project.

---

## ✅ Solution: Create Your Own Firebase Project

### Step 1: Go to Firebase Console
1. Visit: https://console.firebase.google.com/
2. Sign in with your Google account (create one if needed)

### Step 2: Create a New Project
1. Click "**Add Project**" button
2. Enter project name: `archaeology-game` (or your choice)
3. Click "**Continue**"
4. Enable Google Analytics: **Uncheck it** (optional)
5. Click "**Create Project**"
6. Wait 1-2 minutes for project creation

### Step 3: Enable Authentication
1. In the left sidebar, click "**Authentication**"
2. Click "**Get Started**"
3. Find "**Email/Password**" option
4. Click the toggle to enable it
5. Click "**Save**"

### Step 4: Get Your Firebase Config
1. In the left sidebar, go to "**Project Settings**" (⚙️ icon, bottom left)
2. Scroll down to find "**Your apps**" section
3. Look for a **Web** app (if none exists, click "Add app" → Web)
4. You'll see a config object like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123...",
  appId: "1:123...:web:abc..."
};
```

### Step 5: Update Your App Config
1. Copy your Firebase config
2. Open: `src/context/AuthContext.tsx` in your editor
3. Find the `firebaseConfig` object at the top
4. Replace all values with your copied config:

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

### Step 6: Save and Refresh
1. Save the file (Ctrl+S)
2. The dev server will auto-reload
3. Go back to http://localhost:5173
4. Refresh the page (F5)
5. Try the app again!

---

## 🎯 Quick Checklist

- [ ] Visited https://console.firebase.google.com/
- [ ] Created new project
- [ ] Enabled Email/Password authentication
- [ ] Copied Firebase config
- [ ] Updated `src/context/AuthContext.tsx`
- [ ] Saved the file
- [ ] Refreshed the app
- [ ] Test login works!

---

## ✨ Testing Your Setup

### Create Default User
1. Open http://localhost:5173
2. Click "**Setup**" button
3. Click "**Create Default User**"
4. You should see: "✓ Default user created successfully!"

### Login and Play
1. Click "**Login**"
2. Email: `cyber@example.com`
3. Password: `turtle2025`
4. Should work now! ✅

---

## 🆘 Still Getting Errors?

### Error: "auth/project-not-configured"
**Solution**: Make sure Email/Password is enabled in Firebase Console:
- Go to Authentication → Email/Password
- Toggle should be **ON** (blue)
- Click "Save"

### Error: "auth/invalid-api-key"
**Solution**: Your config values are incomplete or incorrect:
- Go back to Firebase Console
- Copy the EXACT config (don't edit values)
- Paste it exactly as-is in AuthContext.tsx

### Error: "Cannot find module 'firebase'"
**Solution**: Run `npm install firebase`

### Still not working?
1. Hard refresh: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)
2. Close browser tab and reopen
3. Check browser console (F12) for exact error message
4. Copy error message and search Firebase docs

---

## 🔒 Security Notes

### Don't Worry About API Key Security
- These API keys are safe to share
- Firebase uses Security Rules to protect data
- You'll set up rules for production
- For now, it just needs to be valid

### For Production
1. Set up Firebase Security Rules
2. Enable HTTPS
3. Use environment variables for sensitive configs
4. Never commit real keys (use .env files)

---

## 📚 Firebase Documentation

- Firebase Console: https://console.firebase.google.com/
- Authentication Docs: https://firebase.google.com/docs/auth
- Setup Guide: https://firebase.google.com/docs/auth/get-started
- Web Setup: https://firebase.google.com/docs/web/setup

---

## ✅ What to Do Now

### Option A: Use Your Own Firebase Project (Recommended)
1. Follow steps 1-6 above
2. Get your real Firebase credentials
3. Update the config
4. Test the app
5. Create accounts and play!

### Option B: Use a Test Project (For Now)
We've already provided a test config. It may or may not work depending on Firebase restrictions.

---

## 🎮 Once Firebase is Working

1. Create default user:
   - Click "Setup" → "Create Default User"

2. Login:
   - Email: cyber@example.com
   - Password: turtle2025

3. Play the game!
   - Click "Play Game" on dashboard
   - Find 6 artifacts
   - Earn points
   - Check leaderboard

---

## 💡 Tips

✅ **Do:**
- Use a valid Google account
- Keep Firebase console open while testing
- Test authentication immediately
- Create test accounts

❌ **Don't:**
- Share real database credentials publicly
- Use the same project for production and testing
- Modify Firebase Rules without understanding them

---

## 🚀 Next Steps

1. **Get Firebase credentials** (steps 1-4)
2. **Update config** in your app (step 5)
3. **Test** by creating default user (step 6)
4. **Play** the game!

---

**Need Help?** Check the error message in your browser console (F12) and search the Firebase documentation for the exact error code.

**Ready to set up Firebase?** Let's go! 🚀
