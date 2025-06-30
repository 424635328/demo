// app/api/auth/register/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  
  console.log('[API/REGISTER] Received registration request for:', email);

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  // 使用 Supabase Auth 的 signUp 方法
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // 这个URL是用户点击邮件中的验证链接后被重定向的地方
      emailRedirectTo: `${requestUrl.origin}/api/auth/callback`,
    },
  });

  if (error) {
    console.error('[API/REGISTER] Supabase signup error:', error.message);
    return NextResponse.json(
      { error: `Could not authenticate user: ${error.message}` },
      { status: 400 }
    );
  }

  console.log('[API/REGISTER] User created. Verification email sent to:', email);
  return NextResponse.json({
    message: 'Check your email to continue signing up.',
  });
}