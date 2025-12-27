# Quick Start Guide - Default User Setup

## Default Test User

A default test user has been created for easy testing:

- **Email**: cyber@example.com
- **Password**: turtle2025
- **Display Name**: Cyber Archaeologist

## Two Ways to Create the User

### Option 1: Using the Admin Setup Page (Easiest) ⭐

1. Open the app at `http://localhost:5173`
2. Click the **"Setup"** button in the top navigation
3. Click **"Create Default User"** button
4. You'll see a success message confirming the user was created
5. Go back and click **"Login"**
6. Enter the credentials above

### Option 2: Manual Setup via Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **Authentication** in the left sidebar
4. Click the **Users** tab
5. Click **"Create User"** button
6. Enter:
   - Email: `cyber@example.com`
   - Password: `turtle2025`
7. Click **"Create User"**
8. Return to the app and login

### Option 3: Create Your Own Account

1. Click **"Register"** on the home page
2. Fill in your details:
   - Display Name: (your name)
   - Email: (your email)
   - Password: (at least 6 characters)
   - Confirm Password: (same as above)
3. Click **"Register"**
4. You'll be automatically logged in

## Testing the App

### Home Page
- View game information
- See features overview
- Access Login/Register/Setup buttons

### Login Page
- Enter email and password
- Test with `cyber@example.com` / `turtle2025`
- Link to registration page

### Dashboard
- See welcome message with your name
- Access game options:
  - **Play Game**: Start the artifact discovery game
  - **Leaderboard**: View top players
  - **About**: Learn about archaeology

### Game Page
- Find 6 different artifacts
- Use hints to help locate them
- Click "Find" to collect artifacts
- Earn points for each discovery
- Progress to next level when all found

### Leaderboard
- View top 10 players
- See scores and levels
- Check artifact count
- Compare your performance

### About Page
- Learn about archaeology
- Discover famous archaeological sites
- Understand game mechanics
- Read scoring information

## Admin Setup Page Features

**Location**: Click "Setup" on home page or visit `/admin/setup`

**What it does**:
- Creates the default user (cyber@example.com / turtle2025)
- Handles "user already exists" gracefully
- Shows success/error messages
- Provides clear feedback

**Note**: This is a development feature. Remove in production.

## Firebase Configuration

Before using the default user, ensure Firebase is configured:

1. Your Firebase config is in `src/context/AuthContext.tsx`
2. Authentication method must be **Email/Password**
3. The config should have valid credentials for your Firebase project

If you haven't set up Firebase yet:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** → **Email/Password**
4. Copy your Firebase config
5. Update `src/context/AuthContext.tsx` with your config:

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

## Testing Scenarios

### Scenario 1: Quick Test
1. Go to Admin Setup page (`/admin/setup`)
2. Click "Create Default User"
3. Click "Login"
4. Enter `cyber@example.com` and `turtle2025`
5. Explore the game

### Scenario 2: Create Multiple Users
1. Register new accounts with different emails
2. Log in with each account
3. Each account has independent game progress
4. Compete on the leaderboard

### Scenario 3: Test Authentication
1. Try logging in with wrong password
2. Try registering with existing email
3. Try accessing protected pages without login
4. Log out and verify redirect to login

## Troubleshooting

### "Firebase Configuration" Error
- Check Firebase config in `AuthContext.tsx`
- Ensure your Firebase project is active
- Verify API key is correct

### "User Already Exists" Message
- The default user already exists
- Use those credentials to login
- Or delete the user in Firebase Console and recreate

### Can't Login
- Verify email and password are correct
- Check Firebase console to ensure user exists
- Clear browser cache and try again

### Game Not Loading After Login
- Check browser console for errors (F12)
- Ensure protected routes are properly configured
- Try refreshing the page

## Customizing the Default User

To change the default user credentials, edit `src/pages/AdminSetup.tsx`:

```typescript
// Find these lines and change them:
const defaultEmail = 'cyber@example.com';      // Change email
const defaultPassword = 'turtle2025';          // Change password
const defaultName = 'Cyber Archaeologist';     // Change name
```

Also update `src/utils/setupDefaultUser.ts` with the same changes.

## Moving to Production

**Important**: Before deploying to production:

1. **Remove the Admin Setup page** from `src/App.tsx`
2. **Delete** `src/pages/AdminSetup.tsx`
3. **Delete** `src/utils/setupDefaultUser.ts`
4. Remove the "Setup" button from `src/pages/Home.tsx`
5. Manage users only through Firebase Console

This prevents unauthorized user creation in production.

## Next Steps

- Start the dev server: `npm run dev`
- Visit: `http://localhost:5173`
- Click "Setup" to create default user
- Click "Login" and use the credentials above
- Enjoy the game!

---

**Ready to explore? Let's begin the archaeological adventure! 🏺**
