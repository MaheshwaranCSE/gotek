import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { Role } from "@/lib/roles";

const roleOrder: Record<Role, number> = {
  [Role.TEACHER]: 1,
  [Role.ADMIN]: 2,
  [Role.SUPERADMIN]: 3,
};

type ProtectedRoute = {
  pattern: RegExp;
  minRole: Role;
};

const protectedRoutes: ProtectedRoute[] = [
  { pattern: /^\/dashboard\/teacher(\/.*)?$/, minRole: Role.TEACHER },
  { pattern: /^\/dashboard\/admin(\/.*)?$/, minRole: Role.ADMIN },
  { pattern: /^\/dashboard\/super-admin(\/.*)?$/, minRole: Role.SUPERADMIN },
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const match = protectedRoutes.find((route) => route.pattern.test(pathname));

  if (!match) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request });

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const userRole = token.role as Role | undefined;

  if (!userRole || roleOrder[userRole] < roleOrder[match.minRole]) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

