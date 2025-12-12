# Firebase Authentication Setup Guide

## Overview

This application uses Firebase Authentication for secure user authentication. This guide will help you set up Firebase and configure the application to use it.

## Firebase Authentication Features

- **Email/Password Authentication**: Users can register and login using email and password
- **Google Sign-In**: Users can sign in using their Google account
- **Secure Authentication**: All authentication is handled by Firebase's secure infrastructure
- **Real-time Auth State**: Application automatically syncs with Firebase authentication state

## Setup Instructions

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter a project name (e.g., "CodeDrushti")
4. Follow the setup wizard to complete project creation

### 2. Enable Authentication Methods

1. In your Firebase project, navigate to **Build** → **Authentication**
2. Click on the **Sign-in method** tab
3. Enable the following providers:
   - **Email/Password**: Click on it, toggle "Enable", and save
   - **Google**: Click on it, toggle "Enable", provide a project support email, and save

### 3. Register Your Web App

1. In the Firebase Console, go to **Project Settings** (gear icon)
2. Under "Your apps", click the **Web** icon (`</>`)
3. Register your app with a nickname (e.g., "CodeDrushti Web")
4. You'll receive a `firebaseConfig` object with your credentials

### 4. Configure Environment Variables

1. In the `Frontend` directory, create a `.env` file (you can copy `.env.example`)
2. Add your Firebase configuration values:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

3. Replace the placeholder values with your actual Firebase configuration values

### 5. Configure Authorized Domains

For production deployment:

1. In Firebase Console, go to **Authentication** → **Settings** → **Authorized domains**
2. Add your production domain(s)
3. `localhost` is already authorized by default for development

## Usage

### For Users

#### Registration
1. Navigate to the Register page
2. Enter your username, email, and password (minimum 6 characters)
3. Agree to terms and conditions
4. Click "Register" or use "Sign in with Google"

#### Login
1. Navigate to the Login page
2. Enter your email and password
3. Click "Login" or use "Sign in with Google"

#### Logout
1. Click the "Logout" button in the sidebar
2. You'll be redirected to the login page

### For Developers

#### Authentication Flow

The authentication system is built using Firebase Authentication SDK:

- **AuthContext** (`src/contexts/AuthContext.jsx`): Manages authentication state
- **Firebase Config** (`src/config/firebase.js`): Firebase initialization and configuration
- **Login Component** (`src/pages/Login.jsx`): Handles user login
- **Register Component** (`src/pages/Register.jsx`): Handles user registration
- **Protected Routes** (`src/components/ProtectedRoute.jsx`): Guards authenticated routes

#### Key Files

```
Frontend/src/
├── config/
│   └── firebase.js           # Firebase configuration
├── contexts/
│   └── AuthContext.jsx       # Authentication state management
├── pages/
│   ├── Login.jsx            # Login page with Firebase integration
│   └── Register.jsx         # Registration page with Firebase integration
└── components/
    └── ProtectedRoute.jsx   # Route protection component
```

#### Authentication Methods

**Email/Password Sign In:**
```javascript
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

const userCredential = await signInWithEmailAndPassword(auth, email, password);
```

**Google Sign In:**
```javascript
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

const result = await signInWithPopup(auth, googleProvider);
```

**Sign Out:**
```javascript
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

await signOut(auth);
```

## Security Considerations

### Best Practices

1. **Never commit `.env` files**: The `.env` file contains sensitive configuration and should never be committed to version control
2. **Use environment variables**: All Firebase credentials are stored as environment variables
3. **Validate user input**: The app validates email format and password strength
4. **Error handling**: User-friendly error messages are displayed without exposing sensitive information
5. **Protected routes**: Dashboard and other sensitive routes are protected with `ProtectedRoute` component

### Firebase Security Rules

Consider setting up Firebase Security Rules for additional protection:

1. In Firebase Console, go to **Build** → **Authentication** → **Settings**
2. Configure email enumeration protection
3. Set password policy requirements
4. Enable multi-factor authentication (optional but recommended)

## Troubleshooting

### Common Issues

**Issue: "Firebase: Error (auth/configuration-not-found)"**
- **Solution**: Ensure all environment variables are set correctly in `.env`
- Restart the development server after adding/changing environment variables

**Issue: "Firebase: Error (auth/popup-blocked)"**
- **Solution**: Allow popups for the application domain in browser settings

**Issue: "Firebase: Error (auth/unauthorized-domain)"**
- **Solution**: Add your domain to Authorized domains in Firebase Console

**Issue: Authentication state not persisting**
- **Solution**: Check browser's local storage settings and ensure it's not being cleared

### Testing

To test the authentication:

1. Start the frontend development server: `npm run dev`
2. Navigate to `/register` to create a test account
3. Use the email/password registration or Google Sign-In
4. Verify you can login and access protected routes
5. Test logout functionality

## Migration from Demo Authentication

The previous demo authentication with hardcoded credentials has been removed and replaced with Firebase Authentication. Key changes:

- Removed hardcoded credentials check in Login.jsx
- Replaced local token storage with Firebase auth state management
- Added real-time authentication state synchronization
- Implemented secure Google Sign-In
- Added proper error handling and user feedback

## Additional Resources

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Web Setup Guide](https://firebase.google.com/docs/web/setup)
- [Firebase Security Best Practices](https://firebase.google.com/docs/rules/basics)
