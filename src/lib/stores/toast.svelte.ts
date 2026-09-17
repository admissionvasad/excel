export interface ToastItem {
	id: number;
	type: 'success' | 'error' | 'warning' | 'info';
	message: string;
}

let counter = 0;

function createToastState() {
	const items = $state<ToastItem[]>([]);

	function push(type: ToastItem['type'], message: string) {
		const id = ++counter;
		items.push({ id, type, message });
		setTimeout(() => remove(id), 5000);
	}

	function remove(id: number) {
		const index = items.findIndex((item) => item.id === id);
		if (index !== -1) items.splice(index, 1);
	}

	return {
		get items() {
			return items;
		},
		success: (message: string) => push('success', message),
		error: (message: string) => push('error', message),
		warning: (message: string) => push('warning', message),
		info: (message: string) => push('info', message),
		remove
	};
}

export const toastState = createToastState();