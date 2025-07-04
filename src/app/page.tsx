'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import Typewriter from 'typewriter-effect';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };
    getUser();
  }, [supabase]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-4 overflow-hidden">
      <motion.header 
        className="absolute top-0 right-0 p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {!loading && (
          user ? (
            <Link href="/profile">
              <button className="px-6 py-2 text-lg font-semibold text-white bg-green-500/80 border border-green-400 rounded-lg shadow-lg hover:bg-green-600/80 transition-all glassmorphism">
                个人资料
              </button>
            </Link>
          ) : (
            <Link href="/auth">
              <button className="px-6 py-2 text-lg font-semibold text-white bg-indigo-500/80 border border-indigo-400 rounded-lg shadow-lg hover:bg-indigo-600/80 transition-all glassmorphism">
                登录 / 注册
              </button>
            </Link>
          )
        )}
      </motion.header>

      <main className="text-center">
        <motion.div 
          className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
          style={{ height: '200px' }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Typewriter
            onInit={(typewriter) => {
              typewriter
                .typeString('欢迎来到 <span style="color: #a78bfa;">Demo</span> 项目')
                .pauseFor(1500)
                .deleteAll()
                .typeString('一个基于 <strong style="color: #c084fc;">Next.js</strong> 的全栈应用')
                .pauseFor(1500)
                .typeString('<br/>使用 <strong style="color: #4ade80;">Supabase</strong> 进行数据存储')
                .pauseFor(1500)
                .typeString('<br/>并通过 <strong style="color: #facc15;">XX云</strong> 实现安全认证')
                .start();
            }}
            options={{
              delay: 75,
              loop: true,
              cursorClassName: 'text-pink-500',
            }}
          />
        </motion.div>
      </main>
    </div>
  );
}