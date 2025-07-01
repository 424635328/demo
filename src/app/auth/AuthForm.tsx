'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button'; // 使用自定义按钮
import Input from '../../components/ui/Input';   // 使用自定义输入框

export default function AuthForm() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const urlMessage = searchParams.get('message');
    if (urlMessage) {
      setMessage(urlMessage);
    }
  }, [searchParams]);

  const handleGitHubLogin = async () => {
    setIsGitHubLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  };

  const handleAuthAction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';
    
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
      const response = await fetch(endpoint, { method: 'POST', body: formData });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || '发生未知错误。');
      } else {
        if (!isLoginMode) {
          setMessage(data.message);
        } else {
          router.push('/');
        }
      }
    } catch (error) {
      console.error(error);
      setMessage('无法连接到服务器，请检查您的网络。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="w-full max-w-md p-8 space-y-6 rounded-2xl shadow-2xl glassmorphism text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-bold text-center">
        {isLoginMode ? '欢迎回来' : '加入我们'}
      </h2>
      
      <div className="space-y-4">
        <Button
          onClick={handleGitHubLogin}
          isLoading={isGitHubLoading}
          variant="secondary"
        >
          <FaGithub size={24} />
          使用 GitHub 登录
        </Button>
      </div>

      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-slate-700"></div>
        <span className="flex-shrink mx-4 text-slate-400">或使用邮箱</span>
        <div className="flex-grow border-t border-slate-700"></div>
      </div>

      <form className="space-y-6" onSubmit={handleAuthAction}>
        <div className="space-y-4">
          <Input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="邮箱地址" />
          <Input id="password" name="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="密码 (至少6位)" />
        </div>

        {isLoginMode && (
          <div className="flex items-center justify-end">
            <Link href="/request-password-reset" className="text-sm font-medium text-indigo-400 hover:text-indigo-300">
              忘记密码?
            </Link>
          </div>
        )}

        {message && (
          <p className={`text-center font-medium ${message.includes('失败') || message.includes('不正确') || message.includes('错误') ? 'text-red-400' : 'text-green-400'}`}>
            {message}
          </p>
        )}
        
        <Button type="submit" isLoading={isLoading} variant="primary">
          {isLoginMode ? '登录' : '注册'}
        </Button>
      </form>
      
      <div className="text-center">
        <button onClick={() => setIsLoginMode(!isLoginMode)} className="font-medium text-indigo-400 hover:text-indigo-300">
          {isLoginMode ? '还没有账户？去注册' : '已有账户？去登录'}
        </button>
      </div>
    </motion.div>
  );
}