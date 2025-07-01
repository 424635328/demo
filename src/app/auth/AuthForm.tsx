// app/auth/AuthForm.tsx

'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa'; // 确保已安装: npm install react-icons

export default function AuthForm() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
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
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });
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
      console.error(error); // Log the error for debugging
      setMessage('无法连接到服务器，请检查您的网络。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-900">
        {isLoginMode ? '登录您的账户' : '创建新账户'}
      </h2>
      
      <div className="space-y-4">
        <button
          onClick={handleGitHubLogin}
          disabled={isLoading}
          className="w-full flex justify-center items-center gap-2 px-6 py-3 text-lg font-semibold text-white bg-[#333] rounded-md hover:bg-[#444] transition-colors disabled:bg-gray-500"
        >
          <FaGithub />
          使用 GitHub 登录
        </button>
      </div>

      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-400">或使用邮箱</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleAuthAction}>
        {/* ... 表单内容 ... */}
        <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">邮箱地址</label>
              <input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 text-lg border-gray-300 rounded-md" placeholder="邮箱地址" />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">密码</label>
              <input id="password" name="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 text-lg border-gray-300 rounded-md" placeholder="密码 (至少6位)" />
            </div>
        </div>

        {/* 忘记密码链接 */}
        {isLoginMode && (
          <div className="flex items-center justify-end">
            <div className="text-sm">
              <Link href="/request-password-reset" className="font-medium text-indigo-600 hover:text-indigo-500">
                忘记密码?
              </Link>
            </div>
          </div>
        )}

        {message && (
            <p className={`text-center font-medium ${message.includes('失败') || message.includes('不正确') || message.includes('错误') ? 'text-red-500' : 'text-green-500'}`}>
              {message}
            </p>
        )}
        
        <button type="submit" disabled={isLoading} className="w-full px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
          {isLoading ? '处理中...' : (isLoginMode ? '登录' : '注册')}
        </button>
      </form>
      
      <div className="text-center">
        <button onClick={() => setIsLoginMode(!isLoginMode)} className="font-medium text-indigo-600 hover:text-indigo-500">
          {isLoginMode ? '还没有账户？去注册' : '已有账户？去登录'}
        </button>
      </div>
    </div>
  );
}