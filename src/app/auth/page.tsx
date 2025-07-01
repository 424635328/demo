// app/auth/page.tsx
import { Suspense } from 'react';
import AuthForm from './AuthForm';

export default function AuthPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Suspense fallback={
        <div className="text-white text-2xl">加载中...</div>
      }>
        <AuthForm />
      </Suspense>
    </div>
  );
}