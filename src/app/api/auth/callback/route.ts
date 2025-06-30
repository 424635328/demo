// app/api/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    console.log('[API/CALLBACK] Received auth code, exchanging for session.');
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    await supabase.auth.exchangeCodeForSession(code);
  }

  console.log('[API/CALLBACK] Redirecting to auth page with success message.');
  // 重定向到登录/注册页面，并带上一个查询参数提示用户
  return NextResponse.redirect(`${requestUrl.origin}/auth?message=验证成功！现在您可以登录了。`);
}