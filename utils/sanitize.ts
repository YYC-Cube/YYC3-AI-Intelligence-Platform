/**
 * @fileoverview HTML 安全工具
 * @description 提供转义、白名单清洗与纯文本提取能力。
 *              业务侧渲染动态内容时必须先 `escapeHtml` 或使用 `sanitizeHtml`，
 *              禁止直接把外部/模型输出塞进 dangerouslySetInnerHTML。
 */

const ALLOWED_TAGS = new Set(['B', 'I', 'EM', 'STRONG', 'A', 'P', 'BR', 'UL', 'OL', 'LI']);
const ALLOWED_ATTRS = new Set(['href', 'target', 'rel']);
const SAFE_PROTOCOLS = /^(https?:|mailto:|\/|#)/i;

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** 将任意字符串转义为纯文本，可用于 react 的 dangerouslySetInnerHTML 前置处理 */
export function escapeHtml(text: string): string {
  if (typeof text !== 'string') {
    return String(text ?? '');
  }
  return text.replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char]);
}

function sanitizeWithDom(dirty: string): string {
  const template = document.createElement('template');
  template.innerHTML = dirty;

  const walk = (node: Node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType !== 1) {
        return;
      }

      const element = child as Element;
      const tag = element.tagName;

      if (!ALLOWED_TAGS.has(tag)) {
        // 危险标签整体移除；非白名单容器仅解包，保留其文本内容
        if (['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'LINK', 'META'].includes(tag)) {
          element.remove();
          return;
        }
        walk(element);
        element.replaceWith(...Array.from(element.childNodes));
        return;
      }

      Array.from(element.attributes).forEach((attr) => {
        const name = attr.name.toLowerCase();
        const value = attr.value.trim();
        if (!ALLOWED_ATTRS.has(name)) {
          element.removeAttribute(attr.name);
          return;
        }
        if (name === 'href' && !SAFE_PROTOCOLS.test(value)) {
          element.removeAttribute('href');
        }
      });

      walk(element);
    });
  };

  walk(template.content);
  return template.innerHTML;
}

function sanitizeWithRegex(dirty: string): string {
  return dirty
    .replace(/<\s*(script|style|iframe|object|embed)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/<\s*(script|style|iframe|object|embed)[^>]*\/?>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '');
}

/** 白名单清洗 HTML：仅保留排版类标签，移除事件属性与危险协议 */
export function sanitizeHtml(dirty: string): string {
  if (typeof dirty !== 'string' || dirty === '') {
    return '';
  }
  if (typeof document !== 'undefined') {
    return sanitizeWithDom(dirty);
  }
  return sanitizeWithRegex(dirty);
}

/** 提取纯文本（用于导出、日志与搜索） */
export function stripHtml(text: string): string {
  if (typeof text !== 'string') {
    return String(text);
  }

  return text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .trim();
}

export function createSafeMarkup(content: string): { __html: string } {
  return { __html: sanitizeHtml(content) };
}
