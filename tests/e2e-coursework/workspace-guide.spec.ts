import { expect, test } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

test('introduction, login and assignment register work on desktop and mobile', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/welcome');
  await expect(page.getByRole('heading', { name: '知因 CodeLab', level: 1 })).toBeVisible();
  await page.getByRole('link', { name: '进入工作台' }).click();
  await page.getByLabel('邮箱', { exact: true }).fill('teacher@codelab.local');
  await page.getByLabel('密码', { exact: true }).fill('Browser-test-only-2904!');
  await page.getByRole('button', { name: '登录', exact: true }).click();
  await page.getByRole('link', { name: '课程作业', exact: true }).click();
  await page.getByRole('button', { name: '创建作业', exact: true }).click();
  await page.getByLabel('作业名称', { exact: true }).fill('列表组件：筛选与空状态');
  await page.getByLabel('目标与说明', { exact: true }).fill('提交列表组件的固定版本，说明筛选结果为空时的页面行为。');
  await page.getByLabel('评价标准（每行一条）', { exact: true }).fill('筛选结果正确\n空状态提示可见');
  await page.getByRole('button', { name: '创建并发布', exact: true }).click();
  await expect(page.getByRole('heading', { name: '列表组件：筛选与空状态', level: 1 })).toBeVisible();
  await page.getByRole('navigation', {name:'工作台主导航'}).getByRole('link', {name:'课程作业'}).click();
  await expect(page.getByRole('heading', { name: '列表组件：筛选与空状态', level: 2 })).toBeVisible();
  for (const [name,width,height] of [['desktop',1440,940],['mobile',390,844]] as const) {
    await page.setViewportSize({ width, height });
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(page.locator('.evidence-heading')).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    if (process.env.CODELAB_GUIDE_SCREENSHOTS === '1') {
      await mkdir('media', {recursive:true});
      await page.screenshot({ path: `media/coursework-${name}.png`, animations:'disabled' });
    }
  }
});
