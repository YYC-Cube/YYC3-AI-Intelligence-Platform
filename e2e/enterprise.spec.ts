import { expect, test } from '@playwright/test';

/**
 * 企业后台：验证「每个模块不同信息架构」与「导航折叠」两项改造。
 * 入口：NARA 控制台 → 企业系统。
 */
test.describe('企业后台 - Enterprise Workspace', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('header button:has-text("企业系统")').click();
    await expect(page.locator('button:has-text("Exit")')).toBeVisible();
  });

  test('默认应展示数据中心看板（指标 + 趋势 + 明细表）', async ({ page }) => {
    await expect(page.getByText('日活用户')).toBeVisible();
    await expect(page.getByText('指标明细')).toBeVisible();
    await expect(page.getByText('演示数据').first()).toBeVisible();
  });

  test('切换到财务资产应展示财务专属结构', async ({ page }) => {
    await page.locator('nav button:has-text("财务资产")').click();

    await expect(page.getByText('本期收入')).toBeVisible();
    await expect(page.getByText('预算执行')).toBeVisible();
    await expect(page.getByText('日活用户')).toHaveCount(0);
  });

  test('切换到人力资源应展示组织与招聘结构', async ({ page }) => {
    await page.locator('nav button:has-text("人力资源")').click();

    await expect(page.getByText('技术中心')).toBeVisible();
    await expect(page.getByText(/招聘流程/)).toBeVisible();
    await expect(page.getByText('本期收入')).toHaveCount(0);
  });

  test('未实现模块应收起为「规划中」且不可点击', async ({ page }) => {
    // 移动端（<1024px）侧边栏默认收起，需先展开；桌面端汉堡按钮不可见
    const viewport = page.viewportSize();
    if (viewport && viewport.width < 1024) {
      await page.locator('button[aria-label="Toggle sidebar"]').click();
    }

    const toggle = page.locator('button:has-text("规划中（")').first();
    await expect(toggle).toBeVisible();

    const disabled = page.locator('[aria-disabled="true"]');
    await expect(disabled).toHaveCount(0);

    await toggle.click();
    await expect(disabled.first()).toBeVisible();
  });
});
