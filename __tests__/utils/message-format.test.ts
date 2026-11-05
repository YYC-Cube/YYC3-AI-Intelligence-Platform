import { formatMessageContent } from '../../utils/message-format';

describe('消息安全格式化', () => {
  it('应该转义 HTML 标签，避免注入', () => {
    const dirty = '<img src=x onerror=alert(1)>';
    const html = formatMessageContent(dirty);

    expect(html).not.toContain('<img');
    expect(html).toContain('&lt;img');
    expect(html).not.toMatch(/<img[^>]*onerror/i);
  });

  it('应该阻止 script 标签执行', () => {
    const html = formatMessageContent('<script>alert("xss")</script>');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('助手消息应保留受控的加粗排版', () => {
    const html = formatMessageContent('**增长 32%**');
    expect(html).toContain('<strong>');
    expect(html).toContain('增长 ');
    expect(html).toContain('text-green-600');
  });

  it('用户消息关闭增强排版，仅做换行与转义', () => {
    const html = formatMessageContent('**纯文本**\n第二行', false);
    expect(html).not.toContain('<strong>');
    expect(html).toContain('**纯文本**');
    expect(html).toContain('<br/>');
  });

  it('应该丢弃空行并压缩输出', () => {
    expect(formatMessageContent('a\n\n\nb')).toBe('a<br/>b');
  });

  it('应该兼容空字符串', () => {
    expect(formatMessageContent('')).toBe('');
  });
});
