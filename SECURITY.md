# 🔒 安全策略 · Security Policy

> 言启象限 · 语枢未来 — 安全是 YYC³ 智能应用的基石

本项目认真对待安全问题。感谢安全社区的努力，您的负责任披露帮助我们保护所有用户。

---

## 🛡️ 支持版本 · Supported Versions

本项目处于活跃开发中，仅对以下版本提供安全更新：

| 版本    | 支持状态       | 说明                      |
| ------- | -------------- | ------------------------- |
| `1.0.x` | ✅ Supported   | 当前稳定线                |
| `< 1.0` | ❌ Unsupported | Alpha / Beta 阶段，请升级 |

> 建议始终使用最新发布版本。

---

## 🚨 报告漏洞 · Reporting a Vulnerability

**请勿通过公开 Issue / PR / Discussions 报告安全漏洞。**

请通过以下**私密**渠道报告：

- 📧 Email：**[admin@0379.email](mailto:admin@0379.email)**
- 📧 抄送：`security@yyc3.dev`（如可用）
- 📌 主题前缀：`[SECURITY] YYC3-AI-Intelligence-Platform — <简述>`

### 报告模板

```markdown
**漏洞标题**：<简明描述>
**严重程度**：Critical / High / Medium / Low（参考 CVSS v3.1）
**受影响版本**：<例如 1.0.0>
**攻击向量**：<网络 / 本地 / 物理>
**是否可复现**：是 / 否

## 复现步骤

1. ...
2. ...

## 影响范围

- 机密性：...
- 完整性：...
- 可用性：...

## 建议修复

...
```

### 响应 SLA

| 阶段                 | 时间                                    |
| -------------------- | --------------------------------------- |
| 首次响应（确认收到） | ≤ 24 小时                               |
| 初步评估             | ≤ 72 小时                               |
| 修复方案沟通         | ≤ 7 天（High/Critical ≤ 48 小时）       |
| 补丁发布             | 视严重度，Critical ≤ 7 天，High ≤ 30 天 |

---

## ✅ 赏金与致谢

- 本项目当前为纯开源项目，**不提供金钱赏金**。
- 修复发布后，报告者将被列入 [`SECURITY.md`](./SECURITY.md) 的 **Hall of Thanks**（除非您希望匿名）。

### 🏆 Hall of Thanks

_感谢以下安全研究者对本项目的负责任披露（按报告时间排序）：_

- _暂无 — 期待第一位贡献者_

---

## 📦 安全开发生命周期 · SDL

YYC³ 团队遵循以下实践：

| 阶段     | 实践                                                      |
| -------- | --------------------------------------------------------- |
| **设计** | 威胁建模（STRIDE）· 最小权限 · 输入校验                   |
| **编码** | TypeScript Strict · ESLint 安全规则 · 禁止密钥入库        |
| **审查** | 必须 Reviewer Approve · Husky pre-commit 自动检查         |
| **测试** | Jest 单测 · Playwright E2E · jest-axe 无障碍              |
| **构建** | Vite Terser `drop_console` / `drop_debugger` · 最小化依赖 |
| **运行** | PWA Service Worker 缓存隔离 · CSP-ready · HTTPS 强制      |
| **监控** | Lighthouse CI · 错误边界 (`ErrorBoundary.tsx`)            |
| **响应** | 本文件 + 私密披露通道                                     |

---

## 🔐 依赖安全

- 依赖锁定：`pnpm-lock.yaml`（推荐）/ `package-lock.json`
- 建议运行 `pnpm audit` 定期审计
- 严重漏洞依赖将在 7 天内升级或替换

---

## ⚠️ 免责声明

- 本项目按 **"AS IS"** 提供，参见 [LICENSE](./LICENSE)。
- 安全策略可能随项目演进调整，最新版本始终以仓库 [`SECURITY.md`](./SECURITY.md) 为准。

---

<p align="center"><em>© 2026 YYC³ · YanYuCloudCube — Security is everyone's responsibility.</em></p>
