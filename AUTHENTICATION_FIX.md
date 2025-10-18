# Authentication Fix Documentation

## Problem
When clicking "Continue as Demo User", the application was redirecting back to the login page instead of logging in successfully.

## Root Causes Identified

1. **Missing Credentials**: The `signIn('demo')` call wasn't passing the required `email` and `name` credentials to the CredentialsProvider
2. **Adapter Conflict**: Using PrismaAdapter with JWT session strategy was causing conflicts
3. **Callback Issues**: The JWT callbacks weren't properly setting the user ID in the token

## Changes Made

### 1. Updated `src/lib/auth.ts`
- **Removed PrismaAdapter** from the authOptions to avoid conflicts with JWT strategy
- **Enhanced Demo Provider**: Now uses default values (`demo@example.com` and `Demo User`) if credentials aren't provided
- **Improved JWT Callback**: Properly sets `token.sub`, `token.email`, and `token.name` from user object
- **Added signIn Callback**: Ensures demo authentication is always allowed
- **Session Configuration**: Set maxAge to 30 days for better user experience

### 2. Updated `src/components/gemini/GeminiLayout.tsx`
- **Added Credentials**: The demo sign-in button now passes `email` and `name` explicitly
- **Force Redirect**: Uses `window.location.href` for a hard redirect after successful login to ensure session is loaded
- **Error Handling**: Better error handling with redirect disabled to check result before redirecting

### 3. Updated `src/app/auth/signin/page.tsx`
- **Consistent Credentials**: Ensures email and name are always passed (with defaults if empty)
- **Force Redirect**: Uses `window.location.href` instead of `router.push()` for reliable session initialization
- **Better Error Display**: Shows specific error messages from the authentication result

## How It Works Now

1. User clicks "Continue as Demo User"
2. `signIn('demo', { email: 'demo@example.com', name: 'Demo User', redirect: false })` is called
3. The CredentialsProvider's `authorize` function:
   - Receives the credentials
   - Checks if a user with that email exists in the database
   - Creates the user if they don't exist
   - Returns a valid user object with `id`, `email`, and `name`
4. NextAuth creates a JWT token with the user information
5. The JWT callback ensures `token.sub` is set to the user ID
6. The session callback adds the user ID to the session object
7. On successful authentication, a hard redirect to `/` is performed
8. The `GeminiLayout` component checks the session and displays the authenticated UI

## Testing Steps

### Test 1: Demo Login from Home Page
1. Navigate to `http://localhost:3000`
2. You should see the login screen in `GeminiLayout`
3. Click "Continue as Demo User"
4. You should be redirected to the main application with the chat interface
5. Verify your name appears in the user menu (top right)

### Test 2: Demo Login from Sign-In Page
1. Navigate to `http://localhost:3000/auth/signin`
2. The form should be pre-filled with "demo@example.com" and "Demo User"
3. Click "Continue as Demo User"
4. You should be redirected to the main application
5. Verify authentication is working

### Test 3: Session Persistence
1. After logging in, refresh the page
2. You should remain logged in (not redirected to login page)
3. Close and reopen the browser tab
4. You should still be logged in for 30 days

## Environment Requirements

Make sure your `.env` file has:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=change-me-generate-a-secure-random-string
DATABASE_URL=file:./dev.db
```

## Database Setup

The SQLite database is already configured. If you need to reset it:
```bash
npx prisma db push
```

## For CodeSandbox Deployment

When deploying to CodeSandbox:

1. **Set Environment Variables**: In CodeSandbox, go to Settings → Environment Variables and add:
   - `NEXTAUTH_URL`: Set to your CodeSandbox preview URL (e.g., `https://abc123.csb.app`)
   - `NEXTAUTH_SECRET`: Generate a secure random string
   - `DATABASE_URL`: `file:./dev.db` (SQLite works in CodeSandbox)

2. **Run Database Setup**: In the terminal, run:
   ```bash
   npx prisma db push
   ```

3. **Restart the Dev Server**: Stop and restart the preview to ensure environment variables are loaded

## Common Issues and Solutions

### Issue: Still redirecting to login
**Solution**: Clear browser cookies and local storage, then try again
```javascript
// In browser console:
localStorage.clear()
// Then refresh the page
```

### Issue: "Demo sign in failed"
**Solution**: Check the browser console for specific error messages. Common causes:
- Database not initialized (run `npx prisma db push`)
- NEXTAUTH_SECRET not set properly
- NEXTAUTH_URL doesn't match your application URL

### Issue: Session not persisting
**Solution**: 
1. Check that cookies are enabled in your browser
2. Verify NEXTAUTH_URL matches exactly (including http/https and port)
3. Clear cookies and try again

## Technical Details

### Session Strategy: JWT
- **Why JWT**: Works without a database connection for session storage
- **Token Storage**: Stored in HTTP-only cookies for security
- **Token Expiry**: 30 days (configurable in auth.ts)

### Authentication Flow
```
User Click → signIn('demo') → CredentialsProvider.authorize() 
→ Create/Find User in DB → Return User Object → Create JWT Token 
→ jwt Callback (set token.sub) → session Callback (add user.id) 
→ Hard Redirect → Load Session → Show Authenticated UI
```

## Next Steps

1. Test the demo login functionality
2. If using OAuth (Google/GitHub), ensure those credentials are configured in `.env`
3. Consider adding more user profile fields to the demo user flow
4. Implement sign-out functionality (already present in UI)

## Support

If you encounter any issues:
1. Check browser console for errors
2. Check server terminal for authentication errors
3. Verify database exists: Look for `prisma/dev.db` file
4. Ensure all dependencies are installed: `npm install`
