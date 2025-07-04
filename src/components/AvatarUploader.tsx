// components/ui/AvatarUploader.tsx (优化后版本)
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { cropImageToSquare } from '@/lib/image-utils'; // 假设你放在 lib 目录下

// --- Props Interface ---
interface AvatarUploaderProps {
  initialImage?: string | null;
  onImageCropped: (blob: Blob) => void;
  onUploadRequested: () => void; // 保留此 prop，用于触发父组件的上传逻辑
  isUploading: boolean; // 父组件传入的“网络上传中”状态
  outputSize?: number;
  previewSize?: number;
}

// --- Component ---
export default function AvatarUploader({
  initialImage,
  onImageCropped,
  onUploadRequested,
  isUploading,
  outputSize = 200,
  previewSize = 128,
}: AvatarUploaderProps) {
  
  // --- State ---
  // isProcessing 用于表示“客户端图片裁剪中”的状态
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null | undefined>(initialImage);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 当外部的 initialImage 变化时，同步内部的 previewUrl
  useEffect(() => {
    setPreviewUrl(initialImage);
  }, [initialImage]);

  // --- Core Logic ---
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 重置状态
    setError(null);
    setIsProcessing(true);

    try {
      // 使用抽离的工具函数进行裁剪
      const croppedBlob = await cropImageToSquare(file, outputSize);
      
      // 更新预览图
      // 注意：之前的 previewUrl 需要在使用后手动释放，以防内存泄漏
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(croppedBlob));
      
      // 触发父组件的回调
      onImageCropped(croppedBlob);
      onUploadRequested();

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsProcessing(false);
      // 清空 input 的值，以便用户可以再次选择同一个文件
      if (e.target) e.target.value = '';
    }
  };

  

  const isLoading = isProcessing || isUploading;
  const buttonText = isProcessing ? '处理中...' : isUploading ? '上传中...' : '更换头像';

  // --- Render ---
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* 预览区域 */}
      <div 
        className="relative rounded-full overflow-hidden bg-slate-800" 
        style={{ width: previewSize, height: previewSize }}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Avatar Preview"
            width={previewSize}
            height={previewSize}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="text-slate-500" size={previewSize / 2} />
          </div>
        )}
        
        {/* 加载遮罩 */}
        {(isLoading) && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Loader2 className="animate-spin text-white" size={previewSize / 3} />
          </div>
        )}
      </div>

      {/* 上传触发器 (使用 label 提升无障碍) */}
      <input
        type="file"
        ref={fileInputRef}
        id="avatar-upload" // id 必须有，用于 label 的 htmlFor
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
        className="hidden"
        disabled={isLoading}
      />
      <label
        htmlFor="avatar-upload"
        className={`cursor-pointer text-sm inline-flex items-center gap-2 font-medium ${
          isLoading 
            ? 'text-slate-500 cursor-not-allowed' 
            : 'text-indigo-400 hover:text-indigo-300'
        }`}
      >
        <UploadCloud size={16} />
        {buttonText}
      </label>

      {/* 错误信息展示 */}
      {error && (
        <div className="text-xs text-red-400 flex items-center gap-1.5 mt-1">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}