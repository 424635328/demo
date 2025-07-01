'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { KeyRound, Eye, EyeOff } from 'lucide-react';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  // 检查用户是否已通过邮件链接验证
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setMessage('验证成功，请设置您的新密码。');
      }
    });
    // 组件卸载时取消订阅
    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(`密码更新失败: ${error.message}`);
    } else {
      setMessage('密码更新成功！3秒后将跳转到登录页面...');
      setTimeout(() => {
        router.push('/auth');
      }, 3000);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <motion.div 
        className="w-full max-w-md p-8 space-y-6 rounded-2xl shadow-2xl glassmorphism text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <KeyRound className="mx-auto h-12 w-12 text-indigo-400" />
          <h2 className="mt-4 text-3xl font-bold">设置您的新密码</h2>
          <p className="mt-2 text-slate-400">为了您的账户安全，请设置一个强密码。</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleUpdatePassword}>
          <div className="relative">
            <Input 
              id="password" 
              name="password" 
              type={showPassword ? 'text' : 'password'} 
              required 
              minLength={6} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="输入新密码 (至少6位)" 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-200"
              aria-label={showPassword ? '隐藏密码' : '显示密码'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {message && <p className="text-center font-medium text-green-400">{message}</p>}
          {error && <p className="text-center font-medium text-red-400">{error}</p>}

          <Button type="submit" isLoading={isLoading} variant="primary">
            更新密码并登录
          </Button>
        </form>
      </motion.div>
    </div>
  );
}