# Tenant Provider Documentation

The `TenantProvider` manages tenant (workspace) information throughout the application. It automatically fetches the user's workspace data from the API and stores the tenant ID both in memory and localStorage.

## Setup

The provider is already configured in the main layout (`app/layout.tsx`):

```tsx
<QueryProvider>
  <TenantProvider>{children}</TenantProvider>
</QueryProvider>
```

## Usage

### Using the full tenant context

```tsx
import { useTenant } from "@/providers/TenantProvider";

function MyComponent() {
  const { tenantId, isLoading, error, refetch, clearTenant } = useTenant();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Current Tenant: {tenantId}</div>;
}
```

### Using just the tenant ID

```tsx
import { useTenantId } from "@/providers/TenantProvider";

function MyComponent() {
  const tenantId = useTenantId();

  return <div>Tenant: {tenantId}</div>;
}
```

## API Integration

The provider fetches data from:

- **Endpoint**: `${NEXT_PUBLIC_SERVER_API}/api/v1/orgs/my-workspaces`
- **Headers**:
  - `accept: */*`
  - `access_token: {supabase_access_token}`

## Data Management

- **Automatic Fetch**: The provider automatically fetches tenant data when a valid auth token is available
- **Local Storage**: The tenant ID is persisted in localStorage as `tenantId`
- **Cleanup**: When the user logs out, `clearTenant()` is called to remove the tenant data

## Environment Variables

Make sure you have `NEXT_PUBLIC_SERVER_API` configured in your environment variables. The provider defaults to `http://localhost:5588` if not set.

## Response Format

The API returns data in this format:

```json
{
  "data": {
    "personal": {
      "id": "02841b7c-bc30-4a81-ac9e-305913a7e213",
      "name": "raktim's Workspace",
      "slug": "user-b6ec7ce4-b3d6-458f-b2ef-e3ff1f59ae2f",
      "description": null,
      "isActive": true,
      "isPersonal": true,
      "ownerId": "b6ec7ce4-b3d6-458f-b2ef-e3ff1f59ae2f",
      "createdAt": "2025-09-05T03:52:37.006Z",
      "updatedAt": "2025-09-05T03:52:37.006Z"
    },
    "teams": []
  }
}
```

The `slug` from the `personal` object is stored as the `tenantId`.
