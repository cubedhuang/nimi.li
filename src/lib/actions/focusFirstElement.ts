const focusable = `
  a[href],
  button:not([disabled]),
  input:not([disabled]):not([type="hidden"]),
  select:not([disabled]),
  textarea:not([disabled]),
  [tabindex]:not([tabindex="-1"]),
  [contenteditable="true"]
`;

export function focusFirstElement(parent: HTMLElement) {
	if (parent.matches(focusable)) {
		parent.focus();
		if (document.activeElement === parent) {
			return;
		}
	}

	const candidates = parent.querySelectorAll<HTMLElement>(focusable);

	for (const el of candidates) {
		el.focus();
		if (document.activeElement === el) {
			return;
		}
	}
}
