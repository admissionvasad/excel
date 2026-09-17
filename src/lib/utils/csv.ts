export function toCsv(rows: Record<string, unknown>[], columns: { key: string; label: string }[]): string {
	const escape = (value: unknown) => {
		const text = value === null || value === undefined ? '' : String(value);
		return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
	};
	const header = columns.map((column) => escape(column.label)).join(',');
	const body = rows
		.map((row) => columns.map((column) => escape(row[column.key])).join(','))
		.join('\n');
	return `${header}\n${body}`;
}

export function downloadText(filename: string, content: string, mime = 'text/csv;charset=utf-8') {
	const blob = new Blob([content], { type: mime });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement('a');
	anchor.href = url;
	anchor.download = filename;
	document.body.appendChild(anchor);
	anchor.click();
	document.body.removeChild(anchor);
	URL.revokeObjectURL(url);
}