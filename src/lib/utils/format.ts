export function uid(): string {
	if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

export function currencySymbol(currency = 'INR'): string {
	if (currency === 'INR') return '₹';
	if (currency === 'USD') return '$';
	return currency + ' ';
}

export function formatCurrency(value: unknown, currency = 'INR'): string {
	const num = toNumber(value);
	if (Number.isNaN(num)) return '—';
	return `${currencySymbol(currency)}${num.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

export function formatNumber(value: unknown, digits = 0): string {
	const num = toNumber(value);
	if (Number.isNaN(num)) return '—';
	return num.toLocaleString('en-IN', { maximumFractionDigits: digits });
}

export function toNumber(value: unknown): number {
	if (typeof value === 'number') return value;
	if (typeof value === 'string') {
		const cleaned = value.replace(/[₹,\s]/g, '');
		const num = Number(cleaned);
		return Number.isNaN(num) ? NaN : num;
	}
	return NaN;
}

export function formatDate(value: unknown): string {
	if (!value) return '—';
	const date = parseDate(value);
	if (!date) return String(value);
	return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(value: unknown): string {
	if (!value) return '—';
	const date = parseDate(value);
	if (!date) return String(value);
	return date.toLocaleString('en-GB', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}

export function parseDate(value: unknown): Date | null {
	if (!value) return null;
	if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
	const date = new Date(String(value));
	return Number.isNaN(date.getTime()) ? null : date;
}

export function todayISO(): string {
	return new Date().toISOString().slice(0, 10);
}

export function initials(name: string | null | undefined): string {
	if (!name) return '?';
	return name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part.charAt(0).toUpperCase())
		.join('');
}

export function titleCase(value: string): string {
	return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export function truncate(value: string, max = 40): string {
	if (value.length <= max) return value;
	return value.slice(0, max - 1) + '…';
}

export function isValidEmail(value: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/** Indian mobile: optional +91 country code, then 10 digits. */
export function isValidIndianMobile(value: string): boolean {
	return /^(?:\+91[\s-]?)?[6-9]\d{9}$/.test(value.replace(/[\s-]/g, ''));
}

export function normalizeMobile(value: string): string {
	return value.replace(/[\s-]/g, '');
}

export function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

export function debounce<Args extends unknown[]>(
	fn: (...args: Args) => void,
	delay = 300
): (...args: Args) => void {
	let timer: ReturnType<typeof setTimeout> | undefined;
	return (...args) => {
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => fn(...args), delay);
	};
}