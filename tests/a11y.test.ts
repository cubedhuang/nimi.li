import AxeBuilder from '@axe-core/playwright';
import { expect, test, type BrowserContext, type Page } from '@playwright/test';

const pages = [
	'/',
	'/pona',
	'/about',
	'/ilo-ku',
	'/ilo-ku/toki',
	'/luka-pona',
	'/sandbox'
];

const views = [
	{ name: 'List', viewMode: 'compact', rowsHighlight: true },
	{ name: 'Glyphs', viewMode: 'glyphs', rowsHighlight: true },
	{ name: 'Detailed', viewMode: 'detailed', rowsHighlight: false }
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

async function waitForAnimations(page: Page) {
	await page.evaluate(() =>
		Promise.all(
			document.getAnimations().map((animation) => animation.finished)
		)
	);
}

for (const theme of [...lightThemes, ...darkThemes]) {
	const isDark = darkThemes.includes(theme);

	test.describe(theme, () => {
		test.use({ colorScheme: isDark ? 'dark' : 'light' });

		async function setSettings(
			{ context, baseURL }: { context: BrowserContext; baseURL?: string },
			extra: Record<string, unknown> = {}
		) {
			const settings = {
				'base-theme': theme,
				[isDark ? 'dark-theme' : 'light-theme']: theme,
				...extra
			};
			await context.addCookies([
				{
					name: 'settings',
					value: encodeURIComponent(JSON.stringify(settings)),
					url: baseURL
				}
			]);
		}

		test.beforeEach(async ({ context, baseURL }) => {
			await setSettings({ context, baseURL });
		});

		for (const { name, viewMode, rowsHighlight } of views) {
			test(`${name} view`, async ({ page, context, baseURL }) => {
				await setSettings({ context, baseURL }, { viewMode });
				await page.goto('/', { waitUntil: 'networkidle' });
				await expectNoViolations(page, theme);
			});

			if (!rowsHighlight) continue;

			// also covers focus
			test(`${name} view hover`, async ({ page, context, baseURL }) => {
				await setSettings({ context, baseURL }, { viewMode });
				await page.goto('/', { waitUntil: 'networkidle' });
				await page.locator('[href="/toki"]').first().hover();
				await waitForAnimations(page);
				await expectNoViolations(page, theme);
			});
		}

		test('select menu', async ({ page }) => {
			await page.goto('/', { waitUntil: 'networkidle' });
			await page.getByRole('button', { name: 'View: Grid' }).click();
			await expect(page.getByRole('option').first()).toBeVisible();
			await waitForAnimations(page);
			await expectNoViolations(page, theme);
		});

		test('language menu', async ({ page }) => {
			await page.goto('/', { waitUntil: 'networkidle' });
			await page.getByRole('button', { name: 'Select Language' }).click();
			await expect(page.getByRole('option').first()).toBeVisible();
			await waitForAnimations(page);
			await expectNoViolations(page, theme);
		});

		test('word details', async ({ page }) => {
			await page.goto('/', { waitUntil: 'networkidle' });
			await page.locator('[href="/toki"]').first().click();
			await expect(
				page.getByRole('button', { name: 'close popup' })
			).toBeVisible();
			await page.waitForLoadState('networkidle');
			await waitForAnimations(page);
			await expectNoViolations(page, theme);
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
			await waitForAnimations(page);

			await expectNoViolations(page, theme);
		});
	});
}

// no settings cookie, like a first-time visitor
for (const colorScheme of ['light', 'dark'] as const) {
	test.describe(`default settings ${colorScheme}`, () => {
		test.use({ colorScheme });

		test('/', async ({ page }) => {
			await page.goto('/', { waitUntil: 'networkidle' });
			await expect(page.locator('html')).toHaveClass(
				new RegExp(`\\b${colorScheme}\\b`)
			);
			await expectNoViolations(page, colorScheme);
		});

		test.describe('mobile', () => {
			test.use({ viewport: { width: 390, height: 844 } });

			for (const path of pages) {
				test(path, async ({ page }) => {
					await page.goto(path, { waitUntil: 'networkidle' });
					await expectNoViolations(page, colorScheme);
				});
			}

			test('navigation', async ({ page }) => {
				await page.goto('/', { waitUntil: 'networkidle' });
				await page
					.getByRole('button', { name: 'open navigation' })
					.click();
				await expect(
					page.getByRole('button', { name: 'close navigation' })
				).toBeVisible();
				await waitForAnimations(page);
				await expectNoViolations(page, colorScheme);
			});
		});
	});
}

test.describe('translated text direction', () => {
	const definition = (page: Page) =>
		page.getByRole('heading', { name: 'meaning' }).locator('+ p');

	test('right-to-left language', async ({ page, context, baseURL }) => {
		await context.addCookies([{ name: 'lang', value: 'he', url: baseURL }]);
		await page.goto('/pona', { waitUntil: 'networkidle' });
		await expect(definition(page)).toHaveCSS('direction', 'rtl');
		await expectNoViolations(page, 'light');
	});

	test('left-to-right language', async ({ page }) => {
		await page.goto('/pona', { waitUntil: 'networkidle' });
		await expect(definition(page)).toHaveCSS('direction', 'ltr');
	});
});
