import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // First, handle Supabase session
  const supabaseResponse = await updateSession(request);
  // If Supabase middleware returned a redirect, return it
  if (supabaseResponse.status === 307 || supabaseResponse.status === 308) {
    return supabaseResponse;
  }

  const { pathname } = request.nextUrl;

  // Check if user has organization context (fully logged in)
  const organizationContext = getOrganizationContext(request);

  // If user is fully logged in (has org context) and trying to access auth routes, redirect to dashboard
  if (organizationContext && pathname.startsWith("/auth")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Allow auth and public routes to pass through without organization context checks
  // Note: API routes are excluded from middleware via the matcher config
  if (
    pathname.startsWith("/auth") ||
    pathname === "/" ||
    pathname.startsWith("/widget") ||
    pathname.startsWith("/bank") ||
    pathname.startsWith("/accept-invitation") ||
    pathname.startsWith("/invitation-pending") ||
    pathname.startsWith("/onboarding")
  ) {
    return supabaseResponse;
  }

  // Check if user is accessing admin routes
  if (pathname.startsWith("/admin")) {
    return handleAdminRoute(request, supabaseResponse);
  }

  // Check if user is accessing dashboard routes
  if (pathname.startsWith("/dashboard")) {
    return handleDashboardRoute(request, supabaseResponse);
  }

  return supabaseResponse;
}

function handleAdminRoute(request: NextRequest, response: NextResponse) {
  const organizationContext = getOrganizationContext(request);

  if (!organizationContext) {
    // No context found, redirect to login
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Check if user is an admin
  const isAdmin = checkIfUserIsAdmin(organizationContext);

  if (!isAdmin) {
    // User is not an admin, redirect to dashboard
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // User is admin, allow access
  return response;
}

function handleDashboardRoute(request: NextRequest, response: NextResponse) {
  const organizationContext = getOrganizationContext(request);

  if (!organizationContext) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return response;
}

function getOrganizationContext(request: NextRequest) {
  try {
    // Try to get from cookie first
    const orgContextCookie = request.cookies.get("organizationContext");
    if (orgContextCookie?.value) {
      return JSON.parse(orgContextCookie.value);
    }

    // Alternatively, check for a custom header (if your app sets it)
    const orgContextHeader = request.headers.get("x-organization-context");
    if (orgContextHeader) {
      return JSON.parse(orgContextHeader);
    }

    return null;
  } catch (error) {
    console.error("Error parsing organization context:", error);
    return null;
  }
}

interface Organization {
  id: string;
  name: string;
  slug: string;
  role: string;
  isOwner: boolean;
  joinedAt: string;
}

interface OrganizationContextData {
  userState?: string;
  primaryOrganization?: Organization;
  organizations?: Organization[];
}

function checkIfUserIsAdmin(
  organizationContext: OrganizationContextData
): boolean {
  try {
    // Check userState
    if (organizationContext.userState === "USER_WITH_ORG_ADMIN_ROLE") {
      return true;
    }

    // Check primary organization role
    if (
      organizationContext.primaryOrganization?.role === "ORG_ADMIN" ||
      organizationContext.primaryOrganization?.isOwner === true
    ) {
      return true;
    }

    // Check if any organization has admin role
    if (Array.isArray(organizationContext.organizations)) {
      return organizationContext.organizations.some(
        (org: Organization) => org.role === "ORG_ADMIN" || org.isOwner === true
      );
    }

    return false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (they handle their own auth)
     */
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
