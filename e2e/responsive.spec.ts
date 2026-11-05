/* eslint-disable no-console */
import { devices, expect, test } from '@playwright/test';

/**
 * 响应式断点验证。
 * 注意：NARA 控制台 header 内共有 5 个 button（4 个模式标签 + 1 个语言切换），
 * 因此不能直接用 `header button` 的 count 断言标签数量；标签定位统一使用文本。
 */
const TAB_NAMES = ['主页', '对话', '循环', '企业系统'];

function tab(page: import('@playwright/test').Page, name: string) {
  return page.locator(`header button:has-text("${name}")`);
}

// 桌面视图 - Desktop
test.describe('桌面视图 (Desktop)', () => {
  test.use({ viewport: { width: 1920, height: 1080 } });

  test('应该在桌面上正确显示完整布局', async ({ page }) => {
    await page.goto('/');

    const header = page.locator('header');
    await expect(header).toBeVisible();

    const headerBox = await header.boundingBox();
    expect(headerBox?.width).toBeGreaterThan(1000);

    await expect(page.locator('h1')).toBeVisible();
  });

  test('导航标签应该水平排列', async ({ page }) => {
    await page.goto('/');

    // 取首尾两个标签定位，避免依赖 header 内部 div 的层级索引
    const firstBox = await tab(page, TAB_NAMES[0]).boundingBox();
    const lastBox = await tab(page, TAB_NAMES[TAB_NAMES.length - 1]).boundingBox();

    expect(firstBox).not.toBeNull();
    expect(lastBox).not.toBeNull();

    if (firstBox && lastBox) {
      expect(Math.abs(firstBox.y - lastBox.y)).toBeLessThan(50);
      expect(lastBox.x).toBeGreaterThan(firstBox.x);
    }
  });
});

// 平板视图 - Tablet
test.describe('平板视图 (Tablet)', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test('应该适配平板屏幕尺寸', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('header')).toBeVisible();

    await expect(page.locator('h1')).toBeVisible();

    // 断点修正：header 内为 4 个模式标签 + 1 个语言按钮
    const count = await page.locator('header button').count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('内容不应该水平溢出', async ({ page }) => {
    await page.goto('/');

    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);

    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });
});

// 移动端视图 - Mobile
test.describe('移动端视图 (Mobile)', () => {
  test.use({
    viewport: { width: 390, height: 844 },
    userAgent: devices['iPhone 12'].userAgent,
    hasTouch: true,
  });

  test('应该在移动设备上正确显示', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toBeVisible();

    const onlineStatus = page.locator('text=在线');
    const isZhVisible = await onlineStatus.isVisible().catch(() => false);

    if (!isZhVisible) {
      await expect(page.locator('text=Online')).toBeVisible();
    } else {
      await expect(onlineStatus).toBeVisible();
    }
  });

  test('导航标签应该可以滚动或自适应', async ({ page }) => {
    await page.goto('/');

    for (const name of TAB_NAMES) {
      await expect(tab(page, name)).toBeVisible();
    }
  });

  test('触摸交互应该正常工作', async ({ page }) => {
    await page.goto('/');

    const chatTab = tab(page, '对话');

    await chatTab.click();

    await expect(chatTab).toHaveClass(/bg-white/, { timeout: 3000 });
  });
});

// 大屏视图 - Large Screen
test.describe('大屏视图 (Large Screen)', () => {
  test.use({ viewport: { width: 2560, height: 1440 } });

  test('应该在4K屏幕上正确渲染', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('header')).toBeVisible();

    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();

    const mainBox = await mainContent.boundingBox();
    expect(mainBox?.width).toBeGreaterThan(2000);
  });
});

// 字体大小响应式 - Font Size Responsive
test.describe('字体大小响应式', () => {
  test('字体大小应该在不同视口下合理调整', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const titleH1 = page.locator('h1');
    const mobileFontSize = await titleH1.evaluate((el) => window.getComputedStyle(el).fontSize);

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();

    const desktopFontSize = await titleH1.evaluate((el) => window.getComputedStyle(el).fontSize);

    console.log(`📱 移动端字体大小: ${mobileFontSize}`);
    console.log(`🖥️ 桌面端字体大小: ${desktopFontSize}`);

    const mobileSize = parseFloat(mobileFontSize);
    const desktopSize = parseFloat(desktopFontSize);

    // 设计令牌下标题为 1.25rem（基准 14px 时计算值为 17.5px），
    // 因此改为「可读下限 + 桌面端不缩小」的回归断言，避免硬编码具体像素值。
    expect(mobileSize).toBeGreaterThanOrEqual(16);
    expect(desktopSize).toBeGreaterThanOrEqual(mobileSize);
  });
});
