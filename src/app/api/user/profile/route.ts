// app/api/user/profile/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  // 1. 验证用户是否登录
  // 这是最重要的一步，确保只有登录用户才能更新自己的信息
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error('[API/PROFILE] Unauthorized attempt to update profile.');
    return NextResponse.json(
      { error: '您必须登录才能更新个人资料。' },
      { status: 401 }
    );
  }

  console.log(`[API/PROFILE] User ${user.email} is updating their profile.`);

  // 2. 获取请求中的新数据
  const { name, image } = await request.json();

  // 3. 使用 Supabase 更新用户信息
  // supabase.auth.updateUser 会更新 auth.users 表中的 user_metadata 字段
  const { data: updatedUser, error } = await supabase.auth.updateUser({
    data: { 
      name: name,
      image: image,
    }
  });

  if (error) {
    console.error('[API/PROFILE] Supabase update user error:', error.message);
    return NextResponse.json(
      { error: `更新失败: ${error.message}` },
      { status: 500 }
    );
  }

  console.log(`[API/PROFILE] Profile for ${user.email} updated successfully.`);
  // 4. 返回成功响应和更新后的用户信息
  return NextResponse.json(updatedUser);
}