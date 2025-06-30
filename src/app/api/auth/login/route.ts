// app/api/auth/login/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  
  console.log('[API/LOGIN] Received login request for:', email);

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('[API/LOGIN] Supabase signin error:', error.message);
    // 提供更友好的错误提示
    if (error.message.includes('Invalid login credentials')) {
      return NextResponse.json(
        { error: '邮箱或密码不正确，请重试。' },
        { status: 400 }
      );
    }
    if (error.message.includes('Email not confirmed')) {
      return NextResponse.json(
        { error: '您的邮箱尚未验证，请检查您的收件箱。' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: '登录失败，请稍后再试。' },
      { status: 500 }
    );
  }

  console.log('[API/LOGIN] Login successful for:', email);
  // 登录成功后，让前端重定向
  return NextResponse.json({ message: 'Login successful' });
}