// middleware.js
export function middleware(request) {
  const auth = request.headers.get('authorization');

  // ここでユーザー名とパスワードを設定
  const username = process.env.BASIC_AUTH_USERNAME || 'badminton44';
  const password = process.env.BASIC_AUTH_PASSWORD || '267499ssyt';
  const basicAuth = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

  if (auth !== basicAuth) {
    return new Response('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Protected Area"',
      },
    });
  }

  return Response.next();
}
