# Admin Account Setup Guide

## 🔐 For Production Use

Now that you're live, you need to set up proper admin accounts instead of the temporary email check.

## Step 1: Run the Admin Roles Migration

1. **Go to Supabase Dashboard** → SQL Editor
2. **Open and run:** `supabase/13-admin-roles.sql`
3. This will:
   - Add a `role` column to the `profiles` table
   - Create admin check functions
   - Create a helper function to promote users to admin

## Step 2: Create Your First Admin Account

### Option A: If You Already Have an Account

Run this in **Supabase SQL Editor**:

```sql
-- Replace with your actual email
SELECT public.promote_to_admin('your-email@example.com');
```

### Option B: If You Need to Create a New Admin Account

1. **Sign up normally** through your app's sign-up flow
2. **Then promote yourself to admin** in Supabase SQL Editor:

```sql
-- Replace with the email you just signed up with
SELECT public.promote_to_admin('your-email@example.com');
```

## Step 3: Verify Admin Access

1. **Log in** to your app with the admin account
2. **Navigate to** `/admin`
3. You should see the full admin dashboard with all statistics

## Step 4: Create Additional Admins (Optional)

To add more admin users:

```sql
-- Add as many admins as needed
SELECT public.promote_to_admin('admin2@example.com');
SELECT public.promote_to_admin('admin3@example.com');
```

## Verify Your Admin Status

Check who has admin access:

```sql
SELECT 
  email, 
  full_name, 
  role, 
  created_at 
FROM public.profiles 
WHERE role = 'admin'
ORDER BY created_at;
```

## Remove Admin Access

If you need to remove admin access from someone:

```sql
UPDATE public.profiles 
SET role = 'user' 
WHERE email = 'former-admin@example.com';
```

## Security Notes

✅ **What Changed:**
- **Before:** Anyone with "admin" in their email could access admin dashboard (insecure)
- **After:** Only users with `role = 'admin'` in database can access (secure)

✅ **Best Practices:**
- Only give admin access to trusted team members
- Use strong passwords for admin accounts
- Enable 2FA in Supabase for admin accounts
- Regularly audit who has admin access
- Remove admin access when team members leave

## Troubleshooting

### Can't Access Admin Dashboard
```sql
-- Check your role
SELECT email, role FROM public.profiles WHERE email = 'your-email@example.com';

-- If role is 'user', promote yourself
SELECT public.promote_to_admin('your-email@example.com');
```

### "User not found" Error
Make sure the user has signed up first. The profile must exist before you can promote them.

### Still Shows Old Email Check Error
Clear your browser cache and cookies, then log in again.

## What This Enables

With proper admin roles, you can now:
- ✅ View all user statistics
- ✅ See page visit analytics
- ✅ Monitor popular pages
- ✅ View individual user dashboards
- ✅ Track revenue and conversions
- ✅ Safely share admin access with team members


