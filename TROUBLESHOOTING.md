# Troubleshooting Guide

## Authentication Issues (400 Error)

If you're getting a 400 error when trying to log in, follow these steps:

### 1. Check Environment Variables

Make sure your `.env.local` file has the correct Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**To find these values:**
1. Go to your Supabase dashboard
2. Navigate to Settings > API
3. Copy the "Project URL" and "anon public" key

### 2. Create an Admin User

You need to create a user in Supabase Auth before you can log in:

#### Option A: Using Supabase Dashboard (Recommended)
1. Go to your Supabase dashboard
2. Navigate to **Authentication > Users**
3. Click **"Add User"**
4. Enter:
   - Email: `admin@yourdomain.com` (or your preferred email)
   - Password: Choose a strong password
5. Click **"Create User"**

#### Option B: Using Supabase CLI
```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Login to Supabase
supabase login

# Create a user
supabase auth signup --email admin@yourdomain.com --password yourpassword
```

### 3. Enable Email Confirmation (Optional)

If you want to require email confirmation:
1. Go to Supabase dashboard
2. Navigate to **Authentication > Settings**
3. Under "Email Auth", enable "Confirm email"
4. Configure your email provider

### 4. Test the Login

After creating the user, try logging in with the credentials you created.

### 5. Check Browser Console

Open your browser's developer tools (F12) and check the Console tab for more detailed error messages.

## Common Error Messages

### "Invalid login credentials"
- The email or password is incorrect
- The user doesn't exist in Supabase Auth
- Solution: Create a user first

### "Email not confirmed"
- The user exists but email confirmation is required
- Solution: Confirm the email or disable email confirmation

### "Too many requests"
- Rate limiting is active
- Solution: Wait a few minutes and try again

### "Network error"
- Check your internet connection
- Verify the Supabase URL is correct

## Database Setup Issues

### "Table doesn't exist"
1. Run the SQL from `DATABASE_SETUP.md` in your Supabase SQL editor
2. Make sure the `products` table is created

### "Storage bucket not found"
1. Create a storage bucket named `product-images`
2. Set it to public
3. Configure the storage policies

## Environment Variables Check

Create a simple test page to verify your environment variables:

```typescript
// app/test-env/page.tsx
export default function TestEnv() {
  return (
    <div className="p-8">
      <h1>Environment Variables Test</h1>
      <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
      <p>Supabase Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
    </div>
  )
}
```

## Quick Fix Checklist

- [ ] Environment variables are set correctly
- [ ] Admin user exists in Supabase Auth
- [ ] Database table is created
- [ ] Storage bucket is configured
- [ ] Storage policies are set
- [ ] No typos in email/password

## Still Having Issues?

1. **Check Supabase Dashboard**: Verify your project is active
2. **Check Network Tab**: Look for failed requests
3. **Try Different Browser**: Rule out browser-specific issues
4. **Check Supabase Status**: Visit status.supabase.com

## Getting Help

If you're still having issues:
1. Check the browser console for detailed error messages
2. Verify all environment variables are correct
3. Ensure the user exists in Supabase Auth
4. Test with a simple login first before using the full admin panel 