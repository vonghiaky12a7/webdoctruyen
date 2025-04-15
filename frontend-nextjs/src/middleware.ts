import { NextRequest, NextResponse } from "next/server";


const protectedRoutes = [
  { path: "/admin", allowedRoles: [1] },
  { path: "/profile", allowedRoles: [1, 3] },
];
const authRoutes = ["/auth/signin", "/auth/register"];

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("access_token")?.value;
  const roleId = request.cookies.get("role_id")?.value;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route.path)
  );
  const isAuthRoute = authRoutes.includes(pathname);

  // Không có token
  if (!token) {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
    return NextResponse.next();
  }

  // Có token
  if (isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Kiểm tra role cho protected route
  if (isProtectedRoute) {
    const protectedRoute = protectedRoutes.find((route) =>
      pathname.startsWith(route.path)
    );
    // Chuyển roleId thành số để so sánh
    const userRoleId = roleId ? parseInt(roleId) : null;
    if (
      protectedRoute &&
      (!userRoleId || !protectedRoute.allowedRoles.includes(userRoleId))
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Allow access if none of the above conditions are met
  return NextResponse.next();
}


export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/auth/signin",
    "/auth/register",
  ],
};
