// import { NextResponse } from 'next/server';
// // import { verifyToken } from './app/lib/auth';

// export async function middleware(request) {
//   // Skip auth for login and register routes
//   if (request.nextUrl.pathname.startsWith('/api/auth')) {
//     return NextResponse.next();
//   }
  
//   try {
//     const authHeader = request.headers.get('authorization');
    
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return NextResponse.json(
//         { error: 'Authentication token missing' },
//         { status: 401 }
//       );
//     }
    
//     const token = authHeader.substring(7);
//     verifyToken(token);
    
//     return NextResponse.next();
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Invalid or expired token' },
//       { status: 401 }
//     );
//   }
// }

// export const config = {
//   matcher: '/api/:path*',
// };



import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Skip auth for these public routes
  const publicRoutes = [
    '/api/health',
    '/api/register',
    '/api/login',
    '/api/auth',
    '/api/students',
  ];
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // For protected routes, require authentication
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Authentication token missing. Please login first.' },
      { status: 401 }
    );
  }
  
  // Basic token validation (you can enhance this later)
  const token = authHeader.substring(7);
  if (!token || token.length < 10) {
    return NextResponse.json(
      { error: 'Invalid token format' },
      { status: 401 }
    );
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};