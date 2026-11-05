/**
 * @fileoverview YYC3 Floating AI Assistant - 浮窗 AI 智能助理入口
 * @description Integrated with AiAssistant full component (ai-assistant/)
 *   Maintains backward-compatible props for EnterpriseApp.tsx and ClientApp.tsx
 * @version 2.0.0
 * @author YYC3 Team
 *
 * @integration
 *   - Docs source: docs/AI-Dev/AIAssistant/ (v3.0 modular)
 *   - Project location: components/ai-assistant/
 *   - Icons reference: /yyc3-icons/
 */
import { AiAssistant } from './ai-assistant';

interface FloatingAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
  onNavigateToAssistant: () => void;
}

/**
 * FloatingAssistant — 浮窗 AI 智能助理
 *
 * 向后兼容的封装层：
 * - 接收 isOpen/onToggle/onNavigateToAssistant 外部 props
 * - 内部渲染 AiAssistant 全功能浮窗组件（8 Tab 面板 + AI Family 人格）
 * - 管理 isOpen 状态桥接
 *
 * @example
 * ```tsx
 * <FloatingAssistant
 *   isOpen={showFloatingAssistant}
 *   onToggle={handleAssistantToggle}
 *   onNavigateToAssistant={() => setActiveModule('assistant')}
 * />
 * ```
 */
export function FloatingAssistant({
  isOpen,
  onToggle,
  onNavigateToAssistant: _onNavigateToAssistant,
}: FloatingAssistantProps) {
  return (
    <AiAssistant
      mode="floating"
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onToggle();
        }
      }}
    />
  );
}
