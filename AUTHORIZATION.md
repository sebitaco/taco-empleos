# Authorization System Documentation

## Overview

This application implements a comprehensive Role-Based Access Control (RBAC) system that provides fine-grained authorization for different user types and actions.

## User Roles

### Admin (`admin`)
- Full system access
- Can manage all users, jobs, and waitlist entries
- Access to admin dashboard
- Can perform all actions

### Employer (`employer`)
- Can create and manage their own job postings
- Access to company management features
- Can view applications for their jobs
- Cannot access admin features

### Candidate (`candidate`)
- Can apply for jobs
- Can manage their profile
- Limited access to job viewing features

### Guest (`guest`)
- Unauthenticated users
- Can only access public content

## Permissions

The system uses granular permissions that are assigned to roles:

### Waitlist Permissions
- `view_waitlist` - View waitlist entries
- `manage_waitlist` - Add/edit/delete waitlist entries
- `export_waitlist` - Export waitlist data

### Job Permissions
- `create_job` - Create new job postings
- `edit_own_job` - Edit jobs owned by the user
- `edit_any_job` - Edit any job (admin)
- `delete_own_job` - Delete jobs owned by the user
- `delete_any_job` - Delete any job (admin)
- `view_applications` - View job applications

### Admin Permissions
- `access_admin` - Access admin dashboard
- `system_config` - Modify system configuration
- `view_users` - View user accounts
- `manage_users` - Create/edit/delete users

## Usage Examples

### Protecting API Routes

```javascript
// Method 1: Using requirePermission in the route handler
import { requirePermission, Permissions } from '@/lib/auth'

export async function GET(request) {
  const authResult = await requirePermission(Permissions.VIEW_WAITLIST, { returnResponse: true })
  if (authResult instanceof NextResponse) {
    return authResult // Returns 401/403 response
  }
  
  const session = authResult
  // Proceed with authorized logic
}

// Method 2: Using the wrapper function
import { createProtectedApiHandler, Permissions } from '@/lib/auth/server-helpers'

const handler = createProtectedApiHandler(
  async (request, { session }) => {
    // Your protected logic here
    return NextResponse.json({ data: 'protected' })
  },
  {
    requirePermissions: [Permissions.VIEW_WAITLIST]
  }
)

export { handler as GET }
```

### Protecting Pages

```javascript
// In a page component
import { protectPage } from '@/lib/auth/server-helpers'
import { Permissions, UserRoles } from '@/lib/auth'

export default async function AdminPage() {
  // Protect the entire page
  const session = await protectPage({
    requireRole: UserRoles.ADMIN,
    requirePermissions: [Permissions.ACCESS_ADMIN]
  })
  
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {session.email}</p>
    </div>
  )
}
```

### Client-Side Authorization

```jsx
// Using the AuthProvider and hooks
import { AuthProvider, useAuth, RequireAuth } from '@/lib/auth/client'

// Wrap your app
function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  )
}

// Use in components
function AdminPanel() {
  const { user, hasPermission } = useAuth()
  
  if (!hasPermission('access_admin')) {
    return <div>Access denied</div>
  }
  
  return <div>Admin content</div>
}

// Conditional rendering
function JobActions({ jobOwnerId }) {
  const { canAccess } = useAuth()
  
  return (
    <div>
      {canAccess('job', jobOwnerId) && (
        <button>Edit Job</button>
      )}
    </div>
  )
}

// Protected components
function ProtectedContent() {
  return (
    <RequireAuth 
      permission="view_waitlist"
      fallback={<div>Access denied</div>}
    >
      <WaitlistData />
    </RequireAuth>
  )
}
```

### Middleware Configuration

The middleware automatically protects routes based on the configuration in `lib/auth/middleware.js`:

```javascript
export const defaultAuthConfig = {
  routes: {
    // Protect admin API routes
    'GET:/api/admin/*': {
      requireAuth: true,
      requirePermissions: Permissions.ACCESS_ADMIN
    },
    
    // Protect job management
    'POST:/api/jobs': {
      requireAuth: true,
      requirePermissions: Permissions.CREATE_JOB,
      requireCSRF: true
    }
  },
  
  pathPrefixes: {
    '/admin': {
      requireAuth: true,
      requireRole: UserRoles.ADMIN
    }
  }
}
```

## Session Management

### Creating Sessions

```javascript
import { createSession, UserRoles } from '@/lib/auth'

const user = {
  id: 'user-123',
  email: 'user@example.com',
  role: UserRoles.EMPLOYER,
  companyId: 'company-456'
}

await createSession(user)
```

### Checking Sessions

```javascript
import { getSession } from '@/lib/auth'

const session = await getSession()
if (session) {
  console.log('User:', session.email)
  console.log('Role:', session.role)
  console.log('Permissions:', session.permissions)
}
```

### Destroying Sessions

```javascript
import { destroySession } from '@/lib/auth'

await destroySession()
```

## Resource Ownership

The system supports checking ownership of resources:

```javascript
import { canAccessResource } from '@/lib/auth'

const session = await getSession()
const canEdit = canAccessResource(session, 'job', jobOwnerId)
```

## Testing

Use the test endpoint to verify authorization in development:

```bash
# Create a test admin session
curl -X POST http://localhost:3000/api/auth/test \
  -H "Content-Type: application/json" \
  -d '{"action": "create_test_session", "role": "admin"}'

# Test admin access
curl -X POST http://localhost:3000/api/auth/test \
  -H "Content-Type: application/json" \
  -d '{"action": "test_admin_access"}'
```

## Security Considerations

1. **JWT Secrets**: Always use strong, unique secrets in production
2. **HTTPS**: Ensure all authentication happens over HTTPS in production
3. **Session Expiry**: Sessions expire after 7 days by default
4. **CSRF Protection**: State-changing operations require CSRF tokens
5. **Rate Limiting**: Authentication endpoints should be rate-limited
6. **Audit Logging**: Log important authorization events

## Environment Variables

```bash
# Required for production
JWT_SECRET=your-strong-secret-key-here
CSRF_SECRET=another-strong-secret-key

# Optional
SESSION_EXPIRY_SECONDS=604800  # 7 days default
```

## Error Handling

The system returns standard HTTP status codes:

- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `500 Internal Server Error` - Server-side authorization error

Error responses include descriptive messages:

```json
{
  "error": "Missing required permission: view_waitlist"
}
```