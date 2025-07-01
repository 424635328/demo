'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react'; // 使用 lucide-react 图标库: npm install lucide-react

export default function RequestPasswordResetPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientComponentClient();

  const handleResetRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      setError(`发送失败: ${error.message}`);
    } else {
      setIsSubmitted(true); // 标记为已提交，用于切换UI状态
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
        {isSubmitted ? (
          // 状态二：提交成功后的界面
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <CheckCircle className="mx-auto h-16 w-16 text-green-400" />
            </motion.div>
            <h2 className="text-3xl font-bold">检查您的收件箱</h2>
            <p className="text-slate-300">
              我们已经向 <strong className="text-indigo-400">{email}</strong> 发送了一封包含重置密码链接的邮件。
            </p>
            <p className="text-sm text-slate-400">
              没有收到邮件？请检查您的垃圾邮件文件夹，或尝试 <button onClick={() => setIsSubmitted(false)} className="text-indigo-400 hover:underline">重新发送</button>。
            </p>
          </div>
        ) : (
          // 状态一：初始表单界面
          <>
            <div className="text-center">
              <Mail className="mx-auto h-12 w-12 text-indigo-400" />
              <h2 className="mt-4 text-3xl font-bold">重置您的密码</h2>
              <p className="mt-2 text-slate-400">别担心，这种事时有发生。请输入您的邮箱地址，我们会帮您找回账户。</p>
            </div>
            
            <form className="space-y-6" onSubmit={handleResetRequest}>
              <div className="relative">
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="邮箱地址" 
                />
              </div>
              
              {error && <p className="text-center font-medium text-red-400">{error}</p>}

              <Button type="submit" isLoading={isLoading} variant="primary">
                发送重置邮件
              </Button>
            </form>
            
            <div className="text-center">
                <Link href="/auth" className="inline-flex items-center gap-2 font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                  <ArrowLeft size={16} />
                  返回登录
                </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}