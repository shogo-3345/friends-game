import { NextResponse } from 'next/server';

export const config = {
  matcher: '/(.*)', // すべてのパスを対象にする
};

export default function middleware(request) {
  const authorizationHeader = request.headers.get("authorization");

  if (authorizationHeader) {
    const basicAuth = authorizationHeader.split(" ")[1];
    const [user, password] = atob(basicAuth).toString().split(":");

    // 環境変数の値と一致するかチェック
    if (
      user === process.env.BASIC_AUTH_USER &&
      password === process.env.BASIC_AUTH_PASSWORD
    ) {
      // 認証成功時は次の処理へ進める
      return NextResponse.next();
    }
  }

  // 認証失敗時は401エラーと認証ダイアログを表示するヘッダーを返す
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  });
}