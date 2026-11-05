/**
 * @fileoverview YYC3 AI Assistant - 导出入口
 * @description Adapted from docs/AI-Dev/AIAssistant/index.ts — v3.0
 * @version 1.0.0
 * @author YYC3 Team
 *
 * 导出:
 *   AiAssistant     - 主组件 (默认 floating 模式)
 *   AiAssistantProps - 组件 Props 类型
 *
 * 使用:
 *   <AiAssistant />                    ← 浮动按钮+面板 (默认)
 *   <AiAssistant mode="inline" />      ← 内嵌面板 (嵌入其他页面)
 */
export { AiAssistant, default } from './AiAssistant';
export type { AiAssistantProps } from './types';
