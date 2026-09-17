import { getContext, setContext } from 'svelte';

export interface UiState {
	sidebarOpen: boolean;
}

export function createUiState() {
	let sidebarOpen = $state(false);
	return {
		get sidebarOpen() {
			return sidebarOpen;
		},
		toggleSidebar() {
			sidebarOpen = !sidebarOpen;
		},
		closeSidebar() {
			sidebarOpen = false;
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