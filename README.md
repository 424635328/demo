# Demo - 全栈认证与个人资料管理系统

这是一个基于 Next.js 和 Supabase 构建的全栈 Web 应用。项目从零开始，实现了一个完整的用户认证流程，包括邮箱注册、邮件验证、登录以及登录后的个人资料更新功能。

**线上访问地址**: [https://demo-noob.vercel.app/](https://demo-noob.vercel.app/)

## ✨ 项目亮点

* **现代技术栈**: 采用业界推荐的 Next.js App Router、Tailwind CSS 和 TypeScript 构建。
* **全栈实现**: 包含前端交互界面和后端 API 逻辑，是一个完整的端到端项目。
* **安全认证**: 集成 Supabase Auth 实现安全可靠的用户注册和登录，并通过自定义 SMTP (阿里云邮件推送) 实现专业的邮件验证。
* **无服务器架构**: 部署在 Vercel 平台，所有后端 API 均以 Serverless Functions 形式运行，具备高可用性和弹性伸缩能力。
* **出色的开发者体验**: 详细的 `console.log` 调试信息，清晰的代码结构和环境变量配置。

---

## 🛠️ 技术栈 (Tech Stack)

* **框架**: [Next.js](https://nextjs.org/) (使用 App Router)
* **语言**: [TypeScript](https://www.typescriptlang.org/)
* **样式**: [Tailwind CSS](https://tailwindcss.com/)
* **后端 & 数据库**: [Supabase](https://supabase.com/)
  * **认证**: Supabase Auth
  * **数据库**: Supabase Postgres
* **邮件服务**: [阿里云邮件推送](https://www.aliyun.com/product/directmail) (通过 Supabase SMTP 集成)
* **部署平台**: [Vercel](https://vercel.com/)
* **核心库**:
  * `@supabase/ssr`: 用于在 Next.js 服务端和客户端安全地处理认证。
  * `typewriter-effect`: 实现主页的流式打字机效果。

---

## 📂 项目目录结构

本项目采用 Next.js App Router 的推荐结构。

```bash
/
├── app/                      # App Router 核心目录
│   ├── api/                  # 后端 API 路由
│   │   ├── auth/
│   │   │   ├── callback/     # 处理邮件验证回调
│   │   │   │   └── route.ts
│   │   │   ├── login/        # 处理登录请求
│   │   │   │   └── route.ts
│   │   │   └── register/     # 处理注册请求
│   │   │       └── route.ts
│   │   └── user/
│   │       └── profile/      # 处理用户资料更新
│   │           └── route.ts
│   │
│   ├── auth/                 # 登录/注册页面
│   │   ├── AuthForm.tsx      # 认证表单(客户端组件)
│   │   └── page.tsx          # 页面入口(服务端组件, 使用Suspense)
│   │
│   ├── profile/              # 个人资料页面
│   │   └── page.tsx
│   │
│   ├── layout.tsx            # 全局根布局
│   └── page.tsx              # 网站主页
│
├── public/                   # 静态资源 (图片, 字体等)
│
├── .env.local                # 本地环境变量 (!!!不提交到Git)
├── next.config.mjs           # Next.js 配置文件
├── package.json              # 项目依赖和脚本
└── README.md                 # 就是你正在看的这个文件
```

---

## 🚀 构建与部署

* **本地开发**:
    1. 克隆仓库: `git clone https://github.com/424635328/demo.git`
    2. 安装依赖: `npm install`
    3. 配置本地环境: 创建 `.env.local` 文件并填入 Supabase 和本地 URL。
    4. 启动开发服务器: `npm run dev`
    5. 在浏览器中打开 `http://localhost:3000`

* **生产部署**:
    1. 项目已通过 Git 与 Vercel 平台连接。
    2. 任何推送到 `main` 分支的提交都会自动触发 Vercel 的 CI/CD 流程。
    3. Vercel 会自动拉取代码、安装依赖、运行 `next build` 并将应用部署到全球边缘网络。
    4. 生产环境所需的环境变量已在 Vercel 项目仪表盘中配置。

---

## 现状与功能

目前项目已成功实现以下核心功能：

* **用户注册**: 用户可以通过邮箱和密码进行注册。
* **邮件验证**: 注册后，系统通过阿里云邮件服务向用户邮箱发送一封验证邮件。
* **用户登录**: 已验证邮箱的用户可以成功登录。
* **状态判断**: 首页右上角能正确根据用户登录状态显示“登录/注册”或“个人资料”按钮。
* **个人资料更新**: 登录用户可以进入个人资料页面，查看并更新自己的姓名和头像URL。
* **数据库交互**: 所有用户数据（包括认证信息和个人资料）均成功存储和更新在 Supabase Postgres 数据库中。

---

## 🌟 未来发展方向

本项目作为一个坚实的基础，可以向多个有趣的方向扩展：

### 方向一：内容发布平台 (博客或论坛)

* **功能**:
  * 创建 `Post` 数据表，与 `User` 表关联。
  * 开发一个富文本编辑器，让登录用户可以创建、编辑和发布文章。
  * 实现文章列表页和详情页，支持公开访问。
  * 添加评论功能，允许登录用户在文章下发表评论。
* **技术挑战**: 富文本编辑器的选型 (如 Tiptap, Lexical)，数据分页，权限控制 (只有作者能编辑自己的文章)。

### 方向二：图片上传与展示 (图片墙或相册)

* **功能**:
  * 集成 **Supabase Storage** 服务。
  * 在个人资料页，将头像更新从“输入URL”改为“直接上传图片”。
  * 开发一个图片上传功能，允许用户上传多张图片并创建自己的相册。
  * 实现一个公共的图片墙，展示所有用户上传的图片 (类似 Unsplash)。
* **技术挑战**: 文件上传处理，图片优化与CDN分发，存储空间的权限管理 (RLS - Row Level Security)。

### 方向三：社交功能与实时互动

* **功能**:
  * 实现用户之间的“关注”关系。
  * 构建一个类似 Twitter 的时间线 (Feed)，显示所关注用户的动态。
  * 利用 **Supabase Realtime** 功能，实现实时通知系统（如“有人关注了你”）或实时聊天功能。
* **技术挑战**: 复杂的数据库关系设计，Feed流的算法与性能优化，WebSocket 的管理与使用。

### 方向四：SaaS 应用基础 (提供付费服务)

* **功能**:
  * 集成支付网关，如 **Stripe** 或 **Lemon Squeezy**。
  * 创建订阅方案 (如免费版、专业版)，并将用户的订阅状态与 `User` 关联。
  * 根据用户的订阅状态，限制或开放某些高级功能。
* **技术挑战**: 处理支付回调 (Webhooks)，管理订阅生命周期，设计灵活的权限和功能开关系统。
