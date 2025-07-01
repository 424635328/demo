// components/ui/Input.tsx
import React from 'react';

// 使用 React.forwardRef 来允许父组件引用这个 input 元素
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`w-full px-4 py-3 text-lg bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${className}`}
      {...props}
    />
  );
});

Input.displayName = 'Input'; // for better debugging

export default Input;