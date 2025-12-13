# Critical Security Fix - Environment Variable Exposure

## ⚠️ Issue Identified

**Severity:** CRITICAL

The application was exposing server-side secrets (API keys, secret tokens) in the browser console due to improper environment variable validation.

### What Was Happening

1. The `src/lib/env.ts` file used `envalid` to validate ALL environment variables (including server secrets)
2. This file was imported by `src/lib/supabase.ts`
3. `supabase.ts` was then imported by client-side components like:
   - `src/hooks/useAdmin.ts`
   - `src/components/admin/PopularPages.tsx`
   - `src/contexts/AuthContext.tsx`
4. When bundled for the browser, this caused `envalid` to try validating server-side secrets
5. `envalid` logs all environment variables to the console when validation fails
6. **Result: ALL secrets were visible in the browser console** including:
   - `STRIPE_SECRET_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `HCAPTCHA_SECRET_KEY`
   - And more...

## ✅ Solution Implemented

### 1. Split Environment Variables

**Before:**
```typescript
// src/lib/env.ts - Mixed client and server vars
export const env = cleanEnv(process.env, {
  NEXT_PUBLIC_SUPABASE_URL: url(),
  SUPABASE_SERVICE_ROLE_KEY: str(), // ❌ Secret leaked to client!
  STRIPE_SECRET_KEY: str(), // ❌ Secret leaked to client!
  // ...
});
```

**After:**
```typescript
// src/lib/env.client.ts - ONLY public variables
export const clientEnv = cleanEnv(process.env, {
  NEXT_PUBLIC_SUPABASE_URL: url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: str(),
  // Only NEXT_PUBLIC_* variables
});

// src/lib/env.server.ts - ALL variables (for server use only)
export const serverEnv = cleanEnv(process.env, {
  // All variables including secrets
  SUPABASE_SERVICE_ROLE_KEY: str(),
  STRIPE_SECRET_KEY: str(),
  // ...
});
```

### 2. Updated Supabase Client

**Before:**
```typescript
// src/lib/supabase.ts
import { env } from './env'; // ❌ Pulls in server secrets

export const supabaseAdmin = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY // ❌ Secret in client bundle!
);
```

**After:**
```typescript
// src/lib/supabase.ts
import { clientEnv } from './env.client'; // ✅ Only public vars

// Client-safe Supabase client
export const supabase = createClient(
  clientEnv.NEXT_PUBLIC_SUPABASE_URL,
  clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Server-only admin client (lazy loaded)
export const createSupabaseAdmin = () => {
  const { serverEnv } = require('./env.server'); // ✅ Only loads on server
  return createClient(
    serverEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.SUPABASE_SERVICE_ROLE_KEY
  );
};
```

### 3. Created Secure API Routes

Client-side admin components now call secure API routes instead of directly accessing the database with admin privileges:

- `/api/admin/stats` - Returns admin statistics
- `/api/admin/popular-pages` - Returns popular pages data

These routes:
- Validate authentication tokens
- Check for admin role
- Only execute on the server
- Never expose secrets to the client

### 4. Updated All API Routes

All server-side API routes now use the secure pattern:

```typescript
// Inside API route handler
const supabaseAdmin = createSupabaseAdmin(); // ✅ Only runs on server
// Use supabaseAdmin for queries...
```

## 🔒 Security Best Practices Applied

1. **Separation of Concerns**
   - Client code ONLY accesses `NEXT_PUBLIC_*` variables
   - Server code uses `createSupabaseAdmin()` for privileged operations

2. **Principle of Least Privilege**
   - Client components use anonymous Supabase client (limited permissions)
   - Admin operations go through authenticated API routes
   - API routes validate user roles before granting access

3. **Defense in Depth**
   - Environment variable validation split by context
   - Lazy loading prevents accidental client-side imports
   - API routes act as security gatekeepers

## 📋 Action Items

### Immediate

- [x] Split environment variables into client/server files
- [x] Update Supabase client to use lazy loading for admin
- [x] Create secure API routes for admin operations
- [x] Update client components to call API routes
- [x] Update all API routes to use new pattern
- [x] Remove old insecure `env.ts` file

### Next Steps

1. **Rotate All Secrets** (CRITICAL!)
   - Generate new Stripe secret key
   - Generate new Supabase service role key
   - Generate new hCaptcha secret key
   - Update all secrets in production environment
   - The exposed secrets should be considered compromised

2. **Audit Access**
   - Check Stripe dashboard for unusual activity
   - Check Supabase logs for unauthorized access
   - Review recent database changes

3. **Add Monitoring**
   - Set up alerts for unusual admin API access
   - Monitor for unexpected database queries
   - Track failed authentication attempts

4. **Code Review**
   - Audit all imports in client-side code
   - Ensure no server-only modules are imported in components
   - Add pre-commit hooks to prevent future issues

## 🛡️ Prevention

To prevent this from happening again:

1. **Import Rules**
   - NEVER import `env.server.ts` in client components
   - NEVER import `createSupabaseAdmin()` in client code
   - Only use `supabase` (anon client) in components/hooks

2. **Build Checks**
   - Consider adding webpack plugin to detect server imports in client bundles
   - Add ESLint rules to prevent importing server-only modules
   - Set up CI checks to scan for exposed secrets

3. **Code Review Guidelines**
   - Review all new imports in client components
   - Ensure admin operations go through API routes
   - Check that secrets are never logged or exposed

## 📚 References

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/security)
- [OWASP: Sensitive Data Exposure](https://owasp.org/www-project-top-ten/2017/A3_2017-Sensitive_Data_Exposure)

