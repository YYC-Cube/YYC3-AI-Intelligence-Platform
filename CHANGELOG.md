# 📝 Changelog

本项目所有重要变更均会记录在本文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，
版本管理遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

---

## [Unreleased]

### Planned

- Learning Engine 子模块深化（KnowledgeGraph / PredictiveAnalytics 全量接入）
- i18n 多语言切换
- 多主题（Dark / High-Contrast）系统化
- Edge 部署适配（Cloudflare / Vercel Edge）

---

## [1.0.0] — 2026-03-21 · Foundation Release

### ✨ Added

- **15+ 智能模块** 全量上线：Explorer / Trends / CrossAnalysis / ASO / Creative / Paywall / Markets / Features / Pricing / Reviews / Learning / Ideas / Sales / ABTesting / HumanAICollaboration
- **NARA 控制台**：Home / Chat / Loop 三态交互
- **PWA 完整支持**：VitePWA `autoUpdate`、Workbox 运行时缓存、InstallPrompt、离线可用
- **shadcn/ui 原子组件库**：48+ 组件（accordion → tooltip）
- **全端 Logo 资产矩阵**：[`public/yyc3-icons/`](./public/yyc3-icons) 含 Android / iOS / PWA / Favicon / WebP
- **CI/CD 双工作流**：[`ci-cd.yml`](./.github/workflows/ci-cd.yml) + [`lighthouse.yml`](./.github/workflows/lighthouse.yml)
- **质量工具链**：ESLint + Prettier + Husky + lint-staged + Jest + Playwright + Lighthouse + axe-core
- **开发者文档五件套**：README / LICENSE / CONTRIBUTING / CODE_OF_CONDUCT / CHANGELOG / SECURITY
- **开源级 README**：Family-001 顶图、徽章系统、五维架构导航
- **团队标准规范文档**：开发标准、文档闭环、五高五标五化五维核心机制

### 🐛 Fixed

- 修正 [`vite.config.ts`](./vite.config.ts)、[`public/yyc3-icons/pwa/manifest.json`](./public/yyc3-icons/pwa/manifest.json)、[`index.html`](./index.html) 中 logo 路径 `yyc3-app-icons` → 实际目录 `yyc3-icons`，修复 PWA 安装后图标 404 问题
- 补全 [`index.html`](./index.html) favicon、apple-touch-icon、theme-color、apple-mobile-web-app-\* meta、Open Graph 标签

### 🔧 Changed

- TypeScript 严格模式全量启用
- Vite 生产构建开启 Terser `drop_console` / `drop_debugger`
- manualChunks 分包策略：react-vendor / ui-vendor / charts-vendor / date-utils / ui-utils / vendor

### 🗑️ Deprecated

- 暂无

### 🛡️ Security

- 建立 [`SECURITY.md`](./SECURITY.md) 漏洞披露流程
- Husky pre-commit 钩子阻止不合规代码入库

---

## 版本号规则 · SemVer

- `MAJOR`：不兼容的 API 变更
- `MINOR`：向后兼容的功能新增
- `PATCH`：向后兼容的缺陷修复

---

## 链接

[Unreleased]: https://github.com/YYC-Cube/YYC3-AI-Intelligence-Platform/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/YYC-Cube/YYC3-AI-Intelligence-Platform/releases/tag/v1.0.0

---

<p align="center"><em>© 2026 YYC³ · YanYuCloudCube</em></p>
