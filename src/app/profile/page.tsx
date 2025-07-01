// src/app/profile/page.tsx

'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import AvatarUploader from '../../components/AvatarUploader'; // 导入我们自己创建的上传组件

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [message, setMessage] = useState('');
  
  // Profile state
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  // State for the new avatar blob from our custom uploader
  const [croppedAvatarBlob, setCroppedAvatarBlob] = useState<Blob | null>(null);

  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const metadata = user.user_metadata;
        setName(metadata?.name || '');
        // Set a default avatar if none exists
        setAvatarUrl(metadata?.image || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.id}`);
        setBio(metadata?.bio || '');
        setWebsite(metadata?.website || '');
      } else {
        router.push('/auth');
      }
      setIsLoading(false);
    };
    getUser();
  }, [supabase, router]);
  
  // Function to upload the avatar blob to Supabase Storage
  const uploadAvatar = async (blob: Blob): Promise<string> => {
    if (!user) throw new Error("用户未登录，无法上传头像。");
    
    // Create a unique file path for the avatar
    const filePath = `${user.id}/avatar-${Date.now()}.png`;
    
    // Upload the file to the 'avatars' bucket
    const { data, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, blob, {
        cacheControl: '3600',
        upsert: true, // Overwrite if a file with the same name exists
      });

    if (uploadError) {
      throw new Error(`头像上传失败: ${uploadError.message}`);
    }

    // Get the public URL of the uploaded file
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(data.path);
    return publicUrl;
  };

  // Main function to handle the profile update form submission
  const handleUpdateProfile = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault(); // Prevent default form submission if triggered by form
    setIsUpdating(true);
    setMessage('');

    try {
      let finalAvatarUrl = avatarUrl;
      
      // If a new avatar has been cropped, upload it first
      if (croppedAvatarBlob) {
        setMessage('正在上传新头像...');
        finalAvatarUrl = await uploadAvatar(croppedAvatarBlob);
      }
      
      setMessage('正在更新个人资料...');
      // Update user metadata in Supabase Auth
      const { error } = await supabase.auth.updateUser({
        data: { 
          name, 
          image: finalAvatarUrl, 
          bio, 
          website 
        },
      });

      if (error) throw error;
      
      // Update the UI state after successful update
      setAvatarUrl(finalAvatarUrl);
      setCroppedAvatarBlob(null); // Clear the blob state
      setMessage('个人资料更新成功！');

    } catch (error: unknown) {
      setMessage(`更新失败: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Logout handler
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
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-4 py-12">
      <motion.div 
        className="w-full max-w-2xl p-8 space-y-8 rounded-2xl shadow-2xl glassmorphism"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <h2 className="text-4xl font-bold">编辑个人资料</h2>
          <p className="text-slate-400 mt-2">让你的主页更具个性！</p>
        </div>
        
        {/* The new AvatarUploader component */}
        <AvatarUploader 
          initialImage={avatarUrl}
          onImageCropped={(blob) => setCroppedAvatarBlob(blob)}
          onUploadRequested={() => handleUpdateProfile()} // Trigger the main form submission logic
          isLoading={isUpdating}
        />

        {/* The main form for other profile details */}
        <form id="update-profile-form" className="space-y-6" onSubmit={handleUpdateProfile}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">姓名</label>
              <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="你的名字或昵称" />
            </div>
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-slate-300 mb-1">个人网站</label>
              <Input id="website" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-slate-300 mb-1">个人简介</label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 text-lg bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                placeholder="介绍一下自己..."
              />
            </div>
          </div>
          
          {message && <p className={`text-center font-medium text-sm ${message.includes('失败') ? 'text-red-400' : 'text-green-400'}`}>{message}</p>}

          <Button type="submit" isLoading={isUpdating} variant="primary">保存所有更改</Button>
        </form>

        <div className="border-t border-slate-700 pt-6 space-y-4">
            <Button onClick={handleLogout} isLoading={isLoggingOut} variant="danger">退出登录</Button>
            <Link href="/" className="block text-center font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
              返回主页
            </Link>
        </div>
      </motion.div>
    </div>
  );
}