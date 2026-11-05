import { expect, test } from '@playwright/test';

/**
 * 所有导航标签断言均限定在 <header> 内。
 * 原因：切换模式后 ChatMode / LoopMode 内容区也会出现「对话 / Chat」等按钮，
 * 未限定的 `button:has-text(...)` 会命中多个元素并触发 Playwright strict mode 报错。
 */
test.describe('导航流程 - Navigation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('应该能够切换到对话模式', async ({ page }) => {
    const chatTab = page.locator('header button:has-text("对话")');

    await chatTab.click();

    await expect(chatTab).toHaveClass(/bg-white/);

    const chatContent = page.locator('text=Chat').or(page.locator('text=对话'));
    await expect(chatContent.first()).toBeVisible({ timeout: 5000 });
  });

  test('应该能够切换到循环模式', async ({ page }) => {
    const loopTab = page.locator('header button:has-text("循环")');

    await loopTab.click();

    await expect(loopTab).toHaveClass(/bg-white/);

    const loopContent = page.locator('text=Loop').or(page.locator('text=循环'));
    await expect(loopContent.first()).toBeVisible({ timeout: 5000 });
  });

  test('应该能够切换到企业系统模式', async ({ page }) => {
    const systemTab = page.locator('header button:has-text("企业系统")');

    await systemTab.click();

    // 企业系统为独立布局（NARA 头部与标签会被卸载），因此不能断言原 tab 仍高亮
    const exitButton = page.locator('button:has-text("Exit")');
    await expect(exitButton).toBeVisible();

    await exitButton.click();
    await expect(page.locator('header button:has-text("主页")')).toHaveClass(/bg-white/);
  });

  test('应该能够在不同模式间快速切换', async ({ page }) => {
    // 企业系统为独立布局，单独在下一个用例覆盖，此处只做头部内三态切换
    const tabs = ['主页', '对话', '循环'];

    for (let i = 0; i < tabs.length; i++) {
      const tab = page.locator(`header button:has-text("${tabs[i]}")`);
      await tab.click();

      await expect(tab).toHaveClass(/bg-white/, { timeout: 3000 });

      if (i < tabs.length - 1) {
        const nextTab = page.locator(`header button:has-text("${tabs[i + 1]}")`);
        await expect(nextTab).not.toHaveClass(/bg-white/);
      }
    }
  });

  test('应该能够从企业系统返回主页', async ({ page }) => {
    const systemTab = page.locator('header button:has-text("企业系统")');
    await systemTab.click();

    const exitButton = page.locator('button:has-text("Exit")');
    await exitButton.click();

    const homeTab = page.locator('header button:has-text("主页")');
    await expect(homeTab).toHaveClass(/bg-white/);
  });

  test('导航切换应该有平滑过渡效果', async ({ page }) => {
    const homeTab = page.locator('header button:has-text("主页")');
    const chatTab = page.locator('header button:has-text("对话")');

    const initialTransition = await homeTab.evaluate(
      (el) => window.getComputedStyle(el).transition
    );

    // transition 简写返回形如 "0.3s cubic-bezier(0.4, 0, 0.2, 1)"，不能断言包含 "transition" 关键字
    expect(initialTransition).toMatch(/[0-9.]+s|cubic-bezier|ease/);

    await chatTab.click();

    await expect(chatTab).toHaveClass(/bg-white/, { timeout: 3000 });
  });

  test('当前激活的标签应该有正确的视觉样式', async ({ page }) => {
    const activeTab = page.locator('header button:has-text("主页")');

    await expect(activeTab).toHaveCSS('background-color', /rgb\(255|rgb\(25[0-5]/);

    const inactiveTab = page.locator('header button:has-text("对话")');

    const bgColor = await inactiveTab.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(bgColor).not.toContain('255, 255, 255');
  });
});
