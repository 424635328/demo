'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button'; // 引入自定义按钮
import Input from '../../components/ui/Input';   // 引入自定义输入框
import Link from 'next/link';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setName(user.user_metadata?.name || '');
        setImage(user.user_metadata?.image || '');
      } else {
        router.push('/auth');
      }
      setIsLoading(false);
    };
    getUser();
  }, [supabase, router]);

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage('');
    
    const response = await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, image }),
    });
    
    const data = await response.json();
    if (response.ok) {
      setMessage('个人资料更新成功！');
    } else {
      setMessage(`更新失败: ${data.error}`);
    }
    setIsUpdating(false);
  };
  
  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white text-2xl">
        加载个人资料中...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-4">
      <motion.div 
        className="w-full max-w-lg p-8 space-y-6 rounded-2xl shadow-2xl glassmorphism"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
            {/* 显示用户头像，如果没有则显示默认图标 */}
            <img 
              src={image || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.id}`} 
              alt="User Avatar"
              className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-indigo-400 p-1"
            />
            <h2 className="text-4xl font-bold">
              编辑个人资料
            </h2>
            <p className="text-slate-400 mt-2">欢迎, {user?.email}</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleUpdateProfile}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">姓名</label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="你的名字"
              />
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-slate-300 mb-1">头像 URL</label>
              <Input
                id="image"
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/avatar.png"
              />
            </div>
          </div>
          
          {message && (
            <p className={`text-center font-medium text-sm ${message.includes('失败') ? 'text-red-400' : 'text-green-400'}`}>
              {message}
            </p>
          )}

          <Button type="submit" isLoading={isUpdating} variant="primary">
            保存更改
          </Button>
        </form>

        <div className="border-t border-slate-700 pt-6 space-y-4">
            <Button onClick={handleLogout} isLoading={isLoggingOut} variant="danger">
              退出登录
            </Button>
            <Link href="/" className="block text-center font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
              返回主页
            </Link>
        </div>
      </motion.div>
    </div>
  );
}