import { NextResponse } from 'next/server';

export const config = {
  matcher: '/(.*)',
};

export default function middleware(request) {
  const authorizationHeader = request.headers.get('authorization');

  try {
    if (authorizationHeader) {
      const basicAuth = authorizationHeader.split(' ')[1];
      // atob()が失敗する可能性も考慮し、チェックを強化
      if (!basicAuth) {
        throw new Error('Invalid basic auth header');
      }
      const [user, password] = atob(basicAuth).toString().split(':');

      if (
        user === process.env.BASIC_AUTH_USER &&
        password === process.env.BASIC_AUTH_PASSWORD
      ) {
        return NextResponse.next();
      }
    }
  } catch (error) {
    console.error("Auth error:", error.message);
  }

  // 認証に失敗した場合、またはヘッダーが無効な場合は認証を要求
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}