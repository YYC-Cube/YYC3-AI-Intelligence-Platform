# 🤝 YYC³ 贡献指南 · Contributing Guide

> _言启千行代码 · 语枢万物智能_
> 欢迎并感谢您对 **YYC³ AI Intelligence Platform** 的贡献！本文档定义了参与协作的统一标准。

---

## 📜 行为准则

参与本项目即代表您同意遵守 [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md)。请始终保持尊重、包容与专业的态度。

---

## 🚀 快速开始

```bash
# 1. Fork 仓库后克隆
git clone https://github.com/`<YOUR_USERNAME>`/YYC3-AI-Intelligence-Platform.git
cd YYC3-AI-Intelligence-Platform

# 2. 添加上游
git remote add upstream https://github.com/YYC-Cube/YYC3-AI-Intelligence-Platform.git

# 3. 安装依赖（推荐 pnpm，与 CI 一致）
pnpm install

# 4. 启动开发服务器
pnpm dev
```

环境要求：**Node ≥ 18**，**pnpm ≥ 9**。

---

## 🌿 分支策略

采用 GitHub Flow + 长期主干：

| 分支               | 用途                                 |
| ------------------ | ------------------------------------ |
| `main`             | 生产稳定分支，受保护，仅通过 PR 合入 |
| `develop`          | 集成分支，下个版本工作汇聚地         |
| `feat/<scope>`     | 新特性开发                           |
| `fix/<scope>`      | Bug 修复                             |
| `docs/<scope>`     | 文档变更                             |
| `refactor/<scope>` | 重构（无行为变化）                   |
| `chore/<scope>`    | 构建 / 工具链 / 依赖                 |
| `release/v<x.y.z>` | 发版准备                             |

> 同一 PR 不要混合多种类型；保持单一职责。

---

## 📝 Commit 规范 · Conventional Commits

格式：`<type>(<scope>): <subject>`

| type       | 含义                   |
| ---------- | ---------------------- |
| `feat`     | 新功能                 |
| `fix`      | Bug 修复               |
| `docs`     | 文档                   |
| `style`    | 格式（不影响代码运行） |
| `refactor` | 重构                   |
| `perf`     | 性能优化               |
| `test`     | 测试相关               |
| `build`    | 构建系统 / 依赖        |
| `ci`       | CI 配置                |
| `chore`    | 杂项工具变更           |
| `revert`   | 回滚                   |

示例：

```
feat(modules/aso): add keyword intelligence card
fix(pwa): correct yyc3-icons manifest path
docs(readme): add badge system and dev-docs quintet
```

---

## 🧪 质量门禁 · Quality Gates

提 PR 前请**本地通过**以下检查（与 CI 完全一致）：

```bash
pnpm format:check   # Prettier
pnpm lint           # ESLint  --max-warnings 0
pnpm typecheck      # tsc --noEmit
pnpm test           # Jest 单测
pnpm e2e            # Playwright E2E（如改动涉及 UI 行为）
```

- **pre-commit** 钩子（Husky + lint-staged）会自动对暂存文件运行 ESLint + Prettier。
- **新增功能必须附带测试**：单测优先放 `__tests__/`，组件测试与组件同源目录亦可。
- **a11y**：所有新 UI 组件须通过 `jest-axe` 检查，目标 WCAG 2.2 AA。

---

## 🎨 代码风格

- **TypeScript Strict**：禁用 `any`，必要时使用 `unknown` + 类型守卫。
- **React**：函数组件 + Hooks，禁止 class 组件。
- **UI**：优先使用 [`components/ui/`](./components/ui) 中的 shadcn/ui 原子组件；样式统一使用 Tailwind CSS。
- **导入**：使用 `@/` 别名（见 [`vite.config.ts`](./vite.config.ts) `resolve.alias`）。
- **命名**：组件 PascalCase、Hooks `use*`、常量 UPPER_SNAKE、文件名与导出一致。

---

## 🔄 PR 流程

1. 从 `develop`（或 `main`）切出特性分支。
2. 编码 → 本地通过全部质量门禁。
3. **Squash 合并**：PR 标题需符合 Conventional Commits。
4. 至少一位 Reviewer Approve，CI 全绿即可合入。
5. 涉及发版：合入 `main` 后由维护者按 [CHANGELOG.md](./CHANGELOG.md) 流程发版。

### PR 标题前缀

`feat:` / `fix:` / `docs:` / `refactor:` / `perf:` / `test:` / `build:` / `ci:` / `chore:` / `revert:`

### PR 描述模板

```markdown
## 🎯 变更类型

- [ ] feat [ ] fix [ ] docs [ ] refactor [ ] perf [ ] test [ ] build/ci [ ] chore

## 📝 变更说明

<!-- 简要描述本次变更做了什么、为什么 -->

## 🔗 关联 Issue

Closes #xxx

## ✅ 自检清单

- [ ] 本地通过 lint / typecheck / test
- [ ] 新增/更新测试
- [ ] 文档已更新（README / CHANGELOG）
- [ ] 截图（UI 变更必填）
```

---

## 🐛 Issue 规范

- **Bug**：使用 Bug 模板，附复现步骤、预期 / 实际、环境（浏览器、Node、OS）。
- **Feature**：描述场景、动机、期望形态、备选方案。
- **Good First Issue** / **Help Wanted** 标签欢迎新成员。

---

## 🔐 安全漏洞

请**勿**通过公开 Issue 报告安全漏洞。详见 [SECURITY.md](./SECURITY.md)。

---

## 📮 联系

- Maintainers：YYC³ Team
- Email：[admin@0379.email](mailto:admin@0379.email)
- Discussions：[GitHub Discussions](https://github.com/YYC-Cube/YYC3-AI-Intelligence-Platform/discussions)

---

<p align="center">
  <em>© 2026 YYC³ · YanYuCloudCube — 感谢您与我们一起，言启象限，语枢未来。</em>
</p>
