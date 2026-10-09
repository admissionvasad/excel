import type { ModuleConfig, ModuleField } from '$lib/types';

const statusOptions = [
	{ value: 'Active', label: 'Active' },
	{ value: 'Inactive', label: 'Inactive' }
];

const approvalStatus = [
	{ value: 'Draft', label: 'Draft' },
	{ value: 'Pending', label: 'Pending' },
	{ value: 'Approved', label: 'Approved' },
	{ value: 'Rejected', label: 'Rejected' },
	{ value: 'Cancelled', label: 'Cancelled' }
];

const collegeField = (overrides: Partial<ModuleField> = {}): ModuleField => ({
	key: 'college_id',
	label: 'College',
	type: 'select',
	optionSource: 'colleges',
	filterable: true,
	...overrides
});

const departmentField = (overrides: Partial<ModuleField> = {}): ModuleField => ({
	key: 'department_id',
	label: 'Department',
	type: 'select',
	optionSource: 'departments',
	filterable: true,
	...overrides
});

const actorField: ModuleField = {
	key: 'actor_email',
	label: 'Performed By',
	type: 'text',
	readonly: true
};

/**
 * Additional modules that extend the core registry. These cover the broader
 * platform specification: organisation/campus master, punching machine,
 * attendance rules, dynamic form/table/report builders, merit & salary rule
 * engines, receipt series, document/notification management and configuration.
 */
