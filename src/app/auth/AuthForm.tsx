'use client'; // 声明这是一个客户端组件

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthForm() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams(); // 这个Hook现在被安全地用在客户端组件里

  // 这个 effect 依赖 searchParams，所以也必须在客户端组件里
  useEffect(() => {
    const urlMessage = searchParams.get('message');
    if (urlMessage) {
      setMessage(urlMessage);
    }
  }, [searchParams]);

  const handleAuthAction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    console.log(`[PAGE/AUTH] Attempting to ${isLoginMode ? 'Login' : 'Register'} with email: ${email}`);

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
        console.error(`[PAGE/AUTH] API Error: ${data.error}`);
        setMessage(data.error || '发生未知错误。');
      } else {
        if (!isLoginMode) {
          console.log('[PAGE/AUTH] Registration successful, showing message.');
          setMessage(data.message);
        } else {
          console.log('[PAGE/AUTH] Login successful, redirecting to home.');
          router.push('/');
        }
      }
    } catch (error) {
      console.error('[PAGE/AUTH] Fetch Error:', error);
      setMessage('无法连接到服务器，请检查您的网络。');
    } finally {
      setIsLoading(false);
    }
  };

  // 返回完整的表单JSX
  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-900">
        {isLoginMode ? '登录您的账户' : '创建新账户'}
      </h2>
      <form className="mt-8 space-y-6" onSubmit={handleAuthAction}>
        {/* ... 把你所有的 input, button, message 的 JSX 都放在这里 ... */}
         <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">邮箱地址</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-lg border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="邮箱地址"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">密码</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-lg border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="密码 (至少6位)"
              />
            </div>
          </div>
          {message && (
            <p className={`text-center font-medium ${message.includes('错误') || message.includes('不正确') ? 'text-red-500' : 'text-green-500'}`}>
              {message}
            </p>
          )}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
            >
              {isLoading ? '处理中...' : (isLoginMode ? '登录' : '注册')}
            </button>
          </div>
      </form>
      <div className="text-center">
        <button
          onClick={() => setIsLoginMode(!isLoginMode)}
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          {isLoginMode ? '还没有账户？去注册' : '已有账户？去登录'}
        </button>
      </div>
    </div>
  );
}