// app/profile/page.tsx
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  const supabase = createClientComponentClient();
  const router = useRouter();

  // 页面加载时，获取当前用户信息
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log('[PAGE/PROFILE] User found:', user);
        setUser(user);
        // user_metadata 可能不存在，需要安全访问
        setName(user.user_metadata?.name || ''); 
        setImage(user.user_metadata?.image || '');
      } else {
        console.log('[PAGE/PROFILE] No user found, redirecting to auth.');
        router.push('/auth');
      }
      setIsLoading(false);
    };
    getUser();
  }, [supabase, router]);

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    console.log('[PAGE/PROFILE] Submitting profile update...');

    const response = await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, image }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('[PAGE/PROFILE] Update successful.');
      setMessage('个人资料更新成功！');
    } else {
      console.error('[PAGE/PROFILE] Update failed:', data.error);
      setMessage(`更新失败: ${data.error}`);
    }
    setIsLoading(false);
  };
  
  const handleLogout = async () => {
    console.log('[PAGE/PROFILE] Logging out...');
    await supabase.auth.signOut();
    router.push('/');
    router.refresh(); // 强制刷新以清除任何缓存的用户状态
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">加载中...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          编辑个人资料
        </h2>
        <p className="text-center text-gray-600">欢迎, {user?.email}</p>
        <form className="mt-8 space-y-6" onSubmit={handleUpdateProfile}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">姓名</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 mt-1 text-lg border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="你的名字"
              />
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">头像 URL</label>
              <input
                id="image"
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-4 py-3 mt-1 text-lg border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://example.com/avatar.png"
              />
            </div>
          </div>
          
          {message && (
            <p className={`text-center font-medium ${message.includes('失败') ? 'text-red-500' : 'text-green-500'}`}>
              {message}
            </p>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
            >
              {isLoading ? '保存中...' : '保存更改'}
            </button>
          </div>
        </form>
        <div className="text-center border-t pt-6">
            <button
              onClick={handleLogout}
              className="font-medium text-red-600 hover:text-red-500"
            >
              退出登录
            </button>
        </div>
      </div>
    </div>
  );
}