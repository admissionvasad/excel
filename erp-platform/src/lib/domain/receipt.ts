/**
 * College-wise receipt numbering.
 *
 * Each college/department/fee-type/year combination owns an independent series
 * (for example `ENG/2026/00001`). The number is built from a configurable
 * prefix/suffix and zero-padded sequence. Actual sequence allocation must be
 * performed inside a database transaction (or the local store's mutex) to stay
 * unique under concurrency.
 */

export interface ReceiptSeries {
	prefix?: string | null;
	suffix?: string | null;
	padLength?: number | null;
}

export interface ReceiptNumberInput extends ReceiptSeries {
	number: number;
	/** Optional year inserted between prefix and sequence when no prefix token. */
	year?: number | string | null;
}

/** Render a receipt number such as `ENG/2026/00001`. */
export function formatReceiptNumber(input: ReceiptNumberInput): string {
	const prefix = (input.prefix ?? '').trim();
	const suffix = (input.suffix ?? '').trim();
	const pad = Math.max(1, Math.min(12, input.padLength ?? 5));
	const sequence = String(Math.max(1, Math.trunc(input.number))).padStart(pad, '0');
	const yearValue = input.year != null && input.year !== '' ? String(input.year) : '';

	let base: string;
	if (prefix) {
		const hasTrailingSeparator = /[/\-_]$/.test(prefix);
		const joiner = hasTrailingSeparator ? '' : '/';
		const yearPart = prefix.includes('{year}') || !yearValue ? '' : `${yearValue}/`;
		base = `${prefix}${joiner}${yearPart}${sequence}`;
	} else {
		base = `${yearValue ? `${yearValue}/` : ''}${sequence}`;
	}

	// Replace a {year} placeholder if present.
	base = base.replace('{year}', yearValue);

	return `${base}${suffix}`;
}

/**
 * Next sequence number for a series. Kept pure so callers can persist the
 * result atomically. `current` is the last issued number (0 = none issued yet).
 */
export function nextReceiptSequence(current: number | null | undefined): number {
	const value = typeof current === 'number' && Number.isFinite(current) ? current : 0;
	return Math.max(0, Math.trunc(value)) + 1;
}
