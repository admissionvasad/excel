export const ROLES = [
	'SUPER_ADMIN',
	'COLLEGE_ADMIN',
	'PRINCIPAL',
	'VICE_PRINCIPAL',
	'REGISTRAR',
	'HOD',
	'ADMISSION_ADMIN',
	'ACADEMIC_ADMIN',
	'FACULTY',
	'ACCOUNTANT',
	'HR_ADMIN',
	'LIBRARIAN',
	'STORE_KEEPER',
	'PURCHASE_ADMIN',
	'MAINTENANCE_ADMIN',
	'TRANSPORT_ADMIN',
	'HOSTEL_ADMIN',
	'PLACEMENT_ADMIN',
	'STUDENT',
	'PARENT'
] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
	SUPER_ADMIN: 'Super Admin',
	COLLEGE_ADMIN: 'College Admin',
	PRINCIPAL: 'Principal',
	VICE_PRINCIPAL: 'Vice Principal',
	REGISTRAR: 'Registrar',
	HOD: 'Head of Department',
	ADMISSION_ADMIN: 'Admission Admin',
	ACADEMIC_ADMIN: 'Academic Admin',
	FACULTY: 'Faculty',
	ACCOUNTANT: 'Accountant',
	HR_ADMIN: 'HR Admin',
	LIBRARIAN: 'Librarian',
	STORE_KEEPER: 'Store Keeper',
	PURCHASE_ADMIN: 'Purchase Admin',
	MAINTENANCE_ADMIN: 'Maintenance Admin',
	TRANSPORT_ADMIN: 'Transport Admin',
	HOSTEL_ADMIN: 'Hostel Admin',
	PLACEMENT_ADMIN: 'Placement Admin',
	STUDENT: 'Student',
	PARENT: 'Parent'
};

export const PERMISSION_ACTIONS = [
	'view',
	'create',
	'edit',
	'delete',
	'approve',
	'reject',
	'export',
	'print',
	'import',
	'upload',
	'download'
] as const;

export type PermissionAction = (typeof PERMISSION_ACTIONS)[number];

export interface AuthContext {
	userId: string;
	email: string | null;
	fullName: string;
	role: Role;
	collegeId: string | null;
	collegeIds: string[];
	isSuperAdmin: boolean;
	permissions: string[];
}

export interface College {
	id: string;
	code: string;
	name: string;
	short_name: string;
	logo_url?: string | null;
	address?: string | null;
	city?: string | null;
	state?: string | null;
	pincode?: string | null;
	email?: string | null;
	phone?: string | null;
	website?: string | null;
	university?: string | null;
	affiliation?: string | null;
	gst_number?: string | null;
	primary_color?: string | null;
	academic_year?: string | null;
	timezone?: string | null;
	currency?: string | null;
	is_active: boolean;
}

export interface FieldOption {
	option_value: string;
	option_label: string;
	display_order?: number;
}

export interface FormField {
	id: string;
	form_id: string;
	section_id?: string | null;
	field_key: string;
	field_name: string;
	label: string;
	description?: string | null;
	placeholder?: string | null;
	field_type: string;
	data_type: string;
	is_required: boolean;
	is_unique: boolean;
	is_readonly: boolean;
	is_hidden: boolean;
	is_disabled: boolean;
	is_searchable: boolean;
	is_filterable: boolean;
	is_sortable?: boolean;
	default_value?: string | null;
	min_length?: number | null;
	max_length?: number | null;
	min_value?: number | null;
	max_value?: number | null;
	validation_regex?: string | null;
	validation_message?: string | null;
	display_order: number;
	row_number: number;
	column_number: number;
	column_span: number;
	options?: FieldOption[];
	data_source_type?: string | null;
	data_source_config?: Record<string, unknown> | null;
}

export interface FormSection {
	id: string;
	form_id: string;
	name: string;
	label: string;
	description?: string | null;
	display_order: number;
	columns: number;
	is_active: boolean;
	fields: FormField[];
}

export interface FormDefinition {
	id: string;
	college_id: string | null;
	module_id?: string | null;
	name: string;
	code: string;
	title: string;
	description?: string | null;
	version: number;
	is_active: boolean;
	is_system: boolean;
	sections: FormSection[];
}

export interface TableColumn {
	id: string;
	table_id: string;
	field_key: string;
	label: string;
	data_type: string;
	width?: number | null;
	display_order: number;
	sortable: boolean;
	searchable: boolean;
	filterable: boolean;
	visible: boolean;
	formatter?: string | null;
	options?: FieldOption[];
}

export interface TableDefinition {
	id: string;
	college_id: string | null;
	module_id?: string | null;
	name: string;
	code: string;
	title: string;
	source_type: string;
	source_config?: Record<string, unknown> | null;
	is_active: boolean;
	columns: TableColumn[];
	actions: TableAction[];
}

export interface TableAction {
	id: string;
	table_id: string;
	action_key: string;
	label: string;
	icon?: string | null;
	action_type: string;
	required_permission?: string | null;
	display_order: number;
	is_active: boolean;
}

export interface CustomModule {
	id: string;
	college_id: string | null;
	name: string;
	code: string;
	icon?: string | null;
	description?: string | null;
	is_system: boolean;
	is_active: boolean;
	form_id?: string | null;
	table_id?: string | null;
}

export interface ModuleConfig {
	key: string;
	label: string;
	group: string;
	table: string;
	icon?: string;
	description?: string;
	titleField: string;
	searchFields: string[];
	defaultSort?: { column: string; ascending: boolean };
	fields: ModuleField[];
	softDelete?: boolean;
	scoped: boolean;
	system?: boolean;
}

export interface ModuleField {
	key: string;
	label: string;
	type:
		| 'text'
		| 'textarea'
		| 'number'
		| 'decimal'
		| 'currency'
		| 'email'
		| 'mobile'
		| 'date'
		| 'time'
		| 'datetime'
		| 'checkbox'
		| 'select'
		| 'multiselect'
		| 'file'
		| 'hidden'
		| 'color'
		| 'url';
	required?: boolean;
	unique?: boolean;
	readonly?: boolean;
	searchable?: boolean;
	sortable?: boolean;
	filterable?: boolean;
	options?: { value: string; label: string }[];
	optionSource?: string;
	placeholder?: string;
	help?: string;
	defaultValue?: unknown;
	min?: number;
	max?: number;
	step?: number;
	colSpan?: number;
	section?: string;
	showIf?: { field: string; equals: unknown };
	formula?: string;
}

export interface QueryOptions {
	select?: string;
	filters?: Record<string, unknown>;
	search?: string;
	searchFields?: string[];
	sort?: { column: string; ascending: boolean };
	page?: number;
	pageSize?: number;
	includeDeleted?: boolean;
}

export interface Paginated<T = Record<string, unknown>> {
	rows: T[];
	total: number;
	page: number;
	pageSize: number;
	pageCount: number;
}
