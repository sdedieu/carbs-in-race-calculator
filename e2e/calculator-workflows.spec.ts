import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('an athlete can configure a race carbohydrate target', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Race fuel calculator' })).toBeVisible();

  await page.getByLabel('Hours', { exact: true }).fill('4');
  await page.getByLabel('Minutes', { exact: true }).fill('15');
  await page.getByLabel('Carbs / h', { exact: true }).fill('90');

  await expect(page.getByText('0 g / 383 g', { exact: true })).toBeVisible();
  await expect(page.getByText('382.5 g remaining', { exact: true })).toBeVisible();
});

test('a user can configure both calculators without losing their settings', async ({ page }) => {
  await page.getByLabel('Hours', { exact: true }).fill('5');
  await page.getByRole('button', { name: 'Everyday nutrition' }).click();

  await expect(page.getByRole('heading', { name: 'Daily fuel calculator' })).toBeVisible();
  await page.getByLabel('BMR (kcal)', { exact: true }).fill('3000');
  await page.getByLabel('Body mass (kg)', { exact: true }).fill('80');

  await expect(page.getByText('0 kcal / 2,700 kcal', { exact: true })).toBeVisible();
  await expect(page.getByText('0 g / 335–410 g', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Race fuel' }).click();
  await expect(page.getByLabel('Hours', { exact: true })).toHaveValue('5');

  await page.getByRole('button', { name: 'Everyday nutrition' }).click();
  await expect(page.getByLabel('BMR (kcal)', { exact: true })).toHaveValue('3000');
  await expect(page.getByLabel('Body mass (kg)', { exact: true })).toHaveValue('80');
});
