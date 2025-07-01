// app/request-password-reset/page.tsx
'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

export default function RequestPasswordResetPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientComponentClient();

  const handleResetRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // 调用 Supabase 内置的密码重置方法
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // 用户点击邮件中的链接后，应该被重定向到我们即将创建的更新密码页面
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      setMessage(`发送失败: ${error.message}`);
    } else {
      setMessage('密码重置邮件已发送，请检查您的收件箱。');
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900">重置您的密码</h2>
        <p className="text-center text-gray-600">请输入您的邮箱地址，我们将向您发送重置密码的说明。</p>
        <form className="mt-8 space-y-6" onSubmit={handleResetRequest}>
          <div>
            <label htmlFor="email" className="sr-only">邮箱地址</label>
            <input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 text-lg border-gray-300 rounded-md" placeholder="邮箱地址" />
          </div>
          
          {message && (
            <p className={`text-center font-medium ${message.includes('失败') ? 'text-red-500' : 'text-green-500'}`}>
              {message}
            </p>
          )}

          <button type="submit" disabled={isLoading} className="w-full px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
            {isLoading ? '发送中...' : '发送重置邮件'}
          </button>
        </form>
        <div className="text-center">
            <Link href="/auth" className="font-medium text-indigo-600 hover:text-indigo-500">
              返回登录
            </Link>
        </div>
      </div>
    </div>
  );
}