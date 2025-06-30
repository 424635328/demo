// app/page.tsx
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Typewriter from 'typewriter-effect';

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
      console.log('[PAGE/HOME] Current user state:', user ? user.email : 'Not logged in');
    };
    getUser();
  }, [supabase]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <header className="absolute top-0 right-0 p-6">
        {!loading && (
          user ? (
            <Link href="/profile">
              <button className="px-6 py-2 text-lg font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors">
                个人资料
              </button>
            </Link>
          ) : (
            <Link href="/auth">
              <button className="px-6 py-2 text-lg font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors">
                登录 / 注册
              </button>
            </Link>
          )
        )}
      </header>

      <main className="text-center">
        <div className="text-4xl md:text-6xl font-bold text-gray-100" style={{ height: '150px' }}>
           {/* Typewriter component remains the same */}
           <Typewriter
            onInit={(typewriter) => {
              console.log('[TYPEWRITER] Initializing effect.');
              typewriter
                .typeString('欢迎来到 <strong style="color: #4f46e5;">Demo</strong> 项目。')
                .pauseFor(1000)
                .deleteAll()
                .typeString('这是一个基于 <strong style="color: #6366f1;">Next.js</strong> 的全栈应用。')
                .pauseFor(1000)
                .typeString('<br/>使用 <strong style="color: #34d399;">Supabase</strong> 进行数据存储。')
                .pauseFor(1000)
                .typeString('<br/>并通过 <strong style="color: #fbbf24;">阿里云</strong> 实现邮件验证。')
                .start();
            }}
            options={{
              delay: 75,
              loop: true,
              cursor: '', // 隐藏光标
            }}
          />
        </div>
      </main>
    </div>
  );
}