import { getContext, setContext } from 'svelte';

const STORAGE_KEY = 'erp-theme';

export type Theme = 'light' | 'dark' | 'system';

function resolveTheme(theme: Theme): 'light' | 'dark' {
	if (theme === 'system') {
		return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: 'light';
	}
	return theme;
}

export function createThemeState() {
	let theme = $state<Theme>(loadSavedTheme());
	let applied = $state<'light' | 'dark'>(resolveTheme(theme));

	function loadSavedTheme(): Theme {
		if (typeof window === 'undefined') return 'system';
		const saved = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
		return saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system';
	}

	function apply(value: Theme) {
		applied = resolveTheme(value);
		if (typeof window !== 'undefined') {
			document.documentElement.dataset.theme = applied;
			window.localStorage.setItem(STORAGE_KEY, value);
		}
	}

	function set(value: Theme) {
		theme = value;
		apply(value);
	}

	if (typeof window !== 'undefined') {
		const media = window.matchMedia('(prefers-color-scheme: dark)');
		media.addEventListener('change', () => {
			if (theme === 'system') apply('system');
		});
		apply(theme);
	}

	return {
		get theme() {
			return theme;
		},
		get applied() {
			return applied;
		},
		set
	};
}

const THEME_KEY = Symbol('erp-theme');

export function setThemeContext(state = createThemeState()) {
	return setContext(THEME_KEY, state);
}

export function getThemeContext() {
	return getContext<ReturnType<typeof createThemeState>>(THEME_KEY);
}

/** Singleton theme state for use outside component context. */
export const themeState = createThemeState();