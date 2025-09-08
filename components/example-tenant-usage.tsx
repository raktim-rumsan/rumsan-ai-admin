// Example usage of the TenantProvider in a component

import { useTenant, useTenantId } from "@/providers/TenantProvider";

export function ExampleComponent() {
  // Option 1: Get full tenant context
  const { tenantId, isLoading, error, refetch } = useTenant();

  // Option 2: Get just the tenantId (for convenience)
  const currentTenantId = useTenantId();

  if (isLoading) {
    return <div>Loading tenant information...</div>;
  }

  if (error) {
    return (
      <div>
        Error loading tenant: {error.message}
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Current Tenant</h2>
      <p>Tenant ID: {tenantId}</p>
      <p>Alternative access: {currentTenantId}</p>
    </div>
  );
}
