// app/update-password/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  // 当用户从邮件链接进入时，Supabase的JS库会自动处理URL中的token，
  // 并在后续的API调用中附上这个凭证。
  // 我们可以在页面加载时检查用户是否已经通过链接验证。
  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // 这个事件表示用户已经通过邮件链接成功进入了密码恢复模式
        setMessage('您可以设置新密码了。');
      }
    });
  }, [supabase]);

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // 调用 Supabase 内置的 updateUser 方法来更新密码
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage(`密码更新失败: ${error.message}`);
    } else {
      setMessage('密码更新成功！正在跳转到登录页面...');
      setTimeout(() => {
        router.push('/auth');
      }, 3000);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900">设置您的新密码</h2>
        <form className="mt-8 space-y-6" onSubmit={handleUpdatePassword}>
          <div>
            <label htmlFor="password" className="sr-only">新密码</label>
            <input id="password" name="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 text-lg border-gray-300 rounded-md" placeholder="输入新密码 (至少6位)" />
          </div>

          {message && (
            <p className={`text-center font-medium ${message.includes('失败') ? 'text-red-500' : 'text-green-500'}`}>
              {message}
            </p>
          )}

          <button type="submit" disabled={isLoading} className="w-full px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
            {isLoading ? '更新中...' : '更新密码'}
          </button>
        </form>
      </div>
    </div>
  );
}