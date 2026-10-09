import { getContext, setContext } from 'svelte';

export interface UiState {
	sidebarOpen: boolean;
	toggle(): void;
	close(): void;
	open(): void;
}

export function createUiState(): UiState {
	let sidebarOpen = $state(false);
	return {
		get sidebarOpen() {
			return sidebarOpen;
		},
		toggle() {
			sidebarOpen = !sidebarOpen;
		},
		close() {
			sidebarOpen = false;
		},
		open() {
			sidebarOpen = true;
		}
	};
}

const UI_KEY = Symbol('erp-ui');

export function setUiContext(state = createUiState()) {
	return setContext(UI_KEY, state);
}

export function getUiContext() {
	return getContext<ReturnType<typeof createUiState>>(UI_KEY);
}

export const sidebarState = createUiState();
