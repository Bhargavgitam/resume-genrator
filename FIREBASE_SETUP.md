# Firebase Setup Guide for ResumeAI Pro

This guide will walk you through setting up Firebase Authentication and Firestore for the ResumeAI Pro application.

## Prerequisites

- A Google account
- Access to the [Firebase Console](https://console.firebase.google.com/)

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Enter project name: `resumeai-pro` (or your preferred name)
4. Choose whether to enable Google Analytics (optional)
5. Click **"Create project"**
6. Wait for the project to be created and click **"Continue"**

## Step 2: Register Your Web App

1. In the Firebase Console, click the **web icon** (`</>`) to add a web app
2. Enter app nickname: `ResumeAI Pro Web App`
3. **Do NOT** check "Also set up Firebase Hosting" (we're using Netlify)
4. Click **"Register app"**
5. Copy the Firebase configuration object - you'll need this later
6. Click **"Continue to console"**

## Step 3: Enable Authentication

1. In the Firebase Console sidebar, click **"Authentication"**
2. Click **"Get started"**
3. Go to the **"Sign-in method"** tab
4. Click on **"Email/Password"**
5. Enable **"Email/Password"** (first toggle)
6. **Do NOT** enable "Email link (passwordless sign-in)"
7. Click **"Save"**

### Configure Authentication Settings

1. Still in Authentication, go to **"Settings"** tab
2. Click **"User actions"** 
3. **Disable** "Enable create (sign-up)" - this prevents new user registration
4. Click **"Save"**

## Step 4: Set Up Firestore Database

1. In the Firebase Console sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in production mode"** (we'll configure rules later)
4. Select your preferred location (choose closest to your users)
5. Click **"Done"**

### Configure Firestore Security Rules

1. In Firestore, go to the **"Rules"** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read their own user document
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false; // Only admin can write user data
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click **"Publish"**

## Step 5: Create User Documents

You need to manually create user documents in Firestore for each authorized user.

1. In Firestore, go to **"Data"** tab
2. Click **"Start collection"**
3. Collection ID: `users`
4. Click **"Next"**
5. For each user you want to authorize:

   **Document ID**: Use the user's UID (you'll get this after creating the user in Authentication)
   
   **Fields**:
   ```
   email: string = "user@example.com"
   isAllowed: boolean = true
   needsPasswordChange: boolean = true
   createdAt: timestamp = (current time)
   ```

## Step 6: Create User Accounts

Since sign-up is disabled, you need to create user accounts manually:

1. In Authentication, go to **"Users"** tab
2. Click **"Add user"**
3. Enter the user's email and a temporary password
4. Click **"Add user"**
5. Copy the **User UID** from the users list
6. Go back to Firestore and create a user document with this UID (see Step 5)

## Step 7: Configure Your Application

1. Update your `.env` file with the Firebase configuration:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_from_firebase_config
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Backend API URL
VITE_API_BASE_URL=http://localhost:3001
```

2. Update your Netlify environment variables with the same Firebase configuration

## Step 8: Deploy Your Backend Server

Your backend server (in the `server/` folder) needs to be deployed to handle AI generation securely.

### Option A: Deploy to Railway

1. Go to [Railway](https://railway.app/)
2. Sign up/login with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Set the **Root Directory** to `server`
6. Add environment variables:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   NODE_ENV=production
   ```
7. Deploy and copy the generated URL

### Option B: Deploy to Render

1. Go to [Render](https://render.com/)
2. Sign up/login with GitHub
3. Click **"New"** → **"Web Service"**
4. Connect your repository
5. Set **Root Directory** to `server`
6. Set **Build Command** to `npm install`
7. Set **Start Command** to `npm start`
8. Add environment variables:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   NODE_ENV=production
   ```
9. Deploy and copy the generated URL

### Update Frontend Configuration

After deploying your backend, update your environment variables:

```env
# Update this with your deployed backend URL
VITE_API_BASE_URL=https://your-backend-url.com
```

## Step 9: User Management Workflow

### Adding New Users

1. **Create Authentication Account**:
   - Go to Firebase Console → Authentication → Users
   - Click "Add user"
   - Enter email and temporary password (e.g., `TempPass123!`)
   - Copy the generated User UID

2. **Create Firestore Document**:
   - Go to Firestore → Data → users collection
   - Click "Add document"
   - Document ID: Use the User UID from step 1
   - Add fields:
     ```
     email: "user@example.com"
     isAllowed: true
     needsPasswordChange: true
     createdAt: (current timestamp)
     ```

3. **Provide Credentials**:
   - Send the user their email and temporary password
   - Inform them they'll be required to change the password on first login

### Revoking User Access

1. Go to Firestore → Data → users → [user_document]
2. Change `isAllowed` from `true` to `false`
3. The user will immediately lose access to the application

### Re-enabling User Access

1. Go to Firestore → Data → users → [user_document]
2. Change `isAllowed` from `false` to `true`
3. The user can immediately access the application again

### Forcing Password Change

1. Go to Firestore → Data → users → [user_document]
2. Change `needsPasswordChange` from `false` to `true`
3. The user will be required to change their password on next login

## Step 10: Testing the Setup

1. **Test Authentication Flow**:
   - Try logging in with a created user account
   - Verify password change is required on first login
   - Test the new password works for subsequent logins

2. **Test Access Control**:
   - Set `isAllowed` to `false` for a user
   - Verify they get the "Access Denied" page
   - Set it back to `true` and verify access is restored

3. **Test Password Reset**:
   - Use the "Forgot Password" feature
   - Check that reset emails are sent
   - Verify the reset process works

## Security Best Practices

1. **Strong Temporary Passwords**: Use complex temporary passwords (8+ chars, mixed case, numbers, symbols)
2. **Regular Access Review**: Periodically review user access in Firestore
3. **Monitor Authentication**: Check Firebase Authentication logs for suspicious activity
4. **Backup Strategy**: Export user data regularly from Firestore
5. **Environment Variables**: Never commit Firebase config to version control

## Troubleshooting

### Common Issues

1. **"Permission denied" errors**: Check Firestore security rules
2. **"User not found"**: Ensure user document exists in Firestore with correct UID
3. **"Email not verified"**: Email verification is disabled by default
4. **CORS errors**: Ensure backend CORS is configured for your frontend domain

### Firebase Console Locations

- **User Management**: Authentication → Users
- **Access Control**: Firestore → Data → users collection
- **Security Rules**: Firestore → Rules
- **API Keys**: Project Settings → General → Your apps

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure Firebase project configuration matches your setup
4. Check that user documents exist in Firestore with correct structure

For additional help, refer to the [Firebase Documentation](https://firebase.google.com/docs) or create an issue in the project repository.