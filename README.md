# 临床病人管理助手

面向临床医护人员的移动端 PWA 应用，支持查房管理、待办追踪、病人信息录入与导入等功能。

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 19 + TypeScript + Vite + Tailwind CSS v4 |
| UI 组件 | Radix UI + shadcn/ui + Framer Motion + GSAP |
| 状态管理 | Zustand + TanStack React Query |
| 离线存储 | Dexie (IndexedDB) + PWA Service Worker |
| 后端 | Node.js + Express + Prisma |

## 项目结构

```
clinical-care/
├── frontend/          # PWA 前端（部署于 Vercel）
├── backend/           # API 服务端
└── docs/              # 设计文档与产品需求
```

## 快速开始

```bash
# 前端
cd frontend
pnpm install
pnpm dev

# 后端
cd backend
pnpm install
pnpm dev
```

## 部署

前端通过 Vercel 自动部署，关联 GitHub `main` 分支，Root 目录设为 `frontend`。
