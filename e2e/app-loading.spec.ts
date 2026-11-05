/* eslint-disable no-console */
import { expect, test } from '@playwright/test';

test.describe('应用加载 - Application Loading', () => {
  test('应该正确加载NARA控制台主页', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/YYC³|NARA/i);

    await expect(page.locator('h1')).toContainText('NARA');

    await expect(page.locator('text=AI 操作系统')).toBeVisible();
  });

  test('应该在3秒内完成初始渲染', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/', { waitUntil: 'networkidle' });

    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000);

    console.log(`⚡ 页面加载时间: ${loadTime}ms`);
  });

  test('应该显示在线状态指示器', async ({ page }) => {
    await page.goto('/');

    const statusIndicator = page.locator('.animate-pulse');

    await expect(statusIndicator).toBeVisible();

    const statusText = page.locator('text=在线').or(page.locator('text=Online'));
    await expect(statusText).toBeVisible();
  });

  test('应该正确显示所有导航标签', async ({ page }) => {
    await page.goto('/');

    const expectedTabs = ['主页', '对话', '循环', '企业系统'];

    for (const tab of expectedTabs) {
      await expect(page.locator(`header button:has-text("${tab}")`)).toBeVisible();
    }
  });

  test('默认应该激活主页模式', async ({ page }) => {
    await page.goto('/');

    const homeTab = page.locator('header button:has-text("主页")');

    await expect(homeTab).toHaveClass(/bg-white/);
  });

  test('应该支持语言切换按钮显示', async ({ page }) => {
    await page.goto('/');

    const languageButton = page.locator('header button:has-text("EN")');

    await expect(languageButton).toBeVisible();

    await expect(languageButton).toHaveAttribute('title', /语言|Language/i);
  });

  test('页面不应该有JavaScript错误', async ({ page }) => {
    const errors: string[] = [];

    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto('/');

    await page.waitForLoadState('networkidle');

    expect(errors.length).toBe(0);

    if (errors.length > 0) {
      console.error('❌ JavaScript错误:', errors);
    }
  });

  test('关键资源应该成功加载', async ({ page }) => {
    const failedRequests: string[] = [];

    page.on('requestfailed', (request) => {
      if (!request.url().includes('analytics') && !request.url().includes('tracking')) {
        failedRequests.push(`${request.method()} ${request.url()}`);
      }
    });

    await page.goto('/');

    await page.waitForLoadState('networkidle');

    expect(failedRequests.length).toBe(0);

    if (failedRequests.length > 0) {
      console.error('❌ 失败的请求:', failedRequests);
    }
  });
});
