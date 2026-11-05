/**
 * @fileoverview 聊天消息安全格式化
 * @description 先将内容整体转义，再插入受控的排版标签。
 *              任何外部文本（用户输入、模型输出）都必须走这里，禁止直接拼接 HTML。
 */
import { escapeHtml } from './sanitize';

const EMPHASIS_PATTERN = /\*\*(.*?)\*\*/g;
const METRIC_PATTERN = /(\d+(?:\.\d+)?%)/g;
const EMOJI_PATTERN = /(📈|📊|💰|🔗|🎨|🌙|📋|👥|🚀|📱|⚡)/g;

/**
 * 把纯文本渲染为可安全放入 dangerouslySetInnerHTML 的 HTML 片段。
 * @param content 原始文本（可能包含用户/模型输入）
 * @param withMarkup 是否启用加粗、高亮等增强排版（用户消息建议关闭）
 */
export function formatMessageContent(content: string, withMarkup = true): string {
  const escaped = escapeHtml(content);
  const formatted = withMarkup
    ? escaped
        .replace(EMPHASIS_PATTERN, '<strong>$1</strong>')
        .replace(METRIC_PATTERN, '<span class="font-medium text-green-600">$1</span>')
        .replace(EMOJI_PATTERN, '<span class="text-lg">$1</span>')
    : escaped;

  return formatted
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('<br/>');
}
