import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const pages = [
	'/',
	'/pona',
	'/about',
	'/ilo-ku',
	'/ilo-ku/toki',
	'/luka-pona',
	'/sandbox'
];

const wcagTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

async function expectNoViolations(page: Page) {
	const { violations } = await new AxeBuilder({ page })
		.withTags(wcagTags)
		.analyze();

	const summary = violations.map((violation) => ({
		rule: violation.id,
		impact: violation.impact,
		help: violation.help,
		url: violation.helpUrl,
		elements: violation.nodes.map((node) => node.target.join(' '))
	}));
	expect(summary).toEqual([]);
}

for (const colorScheme of ['light', 'dark'] as const) {
	test.describe(colorScheme, () => {
		test.use({ colorScheme });

		for (const path of pages) {
			test(path, async ({ page }) => {
				await page.goto(path, { waitUntil: 'networkidle' });
				// theme is set on the client
				await expect(page.locator('html')).toHaveClass(
					new RegExp(`\\b${colorScheme}\\b`)
				);

				await expectNoViolations(page);
			});
		}

		test('theme picker', async ({ page }) => {
			await page.goto('/', { waitUntil: 'networkidle' });
			await page
				.getByRole('button', { name: 'set color theme and font' })
				.click();

			const picker = page.getByRole('group', { name: 'color theme' });
			await expect(picker).toBeVisible();
			await page.evaluate(() =>
				Promise.all(
					document
						.getAnimations()
						.map((animation) => animation.finished)
				)
			);

			await expectNoViolations(page);
		});
	});
}