export const EXTRA_MODULES: Record<string, ModuleConfig> = {
	organizations: {
		key: 'organizations',
		label: 'Organizations',
		group: 'Organization',
		table: 'organizations',
		titleField: 'name',
		searchFields: ['name', 'code'],
		scoped: false,
		fields: [
			{
				key: 'code',
				label: 'Organization Code',
				type: 'text',
				required: true,
				unique: true,
				searchable: true
			},
			{
				key: 'name',
				label: 'Organization / Trust Name',
				type: 'text',
				required: true,
				searchable: true
			},
			{ key: 'registration_number', label: 'Registration Number', type: 'text' },
			{ key: 'email', label: 'Email', type: 'email' },
			{ key: 'phone', label: 'Contact Number', type: 'mobile' },
			{ key: 'website', label: 'Website', type: 'url' },
			{ key: 'address', label: 'Address', type: 'textarea' },
			{
				key: 'status',
				label: 'Status',
				type: 'select',
				options: statusOptions,
				defaultValue: 'Active',
				filterable: true
			}
		]
	},

	colleges: {
		key: 'colleges',
		label: 'Colleges',
		group: 'Organization',
		table: 'colleges',
		titleField: 'name',
		searchFields: ['name', 'code', 'city'],
		softDelete: true,
		scoped: false,
		fields: [
			{
				key: 'organization_id',
				label: 'Organization',
				type: 'select',
				optionSource: 'organizations'
			},
			{
				key: 'code',
				label: 'College Code',
				type: 'text',
				required: true,
				unique: true,
				searchable: true
			},
			{ key: 'name', label: 'College Name', type: 'text', required: true, searchable: true },
			{ key: 'short_name', label: 'Short Name', type: 'text' },
			{ key: 'logo_url', label: 'Logo URL', type: 'text' },
			{ key: 'principal_name', label: 'Principal', type: 'text' },
			{ key: 'university', label: 'Affiliating University', type: 'text' },
			{ key: 'email', label: 'Email', type: 'email' },
			{ key: 'phone', label: 'Contact Number', type: 'mobile' },
			{ key: 'website', label: 'Website', type: 'url' },
			{ key: 'address', label: 'Address', type: 'textarea' },
			{ key: 'city', label: 'City', type: 'text', filterable: true },
			{ key: 'state', label: 'State', type: 'text' },
			{ key: 'primary_color', label: 'Theme Color', type: 'color' },
			{ key: 'academic_year', label: 'Current Academic Year', type: 'text' },
			{
				key: 'status',
				label: 'Status',
				type: 'select',
				options: statusOptions,
				defaultValue: 'Active',
				filterable: true
			}
		]
	},

	campuses: {
		key: 'campuses',
		label: 'Campuses',
		group: 'Organization',
		table: 'campuses',
		titleField: 'name',
		searchFields: ['name', 'code'],
		defaultSort: { column: 'created_at', ascending: false },
		scoped: true,
		fields: [
			collegeField({ required: true }),
			{ key: 'code', label: 'Campus Code', type: 'text', required: true, searchable: true },
			{ key: 'name', label: 'Campus Name', type: 'text', required: true, searchable: true },
			{ key: 'address', label: 'Address', type: 'textarea' },
			{ key: 'city', label: 'City', type: 'text' },
			{ key: 'phone', label: 'Contact Number', type: 'mobile' },
			{
				key: 'status',
				label: 'Status',
				type: 'select',
				options: statusOptions,
				defaultValue: 'Active',
				filterable: true
			}
		]
	},

	profiles: {
		key: 'profiles',
		label: 'Users',
		group: 'Organization',
		table: 'profiles',
		titleField: 'full_name',
		searchFields: ['full_name', 'email', 'role'],
		softDelete: true,
		scoped: true,
		fields: [
			{ key: 'full_name', label: 'Full Name', type: 'text', required: true, searchable: true },
			{ key: 'email', label: 'Email', type: 'email', required: true, searchable: true },
			{
				key: 'role',
				label: 'Role',
				type: 'select',
				required: true,
				filterable: true,
				options: [
					{ value: 'SUPER_ADMIN', label: 'Super Admin' },
					{ value: 'COLLEGE_ADMIN', label: 'College Admin' },
					{ value: 'PRINCIPAL', label: 'Principal' },
					{ value: 'HOD', label: 'HOD' },
					{ value: 'ADMISSION_ADMIN', label: 'Admission Admin' },
					{ value: 'ACADEMIC_ADMIN', label: 'Academic Admin' },
					{ value: 'FACULTY', label: 'Faculty' },
					{ value: 'ACCOUNTANT', label: 'Accounts Admin' },
					{ value: 'HR_ADMIN', label: 'HR Admin' },
					{ value: 'LIBRARIAN', label: 'Library Admin' },
					{ value: 'STORE_KEEPER', label: 'Store Incharge' },
					{ value: 'STUDENT', label: 'Student' }
				]
			},
			collegeField({}),
			departmentField({}),
			{ key: 'phone', label: 'Mobile', type: 'mobile' },
			{ key: 'is_active', label: 'Active', type: 'checkbox', defaultValue: true }
		]
	},

	time_slots: {
		key: 'time_slots',
		label: 'Time Slots',
		group: 'Academics',
		table: 'time_slots',
		titleField: 'label',
		searchFields: ['label'],
		defaultSort: { column: 'start_time', ascending: true },
		scoped: true,
		fields: [
			collegeField({ required: true }),
			{
				key: 'label',
				label: 'Slot Label',
				type: 'text',
				required: true,
				searchable: true,
				placeholder: 'Class 1 / Recess'
			},
			{ key: 'start_time', label: 'Start Time', type: 'time', required: true },
			{ key: 'end_time', label: 'End Time', type: 'time', required: true },
			{
				key: 'slot_type',
				label: 'Slot Type',
				type: 'select',
				options: [
					{ value: 'Lecture', label: 'Lecture' },
					{ value: 'Break', label: 'Recess / Break' },
					{ value: 'Punch', label: 'Punch In/Out' },
					{ value: 'Other', label: 'Other' }
				],
				defaultValue: 'Lecture',
				filterable: true
			},
			{ key: 'display_order', label: 'Display Order', type: 'number', defaultValue: 1 },
			{ key: 'is_active', label: 'Active', type: 'checkbox', defaultValue: true }
		]
	},

	machines: {
		key: 'machines',
		label: 'Punching Machines',
		group: 'Punching & Attendance',
		table: 'machines',
		titleField: 'name',
		searchFields: ['name', 'machine_id', 'serial_number', 'ip_address'],
		softDelete: true,
		scoped: true,
		fields: [
			collegeField({ required: true }),
			{ key: 'name', label: 'Machine Name', type: 'text', required: true, searchable: true },
			{ key: 'machine_id', label: 'Machine ID', type: 'text', searchable: true },
			{ key: 'serial_number', label: 'Serial Number', type: 'text', searchable: true },
			{ key: 'vendor', label: 'Vendor', type: 'text', filterable: true },
			{
				key: 'protocol',
				label: 'Protocol / API Type',
				type: 'select',
				options: [
					{ value: 'REST API', label: 'REST API' },
					{ value: 'Vendor API', label: 'Vendor API' },
					{ value: 'SDK', label: 'SDK' },
					{ value: 'Device DB', label: 'Device Database' },
					{ value: 'CSV', label: 'CSV Import' },
					{ value: 'Excel', label: 'Excel Import' },
					{ value: 'Manual', label: 'Manual' },
					{ value: 'LAN/HTTP', label: 'LAN / HTTP' }
				],
				defaultValue: 'CSV',
				filterable: true
			},
			{ key: 'ip_address', label: 'IP Address', type: 'text' },
			{ key: 'port', label: 'Port', type: 'number', min: 1, max: 65535 },
			{ key: 'location', label: 'Location', type: 'text' },
			{
				key: 'sync_interval_minutes',
				label: 'Sync Interval (min)',
				type: 'number',
				defaultValue: 15
			},
			{ key: 'last_sync_at', label: 'Last Sync', type: 'datetime', readonly: true },
			{
				key: 'status',
				label: 'Status',
				type: 'select',
				options: statusOptions,
				defaultValue: 'Active',
				filterable: true
			}
		]
	},

	machine_punches: {
		key: 'machine_punches',
		label: 'Punch Records',
		group: 'Punching & Attendance',
		table: 'machine_punches',
		titleField: 'biometric_employee_id',
		searchFields: ['biometric_employee_id', 'employee_id'],
		defaultSort: { column: 'punch_date', ascending: false },
		scoped: true,
		fields: [
			{
				key: 'biometric_employee_id',
				label: 'Biometric ID',
				type: 'text',
				required: true,
				searchable: true
			},
			{
				key: 'employee_id',
				label: 'Employee',
				type: 'select',
				optionSource: 'employees',
				filterable: true
			},
			{
				key: 'machine_id',
				label: 'Machine',
				type: 'select',
				optionSource: 'machines',
				filterable: true
			},
			{ key: 'punch_date', label: 'Punch Date', type: 'date', required: true, filterable: true },
			{ key: 'punch_time', label: 'Punch Time', type: 'time', required: true },
			{
				key: 'punch_type',
				label: 'IN / OUT',
				type: 'select',
				options: [
					{ value: 'IN', label: 'IN' },
					{ value: 'OUT', label: 'OUT' }
				],
				filterable: true
			},
			{ key: 'raw_data', label: 'Raw Data', type: 'textarea' },
			{
				key: 'sync_status',
				label: 'Sync Status',
				type: 'select',
				options: [
					{ value: 'Imported', label: 'Imported' },
					{ value: 'Processed', label: 'Processed' },
					{ value: 'Error', label: 'Error' }
				],
				defaultValue: 'Imported',
				filterable: true
			}
		]
	},

	attendance_rules: {
		key: 'attendance_rules',
		label: 'Attendance Rules',
		group: 'Punching & Attendance',
		table: 'attendance_rules',
		titleField: 'name',
		searchFields: ['name'],
		scoped: true,
		fields: [
			collegeField({ required: true }),
			{ key: 'name', label: 'Rule Name', type: 'text', required: true, searchable: true },
			{
				key: 'employee_type',
				label: 'Applies To',
				type: 'select',
				options: [
					{ value: 'All', label: 'All Employees' },
					{ value: 'Teaching', label: 'Teaching' },
					{ value: 'Non-Teaching', label: 'Non-Teaching' },
					{ value: 'Visiting Faculty', label: 'Visiting Faculty' }
				],
				defaultValue: 'All',
				filterable: true
			},
			{ key: 'office_start_time', label: 'Office Start Time', type: 'time', defaultValue: '09:30' },
			{
				key: 'grace_minutes',
				label: 'Grace Period (min)',
				type: 'number',
				defaultValue: 10,
				min: 0
			},
			{ key: 'office_end_time', label: 'Office End Time', type: 'time', defaultValue: '16:30' },
			{
				key: 'minimum_hours',
				label: 'Minimum Working Hours',
				type: 'decimal',
				defaultValue: 8,
				min: 0
			},
			{ key: 'half_day_hours', label: 'Half Day Hours', type: 'decimal', defaultValue: 4, min: 0 },
			{
				key: 'late_threshold_minutes',
				label: 'Late Threshold (min)',
				type: 'number',
				defaultValue: 15
			},
			{
				key: 'early_leave_threshold',
				label: 'Early Leave Threshold (min)',
				type: 'number',
				defaultValue: 15
			},
			{
				key: 'overtime_start_hours',
				label: 'Overtime After (hrs)',
				type: 'decimal',
				defaultValue: 9,
				min: 0
			},
			{
				key: 'weekly_off',
				label: 'Weekly Off',
				type: 'select',
				options: [
					{ value: 'Sunday', label: 'Sunday' },
					{ value: 'Saturday,Sunday', label: 'Sat + Sun' },
					{ value: 'None', label: 'None' }
				],
				defaultValue: 'Sunday'
			},
			{ key: 'effective_from', label: 'Effective From', type: 'date' },
			{ key: 'effective_to', label: 'Effective To', type: 'date' },
			{
				key: 'status',
				label: 'Status',
				type: 'select',
				options: statusOptions,
				defaultValue: 'Active',
				filterable: true
			}
		]
	},

	leave_types: {
		key: 'leave_types',
		label: 'Leave Types',
		group: 'Punching & Attendance',
		table: 'leave_types',
		titleField: 'name',
		searchFields: ['name'],
		scoped: true,
		fields: [
			collegeField({}),
			{ key: 'name', label: 'Leave Type', type: 'text', required: true, searchable: true },
			{ key: 'code', label: 'Code', type: 'text' },
			{ key: 'annual_quota', label: 'Annual Quota (days)', type: 'decimal', min: 0 },
			{ key: 'carry_forward', label: 'Carry Forward', type: 'checkbox' },
			{ key: 'max_consecutive_days', label: 'Max Consecutive Days', type: 'number', min: 1 },
			{ key: 'requires_document', label: 'Requires Document', type: 'checkbox' },
			{ key: 'paid', label: 'Paid Leave', type: 'checkbox', defaultValue: true },
			{
				key: 'status',
				label: 'Status',
				type: 'select',
				options: statusOptions,
				defaultValue: 'Active'
			}
		]
	},

	lecture_records: {
		key: 'lecture_records',
		label: 'Lecture Records',
		group: 'Punching & Attendance',
		table: 'lecture_records',
		titleField: 'subject_id',
		searchFields: [],
		defaultSort: { column: 'lecture_date', ascending: false },
		scoped: true,
		fields: [
			{ key: 'lecture_date', label: 'Date', type: 'date', required: true, filterable: true },
			{
				key: 'employee_id',
				label: 'Faculty',
				type: 'select',
				optionSource: 'employees',
				required: true,
				filterable: true
			},
			{
				key: 'subject_id',
				label: 'Subject',
				type: 'select',
				optionSource: 'subjects',
				required: true
			},
			{ key: 'programme_id', label: 'Programme', type: 'select', optionSource: 'programmes' },
			{ key: 'semester', label: 'Semester', type: 'number', min: 1, max: 12 },
			{ key: 'division', label: 'Division', type: 'text' },
			{ key: 'time_slot_id', label: 'Time Slot', type: 'select', optionSource: 'time_slots' },
			{
				key: 'lecture_type',
				label: 'Lecture Type',
				type: 'select',
				options: [
					{ value: 'Theory', label: 'Theory' },
					{ value: 'Practical', label: 'Practical' },
					{ value: 'Tutorial', label: 'Tutorial' },
					{ value: 'Project', label: 'Project' }
				],
				defaultValue: 'Theory'
			},
			{ key: 'lecture_hours', label: 'Lecture Hours', type: 'decimal', defaultValue: 1, min: 0 },
			{
				key: 'status',
				label: 'Status',
				type: 'select',
				options: [
					{ value: 'Scheduled', label: 'Scheduled' },
					{ value: 'Conducted', label: 'Conducted' },
					{ value: 'Cancelled', label: 'Cancelled' },
					{ value: 'Substituted', label: 'Substituted' },
					{ value: 'Rescheduled', label: 'Rescheduled' },
					{ value: 'Not Conducted', label: 'Not Conducted' },
					{ value: 'Approved', label: 'Approved' },
					{ value: 'Rejected', label: 'Rejected' }
				],
				defaultValue: 'Scheduled',
				filterable: true
			},
			actorField,
			{ key: 'approved_by', label: 'Approved By', type: 'select', optionSource: 'employees' },
			{ key: 'remarks', label: 'Remarks', type: 'textarea' }
		]
	},

	admission_forms: {
		key: 'admission_forms',
		label: 'Admission Forms',
		group: 'Admissions & Merit',
		table: 'admission_forms',
		titleField: 'name',
		searchFields: ['name', 'code'],
		softDelete: true,
		scoped: true,
		fields: [
			collegeField({ required: true }),
			{ key: 'name', label: 'Form Name', type: 'text', required: true, searchable: true },
			{ key: 'code', label: 'Form Code', type: 'text', searchable: true },
			{
				key: 'admission_type',
				label: 'Admission Type',
				type: 'select',
				options: [
					{ value: 'ACPC', label: 'ACPC' },
					{ value: 'ACPDC', label: 'ACPDC' },
					{ value: 'GCAS', label: 'GCAS' },
					{ value: 'Management Quota', label: 'Management Quota / MQ' },
					{ value: 'VQ', label: 'VQ' },
					{ value: 'NRI', label: 'NRI' },
					{ value: 'University', label: 'University' },
					{ value: 'Other', label: 'Other' }
				],
				required: true,
				filterable: true
			},
			{ key: 'version', label: 'Version', type: 'number', defaultValue: 1, min: 1 },
			{ key: 'description', label: 'Description', type: 'textarea' },
			{ key: 'is_published', label: 'Published', type: 'checkbox', defaultValue: false },
			{
				key: 'status',
				label: 'Status',
				type: 'select',
				options: statusOptions,
				defaultValue: 'Active',
				filterable: true
			}
		]
	},

	admission_fields: {
		key: 'admission_fields',
		label: 'Form Fields',
		group: 'Admissions & Merit',
		table: 'admission_fields',
		titleField: 'label',
		searchFields: ['label', 'field_name'],
		defaultSort: { column: 'display_order', ascending: true },
		scoped: true,
		fields: [
			{
				key: 'form_id',
				label: 'Form',
				type: 'select',
				optionSource: 'admission_forms',
				required: true,
				filterable: true
			},
			{ key: 'label', label: 'Label', type: 'text', required: true, searchable: true },
			{ key: 'field_name', label: 'Field Name', type: 'text', required: true, searchable: true },
			{
				key: 'field_type',
				label: 'Field Type',
				type: 'select',
				required: true,
				filterable: true,
				options: [
					{ value: 'text', label: 'Text' },
					{ value: 'textarea', label: 'Textarea' },
					{ value: 'number', label: 'Number' },
					{ value: 'date', label: 'Date' },
					{ value: 'time', label: 'Time' },
					{ value: 'select', label: 'Dropdown' },
					{ value: 'radio', label: 'Radio' },
					{ value: 'checkbox', label: 'Checkbox' },
					{ value: 'multiselect', label: 'Multi Select' },
					{ value: 'file', label: 'File' },
					{ value: 'image', label: 'Image' },
					{ value: 'email', label: 'Email' },
					{ value: 'phone', label: 'Phone' },
					{ value: 'currency', label: 'Currency' },
					{ value: 'percentage', label: 'Percentage' },
					{ value: 'table', label: 'Table' }
				]
			},
			{ key: 'is_required', label: 'Required', type: 'checkbox' },
			{ key: 'default_value', label: 'Default Value', type: 'text' },
			{ key: 'validation_rule', label: 'Validation', type: 'text' },
			{ key: 'min_value', label: 'Min', type: 'decimal' },
			{ key: 'max_value', label: 'Max', type: 'decimal' },
			{ key: 'options', label: 'Options (comma separated)', type: 'textarea' },
			{
				key: 'visibility_rule',
				label: 'Visibility Rule',
				type: 'text',
				placeholder: 'Admission Type = NRI'
			},
			{ key: 'is_readonly', label: 'Read Only', type: 'checkbox' },
			{ key: 'help_text', label: 'Help Text', type: 'text' },
			{ key: 'display_order', label: 'Display Order', type: 'number', defaultValue: 1 }
		]
	},

	merit_rules: {
		key: 'merit_rules',
		label: 'Merit Rules',
		group: 'Admissions & Merit',
		table: 'merit_rules',
		titleField: 'name',
		searchFields: ['name'],
		softDelete: true,
		scoped: true,
		fields: [
			collegeField({ required: true }),
			{ key: 'name', label: 'Rule Name', type: 'text', required: true, searchable: true },
			{ key: 'programme_id', label: 'Programme', type: 'select', optionSource: 'programmes' },
			{
				key: 'admission_type',
				label: 'Admission Type',
				type: 'select',
				options: [
					{ value: 'ACPC', label: 'ACPC' },
					{ value: 'ACPDC', label: 'ACPDC' },
					{ value: 'GCAS', label: 'GCAS' },
					{ value: 'Management Quota', label: 'Management Quota / MQ' },
					{ value: 'VQ', label: 'VQ' },
					{ value: 'NRI', label: 'NRI' },
					{ value: 'University', label: 'University' },
					{ value: 'Other', label: 'Other' }
				],
				required: true,
				filterable: true
			},
			{
				key: 'academic_year_id',
				label: 'Academic Year',
				type: 'select',
				optionSource: 'academic_years'
			},
			{
				key: 'selected_subjects',
				label: 'Selected Subjects (comma separated)',
				type: 'textarea',
				placeholder: 'Physics, Chemistry, Mathematics'
			},
			{
				key: 'calculation_formula',
				label: 'Calculation Formula',
				type: 'textarea',
				placeholder: 'PCM + GUJCET percentile * 0.5'
			},
			{ key: 'minimum_eligibility', label: 'Minimum Eligibility', type: 'text' },
			{ key: 'effective_from', label: 'Effective From', type: 'date' },
			{ key: 'effective_to', label: 'Effective To', type: 'date' },
			{ key: 'reference_document_url', label: 'Reference Document URL', type: 'text' },
			{
				key: 'status',
				label: 'Status',
				type: 'select',
				options: statusOptions,
				defaultValue: 'Active',
				filterable: true
			}
		]
	},

	fee_heads: {
		key: 'fee_heads',
		label: 'Fee Heads',
		group: 'Fees & Accounts',
		table: 'fee_heads',
		titleField: 'name',
		searchFields: ['name', 'code'],
		scoped: true,
		fields: [
			collegeField({}),
			{
				key: 'code',
				label: 'Head Code',
				type: 'text',
				required: true,
				unique: true,
				searchable: true
			},
			{ key: 'name', label: 'Fee Head', type: 'text', required: true, searchable: true },
			{
				key: 'category',
				label: 'Category',
				type: 'select',
				options: [
					{ value: 'Tuition', label: 'Tuition' },
					{ value: 'Development', label: 'Development' },
					{ value: 'Examination', label: 'Examination' },
					{ value: 'Library', label: 'Library' },
					{ value: 'Laboratory', label: 'Laboratory' },
					{ value: 'Hostel', label: 'Hostel' },
					{ value: 'Transport', label: 'Transport' },
					{ value: 'Other', label: 'Other' }
				],
				required: true,
				filterable: true
			},
			{ key: 'is_refundable', label: 'Refundable', type: 'checkbox' },
			{
				key: 'is_recurring',
				label: 'Recurring (per semester)',
				type: 'checkbox',
				defaultValue: true
			},
			{
				key: 'status',
				label: 'Status',
				type: 'select',
				options: statusOptions,
				defaultValue: 'Active'
			}
		]
	},

	receipt_series: {
		key: 'receipt_series',
		label: 'Receipt Numbering',
		group: 'Fees & Accounts',
		table: 'receipt_series',
		titleField: 'name',
		searchFields: ['name', 'prefix'],
		scoped: true,
		fields: [
			collegeField({ required: true }),
			{ key: 'name', label: 'Series Name', type: 'text', required: true, searchable: true },
			{ key: 'department_id', label: 'Department', type: 'select', optionSource: 'departments' },
			{ key: 'fee_type', label: 'Fee Type', type: 'text' },
			{ key: 'academic_year', label: 'Academic Year', type: 'text' },
			{ key: 'prefix', label: 'Prefix', type: 'text', required: true, placeholder: 'ENG/2026/' },
			{ key: 'suffix', label: 'Suffix', type: 'text' },
			{ key: 'pad_length', label: 'Padding Length', type: 'number', defaultValue: 5, min: 1 },
			{ key: 'next_number', label: 'Next Number', type: 'number', defaultValue: 1, min: 1 },
			{
				key: 'status',
				label: 'Status',
				type: 'select',
				options: statusOptions,
				defaultValue: 'Active'
			}
		]
	},

	salary_rules: {
		key: 'salary_rules',
		label: 'Salary Rules',
		group: 'Payroll',
		table: 'salary_rules',
		titleField: 'name',
		searchFields: ['name'],
		softDelete: true,
		scoped: true,
		fields: [
			collegeField({ required: true }),
			{ key: 'name', label: 'Rule Name', type: 'text', required: true, searchable: true },
			{
				key: 'faculty_type',
				label: 'Faculty Type',
				type: 'select',
				options: [
					{ value: 'Regular', label: 'Regular Faculty' },
					{ value: 'Visiting', label: 'Visiting Faculty' },
					{ value: 'Guest', label: 'Guest Faculty' },
					{ value: 'Ad-hoc', label: 'Ad-hoc Faculty' },
					{ value: 'Contract', label: 'Contract Faculty' },
					{ value: 'Part-Time', label: 'Part-Time Faculty' },
					{ value: 'Non-Teaching', label: 'Non-Teaching' }
				],
				required: true,
				filterable: true
			},
			departmentField({}),
			{
				key: 'calculation_type',
				label: 'Calculation Type',
				type: 'select',
				options: [
					{ value: 'Monthly', label: 'Monthly' },
					{ value: 'Daily', label: 'Daily' },
					{ value: 'Hourly', label: 'Hourly' },
					{ value: 'Per Lecture', label: 'Per Lecture' },
					{ value: 'Fixed', label: 'Fixed' },
					{ value: 'Percentage', label: 'Percentage' },
					{ value: 'Custom Formula', label: 'Custom Formula' }
				],
				required: true,
				filterable: true
			},
			{
				key: 'formula',
				label: 'Formula',
				type: 'textarea',
				placeholder: 'basic + allowance - deduction'
			},
			{
				key: 'approval_required',
				label: 'Approval Required',
				type: 'checkbox',
				defaultValue: true
			},
			{ key: 'effective_from', label: 'Effective From', type: 'date', required: true },
			{ key: 'effective_to', label: 'Effective To', type: 'date' },
			{ key: 'version', label: 'Version', type: 'number', defaultValue: 1, min: 1 },
			{
				key: 'status',
				label: 'Status',
				type: 'select',
				options: statusOptions,
				defaultValue: 'Active',
				filterable: true
			}
		]
	},

	salary_rule_components: {
		key: 'salary_rule_components',
		label: 'Salary Components',
		group: 'Payroll',
		table: 'salary_rule_components',
		titleField: 'name',
		searchFields: ['name'],
		scoped: true,
		fields: [
			{
				key: 'salary_rule_id',
				label: 'Salary Rule',
				type: 'select',
				optionSource: 'salary_rules',
				required: true,
				filterable: true
			},
			{ key: 'name', label: 'Component Name', type: 'text', required: true, searchable: true },
			{
				key: 'component_type',
				label: 'Type',
				type: 'select',
				options: [
					{ value: 'Earning', label: 'Earning' },
					{ value: 'Deduction', label: 'Deduction' }
				],
				required: true,
				filterable: true
			},
			{
				key: 'calculation',
				label: 'Calculation',
				type: 'select',
				options: [
					{ value: 'Fixed', label: 'Fixed Amount' },
					{ value: 'Percentage of Basic', label: 'Percentage of Basic' },
					{ value: 'Per Lecture', label: 'Per Lecture' },
					{ value: 'Per Hour', label: 'Per Hour' },
					{ value: 'Formula', label: 'Formula' }
				],
				required: true
			},
			{ key: 'amount', label: 'Amount / Rate', type: 'currency', min: 0 },
			{ key: 'formula', label: 'Formula', type: 'text' },
			{ key: 'display_order', label: 'Display Order', type: 'number', defaultValue: 1 }
		]
	},

	payroll_runs: {
		key: 'payroll_runs',
		label: 'Payroll Runs',
		group: 'Payroll',
		table: 'payroll_runs',
		titleField: 'period',
		searchFields: ['period'],
		defaultSort: { column: 'period', ascending: false },
		scoped: true,
		fields: [
			collegeField({ required: true }),
			{
				key: 'period',
				label: 'Period',
				type: 'text',
				required: true,
				searchable: true,
				placeholder: '2026-09'
			},
			{ key: 'faculty_type', label: 'Faculty Type', type: 'text' },
			{ key: 'total_gross', label: 'Total Gross', type: 'currency', min: 0 },
			{ key: 'total_deductions', label: 'Total Deductions', type: 'currency', min: 0 },
			{ key: 'total_net', label: 'Total Net', type: 'currency', min: 0 },
			{
				key: 'status',
				label: 'Status',
				type: 'select',
				options: [
					{ value: 'Draft', label: 'Draft' },
					{ value: 'Calculated', label: 'Calculated' },
					{ value: 'Under Review', label: 'Under Review' },
					{ value: 'Approved', label: 'Approved' },
					{ value: 'Finalized', label: 'Finalized' },
					{ value: 'Locked', label: 'Locked' }
				],
				defaultValue: 'Draft',
				filterable: true
			},
			{ key: 'finalized_at', label: 'Finalized At', type: 'datetime', readonly: true }
		]
	},

	payroll_items: {
		key: 'payroll_items',
		label: 'Payroll Items',
		group: 'Payroll',
		table: 'payroll_items',
		titleField: 'employee_id',
		searchFields: [],
		defaultSort: { column: 'created_at', ascending: false },
		scoped: true,
		fields: [
			{
				key: 'payroll_run_id',
				label: 'Payroll Run',
				type: 'select',
				optionSource: 'payroll_runs',
				required: true,
				filterable: true
			},
			{
				key: 'employee_id',
				label: 'Employee',
				type: 'select',
				optionSource: 'employees',
				required: true,
				filterable: true
			},
			{ key: 'faculty_type', label: 'Faculty Type', type: 'text' },
			{ key: 'approved_lectures', label: 'Approved Lectures', type: 'decimal', min: 0 },
			{ key: 'approved_hours', label: 'Approved Hours', type: 'decimal', min: 0 },
			{ key: 'rate', label: 'Rate', type: 'currency', min: 0 },
			{ key: 'gross', label: 'Gross', type: 'currency', min: 0 },
			{ key: 'deductions', label: 'Deductions', type: 'currency', min: 0 },
			{ key: 'net_payable', label: 'Net Payable', type: 'currency', min: 0 },
			{ key: 'calculation_breakdown', label: 'Calculation Breakdown', type: 'textarea' },
			{
				key: 'status',
				label: 'Status',
				type: 'select',
				options: approvalStatus,
				defaultValue: 'Draft',
				filterable: true
			}
		]
	},

	exam_types: {
		key: 'exam_types',
		label: 'Exam Types',
		group: 'Examination',
		table: 'exam_types',
		titleField: 'name',
		searchFields: ['name'],
		scoped: true,
		fields: [
			collegeField({}),
			{ key: 'name', label: 'Exam Type', type: 'text', required: true, searchable: true },
			{ key: 'code', label: 'Code', type: 'text' },
			{ key: 'weightage', label: 'Weightage (%)', type: 'decimal', min: 0, max: 100 },
			{ key: 'default_max_marks', label: 'Default Max Marks', type: 'decimal', min: 0 },
			{ key: 'default_passing_marks', label: 'Default Passing Marks', type: 'decimal', min: 0 },
			{
				key: 'status',
				label: 'Status',
				type: 'select',
				options: statusOptions,
				defaultValue: 'Active'
			}
		]
	},

	alumni: {
		key: 'alumni',
		label: 'Alumni',
		group: 'Placements',
		table: 'alumni',
		titleField: 'student_name',
		searchFields: ['student_name', 'company', 'programme'],
		scoped: true,
		fields: [
			{ key: 'student_id', label: 'Student', type: 'select', optionSource: 'students' },
			{ key: 'student_name', label: 'Name', type: 'text', required: true, searchable: true },
			{ key: 'passing_year', label: 'Passing Year', type: 'number', filterable: true },
			{ key: 'programme', label: 'Programme', type: 'text', searchable: true },
			{ key: 'company', label: 'Company', type: 'text', searchable: true },
			{ key: 'designation', label: 'Designation', type: 'text' },
			{ key: 'email', label: 'Email', type: 'email' },
			{ key: 'mobile', label: 'Mobile', type: 'mobile' },
			{ key: 'higher_studies', label: 'Higher Studies', type: 'text' },
			{ key: 'achievements', label: 'Achievements', type: 'textarea' },
			{
				key: 'status',
				label: 'Status',
				type: 'select',
				options: statusOptions,
				defaultValue: 'Active'
			}
		]
	},

	grievances: {
		key: 'grievances',
		label: 'Grievances',
		group: 'Communication',
		table: 'grievances',
		titleField: 'subject',
		searchFields: ['subject', 'ticket_number'],
		defaultSort: { column: 'created_at', ascending: false },
		scoped: true,
		fields: [
			{
				key: 'ticket_number',
				label: 'Ticket Number',
				type: 'text',
				required: true,
				unique: true,
				searchable: true
			},
			{ key: 'subject', label: 'Subject', type: 'text', required: true, searchable: true },
			{
				key: 'category',
				label: 'Category',
				type: 'select',
				options: [
					{ value: 'Academic', label: 'Academic' },
					{ value: 'Fees', label: 'Fees' },
					{ value: 'Hostel', label: 'Hostel' },
					{ value: 'Transport', label: 'Transport' },
					{ value: 'Examination', label: 'Examination' },
					{ value: 'Infrastructure', label: 'Infrastructure' },
					{ value: 'HR', label: 'HR' },
					{ value: 'Other', label: 'Other' }
				],
				required: true,
				filterable: true
			},
			{
				key: 'raised_by_type',
				label: 'Raised By',
				type: 'select',
				options: [
					{ value: 'Student', label: 'Student' },
					{ value: 'Employee', label: 'Employee' },
					{ value: 'Parent', label: 'Parent' }
				],
				required: true
			},
			{ key: 'student_id', label: 'Student', type: 'select', optionSource: 'students' },
			{ key: 'employee_id', label: 'Employee', type: 'select', optionSource: 'employees' },
			{ key: 'description', label: 'Description', type: 'textarea', required: true },
			{
				key: 'assigned_department_id',
				label: 'Assigned Department',
				type: 'select',
				optionSource: 'departments'
			},
			{ key: 'resolution', label: 'Resolution', type: 'textarea' },
			{
				key: 'status',
				label: 'Status',
				type: 'select',
				options: [
					{ value: 'Open', label: 'Open' },
					{ value: 'In Progress', label: 'In Progress' },
					{ value: 'Resolved', label: 'Resolved' },
					{ value: 'Closed', label: 'Closed' },
					{ value: 'Rejected', label: 'Rejected' }
				],
				defaultValue: 'Open',
				filterable: true
			}
		]
	},

	documents: {
		key: 'documents',
		label: 'Documents',
		group: 'Documents & Notification',
		table: 'documents',
		titleField: 'title',
		searchFields: ['title', 'document_type'],
		defaultSort: { column: 'created_at', ascending: false },
		softDelete: true,
		scoped: true,
		fields: [
			{ key: 'title', label: 'Title', type: 'text', required: true, searchable: true },
			{
				key: 'document_type',
				label: 'Document Type',
				type: 'select',
				options: [
					{ value: 'Student Document', label: 'Student Document' },
					{ value: 'Employee Document', label: 'Employee Document' },
					{ value: 'Admission Document', label: 'Admission Document' },
					{ value: 'Certificate', label: 'Certificate' },
					{ value: 'Letter', label: 'Letter' },
					{ value: 'Circular', label: 'Circular' },
					{ value: 'Other', label: 'Other' }
				],
				required: true,
				filterable: true
			},
			{ key: 'student_id', label: 'Student', type: 'select', optionSource: 'students' },
			{ key: 'employee_id', label: 'Employee', type: 'select', optionSource: 'employees' },
			{ key: 'file_url', label: 'File URL', type: 'text' },
			{ key: 'mime_type', label: 'MIME Type', type: 'text', readonly: true },
			{
				key: 'visibility',
				label: 'Visibility',
				type: 'select',
				options: [
					{ value: 'Private', label: 'Private' },
					{ value: 'College', label: 'College' },
					{ value: 'Public', label: 'Public' }
				],
				defaultValue: 'Private',
				filterable: true
			},
			{
				key: 'status',
				label: 'Status',
				type: 'select',
				options: statusOptions,
				defaultValue: 'Active'
			}
		]
	},

	notifications: {
		key: 'notifications',
		label: 'Notifications',
		group: 'Documents & Notification',
		table: 'notifications',
		titleField: 'title',
		searchFields: ['title', 'event'],
		defaultSort: { column: 'created_at', ascending: false },
		scoped: true,
		fields: [
			{ key: 'title', label: 'Title', type: 'text', required: true, searchable: true },
			{
				key: 'event',
				label: 'Event',
				type: 'select',
				options: [
					{ value: 'Admission Confirmation', label: 'Admission Confirmation' },
					{ value: 'Fee Receipt', label: 'Fee Receipt' },
					{ value: 'Fee Reminder', label: 'Fee Reminder' },
					{ value: 'Leave Approval', label: 'Leave Approval' },
					{ value: 'Exam Notice', label: 'Exam Notice' },
					{ value: 'Result', label: 'Result' },
					{ value: 'Payroll', label: 'Payroll' },
					{ value: 'Circular', label: 'Circular' },
					{ value: 'Password Reset', label: 'Password Reset' }
				],
				required: true,
				filterable: true
			},
			{
				key: 'channel',
				label: 'Channel',
				type: 'select',
				options: [
					{ value: 'In-App', label: 'In-App' },
					{ value: 'Email', label: 'Email' },
					{ value: 'SMS', label: 'SMS' },
					{ value: 'WhatsApp', label: 'WhatsApp' }
				],
				defaultValue: 'In-App',
				filterable: true
			},
			{ key: 'recipient', label: 'Recipient', type: 'text', searchable: true },
			{ key: 'body', label: 'Message', type: 'textarea' },
			{
				key: 'status',
				label: 'Status',
				type: 'select',
				options: [
					{ value: 'Queued', label: 'Queued' },
					{ value: 'Sent', label: 'Sent' },
					{ value: 'Failed', label: 'Failed' },
					{ value: 'Read', label: 'Read' }
				],
				defaultValue: 'Queued',
				filterable: true
			},
			{ key: 'sent_at', label: 'Sent At', type: 'datetime', readonly: true }
		]
	},

	report_templates: {
		key: 'report_templates',
		label: 'Report Templates',
		group: 'Reports & Settings',
		table: 'report_templates',
		titleField: 'name',
		searchFields: ['name', 'module'],
		scoped: true,
		fields: [
			{ key: 'name', label: 'Report Name', type: 'text', required: true, searchable: true },
			{ key: 'module', label: 'Module', type: 'text', required: true, filterable: true },
			{ key: 'fields', label: 'Fields', type: 'textarea' },
			{ key: 'filters', label: 'Filters', type: 'textarea' },
			{ key: 'grouping', label: 'Grouping', type: 'text' },
			{ key: 'sorting', label: 'Sorting', type: 'text' },
			{
				key: 'output_format',
				label: 'Output Format',
				type: 'select',
				options: [
					{ value: 'Screen', label: 'Screen' },
					{ value: 'PDF', label: 'PDF' },
					{ value: 'Excel', label: 'Excel' },
					{ value: 'CSV', label: 'CSV' },
					{ value: 'Print', label: 'Print' }
				],
				defaultValue: 'Screen',
				filterable: true
			},
			{ key: 'is_shared', label: 'Shared', type: 'checkbox' }
		]
	},

	custom_forms: {
		key: 'custom_forms',
		label: 'Dynamic Forms',
		group: 'Reports & Settings',
		table: 'custom_forms',
		titleField: 'name',
		searchFields: ['name', 'code'],
		softDelete: true,
		scoped: true,
		fields: [
			collegeField({}),
			{ key: 'name', label: 'Form Name', type: 'text', required: true, searchable: true },
			{
				key: 'code',
				label: 'Form Code',
				type: 'text',
				required: true,
				unique: true,
				searchable: true
			},
			{ key: 'module', label: 'Module', type: 'text' },
			{ key: 'description', label: 'Description', type: 'textarea' },
			{ key: 'is_published', label: 'Published', type: 'checkbox', defaultValue: false },
			{
				key: 'status',
				label: 'Status',
				type: 'select',
				options: statusOptions,
				defaultValue: 'Active'
			}
		]
	},

	custom_form_fields: {
		key: 'custom_form_fields',
		label: 'Dynamic Form Fields',
		group: 'Reports & Settings',
		table: 'custom_form_fields',
		titleField: 'label',
		searchFields: ['label', 'field_name'],
		defaultSort: { column: 'display_order', ascending: true },
		scoped: true,
		fields: [
			{
				key: 'form_id',
				label: 'Form',
				type: 'select',
				optionSource: 'custom_forms',
				required: true,
				filterable: true
			},
			{ key: 'label', label: 'Label', type: 'text', required: true, searchable: true },
			{ key: 'field_name', label: 'Field Name', type: 'text', required: true, searchable: true },
			{
				key: 'field_type',
				label: 'Field Type',
				type: 'select',
				required: true,
				filterable: true,
				options: [
					{ value: 'text', label: 'Text' },
					{ value: 'textarea', label: 'Textarea' },
					{ value: 'number', label: 'Number' },
					{ value: 'date', label: 'Date' },
					{ value: 'select', label: 'Dropdown' },
					{ value: 'checkbox', label: 'Checkbox' },
					{ value: 'file', label: 'File' }
				]
			},
			{ key: 'is_required', label: 'Required', type: 'checkbox' },
			{ key: 'default_value', label: 'Default Value', type: 'text' },
			{ key: 'validation_rule', label: 'Validation', type: 'text' },
			{ key: 'display_order', label: 'Display Order', type: 'number', defaultValue: 1 }
		]
	},

	custom_tables: {
		key: 'custom_tables',
		label: 'Dynamic Tables',
		group: 'Reports & Settings',
		table: 'custom_tables',
		titleField: 'name',
		searchFields: ['name', 'code'],
		softDelete: true,
		scoped: true,
		fields: [
			collegeField({}),
			{ key: 'name', label: 'Table Name', type: 'text', required: true, searchable: true },
			{
				key: 'code',
				label: 'Table Code',
				type: 'text',
				required: true,
				unique: true,
				searchable: true
			},
			{ key: 'description', label: 'Description', type: 'textarea' },
			{
				key: 'scope',
				label: 'Scope',
				type: 'select',
				options: [
					{ value: 'College', label: 'College' },
					{ value: 'Department', label: 'Department' },
					{ value: 'Global', label: 'Global' }
				],
				defaultValue: 'College'
			},
			{
				key: 'status',
				label: 'Status',
				type: 'select',
				options: statusOptions,
				defaultValue: 'Active'
			}
		]
	},

	custom_table_columns: {
		key: 'custom_table_columns',
		label: 'Dynamic Table Columns',
		group: 'Reports & Settings',
		table: 'custom_table_columns',
		titleField: 'label',
		searchFields: ['label', 'field_name'],
		defaultSort: { column: 'display_order', ascending: true },
		scoped: true,
		fields: [
			{
				key: 'table_id',
				label: 'Table',
				type: 'select',
				optionSource: 'custom_tables',
				required: true,
				filterable: true
			},
			{ key: 'label', label: 'Column Label', type: 'text', required: true, searchable: true },
			{ key: 'field_name', label: 'Field Name', type: 'text', required: true, searchable: true },
			{
				key: 'data_type',
				label: 'Data Type',
				type: 'select',
				options: [
					{ value: 'text', label: 'Text' },
					{ value: 'number', label: 'Number' },
					{ value: 'decimal', label: 'Decimal' },
					{ value: 'date', label: 'Date' },
					{ value: 'boolean', label: 'Boolean' },
					{ value: 'currency', label: 'Currency' }
				],
				required: true
			},
			{ key: 'is_required', label: 'Required', type: 'checkbox' },
			{ key: 'is_unique', label: 'Unique', type: 'checkbox' },
			{ key: 'default_value', label: 'Default', type: 'text' },
			{ key: 'validation_rule', label: 'Validation', type: 'text' },
			{ key: 'display_order', label: 'Display Order', type: 'number', defaultValue: 1 }
		]
	},

	settings: {
		key: 'settings',
		label: 'Settings',
		group: 'Reports & Settings',
		table: 'settings',
		titleField: 'key',
		searchFields: ['key', 'category'],
		scoped: true,
		fields: [
			collegeField({}),
			{
				key: 'category',
				label: 'Category',
				type: 'select',
				required: true,
				filterable: true,
				options: [
					{ value: 'Organization', label: 'Organization' },
					{ value: 'College', label: 'College' },
					{ value: 'Academic', label: 'Academic' },
					{ value: 'Admission', label: 'Admission' },
					{ value: 'Fees', label: 'Fees' },
					{ value: 'Receipt', label: 'Receipt' },
					{ value: 'Attendance', label: 'Attendance' },
					{ value: 'Salary', label: 'Salary' },
					{ value: 'Payroll', label: 'Payroll' },
					{ value: 'Examination', label: 'Examination' },
					{ value: 'Notification', label: 'Notification' },
					{ value: 'Security', label: 'Security' },
					{ value: 'Numbering', label: 'Numbering' },
					{ value: 'Languages', label: 'Languages' },
					{ value: 'Approval Workflows', label: 'Approval Workflows' }
				]
			},
			{ key: 'key', label: 'Setting Key', type: 'text', required: true, searchable: true },
			{ key: 'value', label: 'Value', type: 'textarea' },
			{
				key: 'data_type',
				label: 'Data Type',
				type: 'select',
				options: [
					{ value: 'string', label: 'String' },
					{ value: 'number', label: 'Number' },
					{ value: 'boolean', label: 'Boolean' },
					{ value: 'json', label: 'JSON' }
				],
				defaultValue: 'string'
			}
		]
	}
};
