'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { UploadCloud, ZoomIn, ZoomOut, Check, RefreshCcw } from 'lucide-react';

// --- Props Interface ---
interface AvatarUploaderProps {
  initialImage?: string;
  onImageCropped: (blob: Blob) => void;
  onUploadRequested: () => void;
  isLoading: boolean;
}

// --- Constants ---
const EDITOR_SIZE = 250; // 编辑器总尺寸
const CROP_SIZE = 200;   // 裁剪框的尺寸

// --- Component ---
export default function AvatarUploader({ 
  initialImage, 
  onImageCropped,
  onUploadRequested,
  isLoading
}: AvatarUploaderProps) {
  
  // --- State ---
  const [source, setSource] = useState<string | null>(null);
  // position现在代表图片左上角相对于编辑器左上角的偏移
  const [position, setPosition] = useState({ x: (EDITOR_SIZE - CROP_SIZE) / 2, y: (EDITOR_SIZE - CROP_SIZE) / 2 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  // --- Refs ---
  const imageRef = useRef<HTMLImageElement | null>(null);
  const editorRef = useRef<HTMLDivElement>(null); // Ref for the main editor div
  const dragStartPos = useRef({ x: 0, y: 0 });
  const imageStartPos = useRef({ x: 0, y: 0 });

  // --- Callbacks & Effects ---
  const resetState = useCallback(() => {
    if (!imageRef.current) return;
    // 重置时，让图片居中
    const initialScale = Math.max(EDITOR_SIZE / imageRef.current.width, EDITOR_SIZE / imageRef.current.height);
    setScale(initialScale);
    setPosition({
      x: (EDITOR_SIZE - imageRef.current.width * initialScale) / 2,
      y: (EDITOR_SIZE - imageRef.current.height * initialScale) / 2,
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setSource(reader.result as string));
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  useEffect(() => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    if (source) {
      image.src = source;
      image.onload = () => {
        imageRef.current = image;
        resetState(); // 当新图片加载后，自动居中和缩放
      };
    } else {
      // 如果是初始状态，加载 initialImage
      if (initialImage) {
        image.src = initialImage;
        image.onload = () => { imageRef.current = image; resetState(); };
      }
    }
  }, [source, initialImage, resetState]);

  // Event Handlers
  const onDragStart = (clientX: number, clientY: number) => {
    if (!imageRef.current) return;
    setIsDragging(true);
    dragStartPos.current = { x: clientX, y: clientY };
    imageStartPos.current = { ...position };
  };

  const onDragMove = (clientX: number, clientY: number) => {
    if (!isDragging || !imageRef.current) return;
    
    const dx = clientX - dragStartPos.current.x;
    const dy = clientY - dragStartPos.current.y;
    
    setPosition({
      x: imageStartPos.current.x + dx,
      y: imageStartPos.current.y + dy,
    });
  };

  const onDragEnd = () => setIsDragging(false);
  
  const handleConfirmCrop = () => {
    if (!imageRef.current) return;

    // 创建一个离屏 canvas 来进行裁剪
    const canvas = document.createElement('canvas');
    canvas.width = CROP_SIZE;
    canvas.height = CROP_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 裁剪框相对于整个编辑器是居中的
    const cropX_in_editor = (EDITOR_SIZE - CROP_SIZE) / 2;
    const cropY_in_editor = (EDITOR_SIZE - CROP_SIZE) / 2;
    // 计算图片需要被裁剪的部分的左上角坐标
    const sourceX = cropX_in_editor - position.x;
    const sourceY = cropY_in_editor - position.y;
    
    // 将图片的指定部分绘制到离屏canvas上
    ctx.drawImage(
      imageRef.current,
      sourceX / scale, // 源裁剪区的x
      sourceY / scale, // 源裁剪区的y
      CROP_SIZE / scale,  // 源裁剪区的宽度
      CROP_SIZE / scale,  // 源裁剪区的高度
      0,               // 目标canvas的x
      0,               // 目标canvas的y
      CROP_SIZE,          // 目标canvas的宽度
      CROP_SIZE           // 目标canvas的高度
    );

    canvas.toBlob((blob) => {
      if (blob) {
        onImageCropped(blob);
        onUploadRequested();
      }
    }, 'image/png', 0.95);
  };
  
  // --- Render ---
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* 编辑器容器，负责事件监听 */}
      <div
        ref={editorRef}
        className="relative bg-slate-900/50 cursor-grab active:cursor-grabbing"
        style={{ width: EDITOR_SIZE, height: EDITOR_SIZE, touchAction: 'none' }}
        onMouseDown={(e) => onDragStart(e.clientX, e.clientY)}
        onMouseMove={(e) => onDragMove(e.clientX, e.clientY)}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        onTouchStart={(e) => onDragStart(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => onDragMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={onDragEnd}
      >
        {/* 可拖拽和缩放的图片 */}
        {imageRef.current && (
          <img
            src={imageRef.current.src}
            alt="Avatar for cropping"
            className="pointer-events-none" // 让鼠标事件穿透图片，到达父级div
            style={{
              position: 'absolute',
              left: `${position.x}px`,
              top: `${position.y}px`,
              width: `${imageRef.current.width * scale}px`,
              height: `${imageRef.current.height * scale}px`,
            }}
          />
        )}
        {/* 覆盖在最上层的圆形裁剪框 (视觉效果) */}
        <div 
          className="absolute inset-0 pointer-events-none" // 不接收鼠标事件
          style={{
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
            width: CROP_SIZE,
            height: CROP_SIZE,
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        {!source && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 pointer-events-none">
            <UploadCloud size={48}/>
            <span className="mt-2 text-sm">选择一张图片</span>
          </div>
        )}
      </div>

      <input
        type="file"
        id="avatar-upload"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
      <label htmlFor="avatar-upload" className="cursor-pointer text-sm inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300">
        <UploadCloud size={16} />
        {source ? '更换图片' : '从电脑选择'}
      </label>

      {source && (
        <div className="w-full max-w-xs space-y-4">
          <div className="flex items-center justify-center gap-2">
            <ZoomOut size={20} />
            <input 
              type="range" 
              min="0.1" 
              max="3" 
              step="0.01" 
              value={scale} 
              onChange={(e) => setScale(parseFloat(e.target.value))} 
              className="w-full"
              aria-label="缩放头像"
            />
            <ZoomIn size={20} />
          </div>
          <div className="flex justify-center">
            <button onClick={resetState} className="text-xs inline-flex items-center gap-1 text-slate-400 hover:text-white">
              <RefreshCcw size={12}/> 重置
            </button>
          </div>
          <button 
            onClick={handleConfirmCrop}
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 px-4 py-2 text-md font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-800"
          >
            {isLoading ? "处理中..." : <><Check size={20} /> 确认并使用此头像</>}
          </button>
        </div>
      )}
    </div>
  );
}