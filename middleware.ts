import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import {
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
  authRoutes,
  apiAuthPrefix,
} from "@/routes";
 
const { auth } = NextAuth(authConfig);
 
export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
 
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
 
  if (isApiAuthRoute || (isAuthRoute && !isLoggedIn)) {
    // No specific action required, but avoid returning null
    return new Response(null, { status: 204 }); // No Content
  }
 
  if (isPublicRoute && isLoggedIn) {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }
 
  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodeCallbackUrl = encodeURIComponent(callbackUrl);
    return Response.redirect(new URL(`/?callbackUrl=${encodeCallbackUrl}`, nextUrl));
  }
 
  // No specific action required, return a Response to comply with expected signature
  return new Response(null, { status: 204 }); // No Content
});
 
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
 