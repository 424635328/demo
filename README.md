# Demo

这是一个基于 Next.js 和 Supabase 构建的、功能完备且设计现代的 Web 应用。项目从零开始，实现了一个包含多种认证方式、安全密码重置和个人资料管理的全流程用户系统。

**线上访问地址**: [https://demo-noob.vercel.app/](https://demo-noob.vercel.app/)

## ✨ 项目亮点

*   **现代化的UI/UX**: 采用深色模式，搭配玻璃质感 (Glassmorphism) 和流畅的 `framer-motion` 动画，提供了卓越的用户视觉和交互体验。
*   **复合认证系统**: 支持传统的**邮箱/密码**认证，并集成了**GitHub OAuth**第三方登录，为用户提供灵活的选择。
*   **全功能安全流程**: 实现了完整的**密码重置**流程，包括邮件发送、链接验证和新密码设置，确保用户在忘记密码时能安全地找回账户。
*   **组件化设计**: 构建了可复用的 `Button` 和 `Input` UI组件，统一了应用风格并提高了开发效率。
*   **前沿技术栈**: 使用业界推荐的 **Next.js App Router**、**Tailwind CSS** 和 **TypeScript**，保证了项目的可维护性和扩展性。
*   **Serverless 架构**: 部署在 **Vercel**，利用 **Supabase** 作为后端，实现了高可用、高弹性的无服务器架构。

---

## 🛠️ 技术栈 (Tech Stack)

*   **框架**: [Next.js](https://nextjs.org/) (使用 App Router)
*   **语言**: [TypeScript](https://www.typescriptlang.org/)
*   **样式与动画**:
    *   [Tailwind CSS](https://tailwindcss.com/): 用于快速构建 UI。
    *   [Framer Motion](https://www.framer.com/motion/): 用于实现流畅的页面和组件动画。
*   **后端 & 数据库**: [Supabase](https://supabase.com/)
    *   **认证**: Supabase Auth (Email/Password, OAuth)
    *   **数据库**: Supabase Postgres
*   **邮件服务**: [阿里云邮件推送](https://www.aliyun.com/product/directmail) (通过 Supabase SMTP 集成)
*   **部署平台**: [Vercel](https://vercel.com/)
*   **核心库**:
    *   `@supabase/ssr` (已升级): 用于在 Next.js 服务端和客户端安全地处理认证。
    *   `typewriter-effect`: 实现主页的流式打字机效果。
    *   `react-icons` / `lucide-react`: 提供丰富的图标库，增强UI表达能力。

---

## 📂 项目目录结构

项目结构清晰，遵循 Next.js App Router 的最佳实践。

```bash
/
├── app/                      # App Router 核心目录
│   ├── api/                  # 后端 API 路由
│   │   ├── auth/
│   │   │   ├── callback/     # 处理 OAuth 和邮件验证回调
│   │   │   ├── login/        # 处理邮箱密码登录
│   │   │   └── register/     # 处理邮箱密码注册
│   │   └── user/
│   │       └── profile/      # 处理用户资料更新
│   │
│   ├── auth/                 # 登录/注册页面
│   │   ├── AuthForm.tsx      # (核心) 认证表单组件
│   │   └── page.tsx          # 页面入口 (使用 Suspense)
│   │
│   ├── profile/              # 个人资料页面
│   │   └── page.tsx
│   │
│   ├── request-password-reset/ # 请求密码重置页面
│   │   └── page.tsx
│   │
│   ├── update-password/      # 更新密码页面
│   │   └── page.tsx
│   │
│   ├── layout.tsx            # 全局根布局 (定义字体和背景)
│   └── page.tsx              # 网站主页
│
├── components/               # 可复用组件目录
│   └── ui/
│       ├── Button.tsx        # 自定义按钮组件 (含加载状态)
│       └── Input.tsx         # 自定义输入框组件
│
├── .env.local                # 本地环境变量 (!!!不提交到Git)
├── package.json              # 项目依赖和脚本
└── README.md                 # 就是你正在看的这个文件
```

---

## 🚀 构建与部署

*   **本地开发**:
    1.  克隆仓库: `git clone https://github.com/424635328/demo.git`
    2.  安装依赖: `npm install`
    3.  **配置 Supabase**:
        *   在 Supabase 后台开启 **GitHub** 作为 OAuth Provider，并填入 GitHub 提供的 Client ID 和 Secret。
        *   配置自定义 SMTP (如阿里云邮件推送)，用于发送验证和重置邮件。
    4.  **配置本地环境**: 创建 `.env.local` 文件并填入 Supabase 的 URL/Key 和 GitHub 的 Client ID/Secret。
    5.  启动开发服务器: `npm run dev`

*   **生产部署**:
    1.  项目已通过 Git 与 Vercel 平台连接，实现自动化 CI/CD。
    2.  任何推送到 `main` 分支的提交都会触发新的构建和部署。
    3.  所有生产所需的环境变量（Supabase Keys, GitHub Secrets, Site URL）均已在 Vercel 项目仪表盘中安全配置。

---

## 现状与功能 (已扩展)

项目已成功实现一个功能丰富、体验流畅的完整用户认证系统：

*   ✅ **多方式注册/登录**:
    *   支持传统的**邮箱 + 密码**方式。
    *   支持通过 **GitHub**进行 OAuth 第三方一键登录。
*   ✅ **完整的邮件流程**:
    *   新用户注册后会收到**验证邮件**。
    *   用户可以请求**密码重置**，并通过邮件链接设置新密码。
*   ✅ **安全的密码管理**:
    *   实现了“忘记密码”的完整流程。
    *   更新密码页面包含“显示/隐藏密码”功能，提升用户体验。
*   ✅ **个人资料管理**:
    *   登录用户可以进入个人资料页，查看并更新自己的姓名和头像。
    *   为没有头像的用户提供一个基于其ID生成的像素风默认头像。
*   ✅ **动态UI/UX**:
    *   首页能根据登录状态动态显示不同的入口按钮。
    *   所有表单和按钮都包含明确的加载状态，防止用户重复提交。
    *   通过动画和清晰的UI状态切换，为用户提供流畅、直观的交互反馈。

---

## 🌟 未来发展方向

本项目作为一个坚实的基础，可以向多个有趣的方向扩展：

### 方向一：内容发布平台 (博客或论坛)
*   **功能**: 创建 `Post` 和 `Comment` 数据表，开发富文本编辑器 (Tiptap)，实现文章的增删改查和评论功能。
*   **技术挑战**: 数据分页，权限控制 (RLS)，富文本内容的安全处理。

### 方向二：图片上传与展示 (图片墙或相册)
*   **功能**: 集成 **Supabase Storage**，将个人资料头像改为文件上传，开发图片上传和相册管理功能。
*   **技术挑战**: 文件上传处理，图片优化与CDN分发，存储空间的权限策略。

### 方向三：社交功能与实时互动
*   **功能**: 实现用户“关注”关系，构建动态 Feed 流，并利用 **Supabase Realtime** 实现实时通知或聊天。
*   **技术挑战**: 复杂的数据库关系设计，Feed 流性能优化，WebSocket 管理。

### 方向四：SaaS 应用基础 (提供付费服务)
*   **功能**: 集成 **Stripe** 等支付网关，创建订阅方案，并根据用户订阅状态实现功能限制。
*   **技术挑战**: 处理支付回调 (Webhooks)，管理订阅生命周期，设计灵活的权限系统。