import { test, expect } from '@playwright/test';

/**
 * 说明：
 * 1. 语言按钮与导航标签位于 <header> 内，统一用 `header button:has-text(...)` 限定，
 *    避免与内容区同名按钮冲突（Playwright strict mode）。
 * 2. 「在线 / Online」是状态徽标（div + span），不是 button，使用文本定位。
 */
test.describe('语言切换 - Language Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('默认应该显示中文界面', async ({ page }) => {
    await expect(page.locator('text=AI 操作系统')).toBeVisible();

    await expect(page.locator('header button:has-text("主页")')).toBeVisible();

    await expect(page.locator('text=在线')).toBeVisible();
  });

  test('点击语言按钮应该切换到英文', async ({ page }) => {
    const langButton = page.locator('header button:has-text("EN")');
    await langButton.click();

    await expect(page.locator('text=AI Operating System')).toBeVisible({ timeout: 2000 });

    await expect(page.locator('header button:has-text("Home")')).toBeVisible();

    await expect(page.locator('text=Online')).toBeVisible();
  });

  test('再次点击语言按钮应该切回中文', async ({ page }) => {
    const langButton = page.locator('header button:has-text("EN")');
    await langButton.click();

    const zhButton = page.locator('header button:has-text("中文")');
    await zhButton.click();

    await expect(page.locator('text=AI 操作系统')).toBeVisible({ timeout: 2000 });
  });

  test('语言切换应该在所有导航标签上生效', async ({ page }) => {
    const langButton = page.locator('header button:has-text("EN")');
    await langButton.click();

    const englishTabs = ['Home', 'Chat', 'Loop', 'Enterprise System'];

    for (const tab of englishTabs) {
      await expect(page.locator(`header button:has-text("${tab}")`)).toBeVisible();
    }
  });

  test('语言切换不应该影响当前激活的模式', async ({ page }) => {
    const chatTab = page.locator('header button:has-text("对话")');
    await chatTab.click();

    const langButton = page.locator('header button:has-text("EN")');
    await langButton.click();

    const homeTabEn = page.locator('header button:has-text("Home")');
    const chatTabEn = page.locator('header button:has-text("Chat")');

    await expect(chatTabEn).toHaveClass(/bg-white/);
    await expect(homeTabEn).not.toHaveClass(/bg-white/);
  });

  test('语言按钮文本应该在切换后更新', async ({ page }) => {
    const langButton = page.locator('header button:has-text("EN")');

    await expect(langButton).toContainText('EN');

    await langButton.click();

    const zhButton = page.locator('header button:has-text("中文")');
    await expect(zhButton).toContainText('中文');

    await zhButton.click();

    await expect(page.locator('header button:has-text("EN")')).toContainText('EN');
  });
});
