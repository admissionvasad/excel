import { getContext, setContext } from 'svelte';

export const LANGUAGES = ['en', 'gu'] as const;
export type Language = (typeof LANGUAGES)[number];

export const translations: Record<Language, Record<string, string>> = {
	en: {
		app_name: 'College ERP',
		dashboard: 'Dashboard',
		login: 'Login',
		logout: 'Logout',
		email: 'Email',
		password: 'Password',
		college: 'College',
		role: 'Role',
		forgot_password: 'Forgot Password',
		back_to_login: 'Back to Login',
		forgot_password_title: 'Reset your password',
		forgot_password_hint: 'Enter your email and we will send you a reset link.',
		send_reset_link: 'Send Reset Link',
		student: 'Student',
		students: 'Students',
		employee: 'Employee',
		employees: 'Employees',
		search: 'Search',
		settings: 'Settings',
		profile: 'Profile',
		notifications: 'Notifications',
		reports: 'Reports',
		audit_logs: 'Audit Logs',
		save: 'Save',
		cancel: 'Cancel',
		add: 'Add',
		edit: 'Edit',
		delete: 'Delete',
		view: 'View',
		actions: 'Actions',
		confirm: 'Confirm',
		are_you_sure: 'Are you sure?',
		loading: 'Loading…',
		export: 'Export',
		print: 'Print',
		no_records: 'No records found',
		welcome: 'Welcome',
		total_students: 'Total Students',
		total_employees: 'Total Employees',
		total_faculty: 'Total Faculty',
		total_departments: 'Total Departments',
		colleges: 'Colleges',
		active: 'Active',
		inactive: 'Inactive',
		status: 'Status'
	},
	gu: {
		app_name: 'કૉલેજ ERP',
		dashboard: 'ડેશબોર્ડ',
		login: 'લૉગિન',
		logout: 'લૉગઆઉટ',
		email: 'ઈમેલ',
		password: 'પાસવર્ડ',
		college: 'કૉલેજ',
		role: 'ભૂમિકા',
		forgot_password: 'પાસવર્ડ ભૂલી ગયા છો?',
		back_to_login: 'લૉગિન પર પાછા',
		forgot_password_title: 'પાસવર્ડ ફરી સેટ કરો',
		send_reset_link: 'લિંક મોકલો',
		student: 'વિદ્યાર્થી',
		students: 'વિદ્યાર્થીઓ',
		employee: 'કર્મચારી',
		employees: 'કર્મચારીઓ',
		search: 'શોધો',
		settings: 'સેટિંગ્સ',
		profile: 'પ્રોફાઇલ',
		notifications: 'સૂચનાઓ',
		reports: 'રિપોર્ટ્સ',
		save: 'સાચવો',
		cancel: 'રદ કરો',
		add: 'ઉમેરો',
		edit: 'સંપાદિત કરો',
		delete: 'કાઢી નાખો',
		view: 'જુઓ',
		actions: 'ક્રિયાઓ',
		confirm: 'પુષ્ટિ કરો',
		are_you_sure: 'તમને ખાતરી છે?',
		loading: 'લોડ થઈ રહ્યું છે…',
		export: 'એક્સપોર્ટ',
		print: 'પ્રિન્ટ',
		no_records: 'કોઈ રેકોર્ડ મળ્યા નથી',
		welcome: 'સ્વાગત છે',
		total_students: 'કુલ વિદ્યાર્થીઓ',
		total_employees: 'કુલ કર્મચારીઓ',
		total_faculty: 'કુલ ફેકલ્ટી',
		total_departments: 'કુલ વિભાગો',
		colleges: 'કૉલેજો',
		active: 'સક્રિય',
		inactive: 'નિષ્ક્રિય',
		status: 'સ્થિતિ'
	}
};

const LANG_KEY = 'erp-lang';

export function createI18nState(lang: Language = 'en') {
	let current = $state<Language>(lang);

	function set(language: Language) {
		current = language;
		if (typeof window !== 'undefined') window.localStorage.setItem(LANG_KEY, language);
	}

	function t(key: string, fallback?: string): string {
		return translations[current][key] ?? fallback ?? key;
	}

	return {
		get lang() {
			return current;
		},
		set,
		t
	};
}

const I18N_KEY = Symbol('erp-i18n');

export function setI18nContext(state = createI18nState()) {
	return setContext(I18N_KEY, state);
}

export function getI18nContext() {
	return getContext<ReturnType<typeof createI18nState>>(I18N_KEY);
}