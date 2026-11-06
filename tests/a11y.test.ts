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

const lightThemes = ['light', 'orange', 'pink', 'purple', 'blue', 'green'];
const darkThemes = [
	'amoled',
	'dark',
	'stone',
	'red',
	'emerald',
	'dim',
	'indigo'
];

// these light themes are opt-in for more pastel colors, so only check 3:1
// contrast (the WCAG minimum for large text and icons)
const pastelThemes = ['pink', 'purple', 'blue', 'green'];
const pastelOptions = {
	runOnly: wcagTags,
	checks: {
		'color-contrast': {
			options: {
				contrastRatio: {
					normal: { expected: 3 },
					large: { expected: 3 }
				}
			}
		}
	}
};

async function expectNoViolations(page: Page, theme: string) {
	const options = pastelThemes.includes(theme)
		? pastelOptions
		: { runOnly: wcagTags };
	const { violations } = await new AxeBuilder({ page })
		.options(options)
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

for (const theme of [...lightThemes, ...darkThemes]) {
	const isDark = darkThemes.includes(theme);

	test.describe(theme, () => {
		test.use({ colorScheme: isDark ? 'dark' : 'light' });

		test.beforeEach(async ({ context, baseURL }) => {
			const settings = {
				'base-theme': theme,
				[isDark ? 'dark-theme' : 'light-theme']: theme
			};
			await context.addCookies([
				{
					name: 'settings',
					value: encodeURIComponent(JSON.stringify(settings)),
					url: baseURL
				}
			]);
		});

		for (const path of pages) {
			test(path, async ({ page }) => {
				await page.goto(path, { waitUntil: 'networkidle' });
				// theme is set on the client
				await expect(page.locator('html')).toHaveClass(
					new RegExp(`\\b${theme}\\b`)
				);

				await expectNoViolations(page, theme);
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

			await expectNoViolations(page, theme);
		});
	});
}
