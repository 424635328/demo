// app/api/auth/callback/route.ts

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 这是一个 GET 请求处理器，因为用户是通过浏览器重定向访问这个URL的
export async function GET(request: NextRequest) {
  // 获取当前请求的URL
  const requestUrl = new URL(request.url);
  // 从URL的查询参数中获取 'code'，这是 GitHub 成功授权后返回的
  const code = requestUrl.searchParams.get('code');

  console.log('[API/CALLBACK] Received auth callback with code:', code ? 'Yes' : 'No');

  if (code) {
    // 如果有 code，就用它来换取一个 session
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // exchangeCodeForSession 会处理 code，验证它，
    // 获取用户信息，并自动将 session 信息写入 cookie
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('[API/CALLBACK] Error exchanging code for session:', error.message);
      // 如果交换失败，重定向到认证页面并显示错误
      return NextResponse.redirect(`${requestUrl.origin}/auth?message=认证失败，请重试。`);
    }
  }

  // 无论交换是否成功，或者一开始就没有 code (例如，用户直接访问这个URL)，
  // 都将用户重定向到主页。
  // 此时，如果交换成功，cookie 中已经有了 session，主页会显示登录状态。
  // 如果失败，主页会显示未登录状态。
  console.log('[API/CALLBACK] Redirecting to homepage.');
  return NextResponse.redirect(requestUrl.origin);
}