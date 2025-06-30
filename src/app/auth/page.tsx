import { Suspense } from 'react';
import AuthForm from './AuthForm'; // 导入我们刚创建的组件

// 这个页面现在是纯服务端组件，不包含任何客户端hooks
export default function AuthPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Suspense fallback={<div className="text-center">加载中...</div>}>
        <AuthForm />
      </Suspense>
    </div>
  );
}