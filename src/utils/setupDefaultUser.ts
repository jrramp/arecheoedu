import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

/**
 * Setup default test user
 * Email: cyber@example.com
 * Password: turtle2025
 * 
 * This function can be called once during app initialization
 * to create a default test user if it doesn't exist.
 */
export const setupDefaultUser = async () => {
  const auth = getAuth();
  const defaultEmail = 'cyber@example.com';
  const defaultPassword = 'turtle2025';
  const defaultName = 'Cyber Archaeologist';

  try {
    // Try to create the default user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      defaultEmail,
      defaultPassword
    );

    // Update the user profile with display name
    await updateProfile(userCredential.user, {
      displayName: defaultName,
    });

    console.log('✓ Default user created successfully!');
    console.log(`  Email: ${defaultEmail}`);
    console.log(`  Password: ${defaultPassword}`);
    console.log(`  Name: ${defaultName}`);

    return true;
  } catch (error: any) {
    // If user already exists, that's fine
    if (error.code === 'auth/email-already-in-use') {
      console.log('✓ Default user already exists');
      return false;
    }

    // Log other errors
    console.error('Error creating default user:', error.message);
    return false;
  }
};

/**
 * Manual setup instructions for Firebase Console
 * 
 * If you prefer to set up manually:
 * 1. Go to https://console.firebase.google.com/
 * 2. Select your project
 * 3. Go to Authentication > Users
 * 4. Click "Add User"
 * 5. Enter:
 *    - Email: cyber@example.com
 *    - Password: turtle2025
 * 6. Click "Create User"
 * 
 * The user will then be available for login in the app.
 */
