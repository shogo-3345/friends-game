// NextResponseをインポートしない
export const config = {
  matcher: '/(.*)',
};

export default function middleware(request) {
  const authorizationHeader = request.headers.get('authorization');

  try {
    if (authorizationHeader) {
      const basicAuth = authorizationHeader.split(' ')[1];
      if (basicAuth) {
        const [user, password] = atob(basicAuth).toString().split(':');
        if (
          user === process.env.BASIC_AUTH_USERNAME &&
          password === process.env.BASIC_AUTH_PASSWORD
        ) {
          // 認証成功時は何も返さない（次の処理に進む）
          return;
        }
      }
    }
  } catch (error) {
    console.error("Auth error:", error.message);
  }

  // 認証失敗時は401レスポンスを返す
  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}