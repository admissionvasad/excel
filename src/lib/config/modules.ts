import type { ModuleConfig, ModuleField } from '$lib/types';

const statusOptions = [
	{ value: 'Active', label: 'Active' },
	{ value: 'Inactive', label: 'Inactive' }
];

const genderOptions = [
	{ value: 'Male', label: 'Male' },
	{ value: 'Female', label: 'Female' },
	{ value: 'Other', label: 'Other' }
];

const studentStatusOptions = [
	{ value: 'Active', label: 'Active' },
	{ value: 'Inactive', label: 'Inactive' },
	{ value: 'Passed', label: 'Passed' },
	{ value: 'Dropped', label: 'Dropped' },
	{ value: 'Cancelled', label: 'Cancelled' },
	{ value: 'Suspended', label: 'Suspended' },
	{ value: 'Alumni', label: 'Alumni' }
];

const employeeTypeOptions = [
	{ value: 'Teaching', label: 'Teaching' },
	{ value: 'Non-Teaching', label: 'Non-Teaching' },
	{ value: 'Administrative', label: 'Administrative' },
	{ value: 'Technical', label: 'Technical' },
	{ value: 'Support', label: 'Support' },
	{ value: 'Contract', label: 'Contract' },
	{ value: 'Visiting', label: 'Visiting' },
	{ value: 'Other', label: 'Other' }
];

const attendanceOptions = [
	{ value: 'Present', label: 'Present' },
	{ value: 'Absent', label: 'Absent' },
	{ value: 'Late', label: 'Late' },
	{ value: 'Leave', label: 'Leave' },
	{ value: 'Half Day', label: 'Half Day' },
	{ value: 'Holiday', label: 'Holiday' },
	{ value: 'Week Off', label: 'Week Off' }
];

const paymentModeOptions = [
	{ value: 'Cash', label: 'Cash' },
	{ value: 'UPI', label: 'UPI' },
	{ value: 'Card', label: 'Card' },
	{ value: 'Bank Transfer', label: 'Bank Transfer' },
	{ value: 'Cheque', label: 'Cheque' },
	{ value: 'Online Gateway', label: 'Online Gateway' },
	{ value: 'Other', label: 'Other' }
];

const levelOptions = [
	{ value: 'Diploma', label: 'Diploma' },
	{ value: 'UG', label: 'UG' },
	{ value: 'PG', label: 'PG' },
	{ value: 'Certificate', label: 'Certificate' },
	{ value: 'PhD', label: 'PhD' },
	{ value: 'Other', label: 'Other' }
];

const yesNo = [
	{ value: 'Yes', label: 'Yes' },
	{ value: 'No', label: 'No' }
];

const approvalStatus = [
	{ value: 'Draft', label: 'Draft' },
	{ value: 'Pending', label: 'Pending' },
	{ value: 'Approved', label: 'Approved' },
	{ value: 'Rejected', label: 'Rejected' },
	{ value: 'Cancelled', label: 'Cancelled' }
];

const departmentField = (
	overrides: Partial<ModuleField> = {}
): ModuleField => ({
	key: 'department_id',
	label: 'Department',
	type: 'select',
	optionSource: 'departments',
	filterable: true,
	...overrides
});

const programmeField = (
	overrides: Partial<ModuleField> = {}
): ModuleField => ({
	key: 'programme_id',
	label: 'Programme',
	type: 'select',
	optionSource: 'programmes',
	filterable: true,
	...overrides
});

const academicYearField = (
	overrides: Partial<ModuleField> = {}
): ModuleField => ({
	key: 'academic_year_id',
	label: 'Academic Year',
	type: 'select',
	optionSource: 'academic_years',
	filterable: true,
	...overrides
});

const semesterField = (overrides: Partial<ModuleField> = {}): ModuleField => ({
	key: 'semester',
	label: 'Semester',
	type: 'number',
	min: 1,
	max: 12,
	filterable: true,
	...overrides
});

export const MODULES: Record<string, ModuleConfig> = {
	students: {
		key: 'students',
		label: 'Students',
		group: 'Students',
		table: 'students',
		titleField: 'enrollment_number',
		searchFields: ['enrollment_number', 'roll_number', 'first_name', 'last_name', 'mobile', 'email'],
		defaultSort: { column: 'created_at', ascending: false },
		softDelete: true,
		scoped: true,
		system: true,
		fields: [
			{ key: 'enrollment_number', label: 'Enrollment Number', type: 'text', required: true, unique: true, searchable: true, section: 'Identity' },
			{ key: 'roll_number', label: 'Roll Number', type: 'text', searchable: true, section: 'Identity' },
			{ key: 'admission_number', label: 'Admission Number', type: 'text', section: 'Identity' },
			{ key: 'first_name', label: 'First Name', type: 'text', required: true, searchable: true, section: 'Personal' },
			{ key: 'middle_name', label: 'Middle Name', type: 'text', section: 'Personal' },
			{ key: 'last_name', label: 'Last Name', type: 'text', required: true, searchable: true, section: 'Personal' },
			{ key: 'gender', label: 'Gender', type: 'select', options: genderOptions, filterable: true, section: 'Personal' },
			{ key: 'date_of_birth', label: 'Date of Birth', type: 'date', section: 'Personal' },
			{ key: 'blood_group', label: 'Blood Group', type: 'text', section: 'Personal' },
			{ key: 'mobile', label: 'Mobile', type: 'mobile', searchable: true, section: 'Contact' },
			{ key: 'email', label: 'Email', type: 'email', searchable: true, section: 'Contact' },
			{ key: 'aadhaar_number', label: 'Aadhaar / ID Reference', type: 'text', section: 'Contact' },
			{ key: 'category', label: 'Category', type: 'text', filterable: true, section: 'Personal' },
			{ key: 'father_name', label: 'Father Name', type: 'text', section: 'Parent' },
			{ key: 'mother_name', label: 'Mother Name', type: 'text', section: 'Parent' },
			{ key: 'guardian_name', label: 'Guardian Name', type: 'text', section: 'Parent' },
			{ key: 'parent_mobile', label: 'Parent Mobile', type: 'mobile', section: 'Parent' },
			{ key: 'parent_email', label: 'Parent Email', type: 'email', section: 'Parent' },
			{ key: 'address', label: 'Address', type: 'textarea', section: 'Address' },
			{ key: 'city', label: 'City', type: 'text', section: 'Address' },
			{ key: 'state', label: 'State', type: 'text', section: 'Address' },
			{ key: 'pincode', label: 'Pincode', type: 'text', section: 'Address' },
			departmentField({ section: 'Academic' }),
			programmeField({ section: 'Academic' }),
			semesterField({ section: 'Academic' }),
			{ key: 'division', label: 'Division', type: 'text', section: 'Academic' },
			{ key: 'batch', label: 'Batch', type: 'text', section: 'Academic' },
			academicYearField({ section: 'Academic' }),
			{ key: 'admission_date', label: 'Admission Date', type: 'date', section: 'Academic' },
			{ key: 'status', label: 'Status', type: 'select', options: studentStatusOptions, required: true, filterable: true, defaultValue: 'Active', section: 'Status' }
		]
	},

	admissions: {
		key: 'admissions',
		label: 'Admissions',
		group: 'Students',
		table: 'admissions',
		titleField: 'application_number',
		searchFields: ['application_number', 'applicant_name', 'mobile', 'email'],
		defaultSort: { column: 'created_at', ascending: false },
		softDelete: true,
		scoped: true,
		fields: [
			{ key: 'application_number', label: 'Application Number', type: 'text', required: true, unique: true, searchable: true },
			{ key: 'applicant_name', label: 'Applicant Name', type: 'text', required: true, searchable: true },
			{ key: 'gender', label: 'Gender', type: 'select', options: genderOptions },
			{ key: 'date_of_birth', label: 'Date of Birth', type: 'date' },
			{ key: 'mobile', label: 'Mobile', type: 'mobile', searchable: true },
			{ key: 'email', label: 'Email', type: 'email', searchable: true },
			departmentField({ required: true }),
			programmeField({ required: true }),
			academicYearField({}),
			{ key: 'previous_qualification', label: 'Previous Qualification', type: 'text' },
			{ key: 'merit_score', label: 'Merit Score', type: 'decimal' },
			{ key: 'status', label: 'Status', type: 'select', options: approvalStatus, required: true, defaultValue: 'Draft', filterable: true },
			{ key: 'remarks', label: 'Remarks', type: 'textarea' }
		]
	},

	student_parents: {
		key: 'student_parents',
		label: 'Parents',
		group: 'Students',
		table: 'student_parents',
		titleField: 'name',
		searchFields: ['name', 'mobile', 'email'],
		scoped: true,
		fields: [
			{ key: 'student_id', label: 'Student', type: 'select', optionSource: 'students', required: true, filterable: true },
			{ key: 'name', label: 'Name', type: 'text', required: true, searchable: true },
			{ key: 'relation', label: 'Relation', type: 'select', options: [
				{ value: 'Father', label: 'Father' },
				{ value: 'Mother', label: 'Mother' },
				{ value: 'Guardian', label: 'Guardian' }
			], required: true },
			{ key: 'mobile', label: 'Mobile', type: 'mobile' },
			{ key: 'email', label: 'Email', type: 'email' },
			{ key: 'occupation', label: 'Occupation', type: 'text' },
			{ key: 'address', label: 'Address', type: 'textarea' }
		]
	},

	academic_years: {
		key: 'academic_years',
		label: 'Academic Years',
		group: 'Academics',
		table: 'academic_years',
		titleField: 'name',
		searchFields: ['name'],
		scoped: true,
		fields: [
			{ key: 'name', label: 'Academic Year', type: 'text', required: true, unique: true, placeholder: '2026-27' },
			{ key: 'start_date', label: 'Start Date', type: 'date' },
			{ key: 'end_date', label: 'End Date', type: 'date' },
			{ key: 'is_active', label: 'Active', type: 'checkbox', defaultValue: true }
		]
	},

	departments: {
		key: 'departments',
		label: 'Departments',
		group: 'Academics',
		table: 'departments',
		titleField: 'name',
		searchFields: ['name', 'code'],
		softDelete: true,
		scoped: true,
		fields: [
			{ key: 'code', label: 'Department Code', type: 'text', required: true, unique: true, searchable: true },
			{ key: 'name', label: 'Department Name', type: 'text', required: true, searchable: true },
			{ key: 'short_name', label: 'Short Name', type: 'text' },
			{ key: 'hod_id', label: 'HOD', type: 'select', optionSource: 'employees', filterable: true },
			{ key: 'email', label: 'Email', type: 'email' },
			{ key: 'phone', label: 'Phone', type: 'text' },
			{ key: 'status', label: 'Status', type: 'select', options: statusOptions, defaultValue: 'Active', filterable: true }
		]
	},

	programmes: {
		key: 'programmes',
		label: 'Programmes',
		group: 'Academics',
		table: 'programmes',
		titleField: 'name',
		searchFields: ['name', 'code'],
		softDelete: true,
		scoped: true,
		fields: [
			{ key: 'code', label: 'Programme Code', type: 'text', required: true, unique: true },
			{ key: 'name', label: 'Programme Name', type: 'text', required: true, searchable: true },
			departmentField({ required: true }),
			{ key: 'level', label: 'Level', type: 'select', options: levelOptions, required: true, filterable: true },
			{ key: 'duration_years', label: 'Duration (Years)', type: 'number', min: 0.5, step: 0.5 },
			{ key: 'total_semesters', label: 'Total Semesters', type: 'number', min: 1, defaultValue: 8 },
			{ key: 'university', label: 'University', type: 'text' },
			{ key: 'affiliation', label: 'Affiliation', type: 'text' },
			{ key: 'status', label: 'Status', type: 'select', options: statusOptions, defaultValue: 'Active', filterable: true }
		]
	},

	courses: {
		key: 'courses',
		label: 'Courses',
		group: 'Academics',
		table: 'courses',
		titleField: 'name',
		searchFields: ['name', 'code', 'acpc_code'],
		softDelete: true,
		scoped: true,
		fields: [
			{ key: 'code', label: 'Course Code', type: 'text', required: true, unique: true },
			{ key: 'name', label: 'Course Name', type: 'text', required: true, searchable: true },
			departmentField({ required: true }),
			programmeField({}),
			{ key: 'duration_years', label: 'Duration (Years)', type: 'number', step: 0.5 },
			{ key: 'semester', label: 'Semester', type: 'number', min: 1, max: 12 },
			{ key: 'credits', label: 'Credits', type: 'number', min: 0 },
			{ key: 'intake', label: 'Intake', type: 'number', min: 1 },
			{ key: 'acpc_code', label: 'ACPC Code', type: 'text' },
			{ key: 'status', label: 'Status', type: 'select', options: statusOptions, defaultValue: 'Active', filterable: true }
		]
	},

	subjects: {
		key: 'subjects',
		label: 'Subjects',
		group: 'Academics',
		table: 'subjects',
		titleField: 'name',
		searchFields: ['name', 'code'],
		softDelete: true,
		scoped: true,
		fields: [
			{ key: 'code', label: 'Subject Code', type: 'text', required: true, unique: true },
			{ key: 'name', label: 'Subject Name', type: 'text', required: true, searchable: true },
			departmentField({}),
			programmeField({ required: true }),
			semesterField({ required: true }),
			{ key: 'credits', label: 'Credits', type: 'number', min: 0 },
			{ key: 'theory_marks', label: 'Theory Marks', type: 'number', min: 0 },
			{ key: 'practical_marks', label: 'Practical Marks', type: 'number', min: 0 },
			{ key: 'internal_marks', label: 'Internal Marks', type: 'number', min: 0 },
			{ key: 'external_marks', label: 'External Marks', type: 'number', min: 0 },
			{ key: 'total_marks', label: 'Total Marks', type: 'number', min: 0 },
			{ key: 'status', label: 'Status', type: 'select', options: statusOptions, defaultValue: 'Active', filterable: true }
		]
	},

	divisions: {
		key: 'divisions',
		label: 'Divisions / Batches',
		group: 'Academics',
		table: 'divisions',
		titleField: 'name',
		searchFields: ['name'],
		scoped: true,
		fields: [
			{ key: 'name', label: 'Division', type: 'text', required: true },
			programmeField({ required: true }),
			semesterField({ required: true }),
			academicYearField({ required: true }),
			{ key: 'batch', label: 'Batch', type: 'text' },
			{ key: 'class_teacher_id', label: 'Class Teacher', type: 'select', optionSource: 'employees' },
			{ key: 'hod_id', label: 'HOD', type: 'select', optionSource: 'employees' },
			{ key: 'status', label: 'Status', type: 'select', options: statusOptions, defaultValue: 'Active' }
		]
	},

	timetable_entries: {
		key: 'timetable_entries',
		label: 'Timetable',
		group: 'Academics',
		table: 'timetable_entries',
		titleField: 'day_of_week',
		searchFields: ['day_of_week'],
		scoped: true,
		fields: [
			academicYearField({ required: true }),
			programmeField({ required: true }),
			semesterField({ required: true }),
			{ key: 'division', label: 'Division', type: 'text' },
			{ key: 'day_of_week', label: 'Day', type: 'select', options: [
				{ value: 'Monday', label: 'Monday' },
				{ value: 'Tuesday', label: 'Tuesday' },
				{ value: 'Wednesday', label: 'Wednesday' },
				{ value: 'Thursday', label: 'Thursday' },
				{ value: 'Friday', label: 'Friday' },
				{ value: 'Saturday', label: 'Saturday' },
				{ value: 'Sunday', label: 'Sunday' }
			], required: true, filterable: true },
			{ key: 'start_time', label: 'Start Time', type: 'time', required: true },
			{ key: 'end_time', label: 'End Time', type: 'time', required: true },
			{ key: 'subject_id', label: 'Subject', type: 'select', optionSource: 'subjects', required: true },
			{ key: 'faculty_id', label: 'Faculty', type: 'select', optionSource: 'employees' },
			{ key: 'room', label: 'Room', type: 'text' },
			{ key: 'type', label: 'Type', type: 'select', options: [
				{ value: 'Lecture', label: 'Lecture' },
				{ value: 'Practical', label: 'Practical' },
				{ value: 'Tutorial', label: 'Tutorial' },
				{ value: 'Break', label: 'Break' },
				{ value: 'Other', label: 'Other' }
			], defaultValue: 'Lecture' }
		]
	},

	student_attendance: {
		key: 'student_attendance',
		label: 'Student Attendance',
		group: 'Attendance',
		table: 'student_attendance',
		titleField: 'attendance_date',
		searchFields: [],
		defaultSort: { column: 'attendance_date', ascending: false },
		scoped: true,
		fields: [
			{ key: 'student_id', label: 'Student', type: 'select', optionSource: 'students', required: true, filterable: true },
			{ key: 'attendance_date', label: 'Date', type: 'date', required: true, filterable: true },
			{ key: 'subject_id', label: 'Subject', type: 'select', optionSource: 'subjects', filterable: true },
			semesterField({}),
			{ key: 'division', label: 'Division', type: 'text' },
			{ key: 'faculty_id', label: 'Faculty', type: 'select', optionSource: 'employees' },
			{ key: 'status', label: 'Status', type: 'select', options: attendanceOptions, required: true, defaultValue: 'Present', filterable: true },
			{ key: 'remarks', label: 'Remarks', type: 'text' }
		]
	},

	employee_attendance: {
		key: 'employee_attendance',
		label: 'Employee Attendance',
		group: 'Attendance',
		table: 'employee_attendance',
		titleField: 'attendance_date',
		searchFields: [],
		defaultSort: { column: 'attendance_date', ascending: false },
		scoped: true,
		fields: [
			{ key: 'employee_id', label: 'Employee', type: 'select', optionSource: 'employees', required: true, filterable: true },
			{ key: 'attendance_date', label: 'Date', type: 'date', required: true, filterable: true },
			{ key: 'punch_in', label: 'Punch In', type: 'time' },
			{ key: 'punch_out', label: 'Punch Out', type: 'time' },
			{ key: 'working_hours', label: 'Working Hours', type: 'decimal' },
			{ key: 'status', label: 'Status', type: 'select', options: attendanceOptions, required: true, defaultValue: 'Present', filterable: true },
			{ key: 'remarks', label: 'Remarks', type: 'text' }
		]
	},

	exams: {
		key: 'exams',
		label: 'Examinations',
		group: 'Examination',
		table: 'exams',
		titleField: 'name',
		searchFields: ['name', 'exam_type'],
		scoped: true,
		fields: [
			{ key: 'name', label: 'Exam Name', type: 'text', required: true, searchable: true },
			{ key: 'exam_type', label: 'Exam Type', type: 'select', options: [
				{ value: 'Internal', label: 'Internal' },
				{ value: 'Mid Semester', label: 'Mid Semester' },
				{ value: 'Unit Test', label: 'Unit Test' },
				{ value: 'Practical', label: 'Practical' },
				{ value: 'External', label: 'External' },
				{ value: 'Final', label: 'Final' },
				{ value: 'Supplementary', label: 'Supplementary' },
				{ value: 'Backlog', label: 'Backlog' }
			], required: true, filterable: true },
			academicYearField({ required: true }),
			programmeField({ required: true }),
			semesterField({ required: true }),
			{ key: 'start_date', label: 'Start Date', type: 'date' },
			{ key: 'end_date', label: 'End Date', type: 'date' },
			{ key: 'status', label: 'Status', type: 'select', options: [
				{ value: 'Scheduled', label: 'Scheduled' },
				{ value: 'Ongoing', label: 'Ongoing' },
				{ value: 'Completed', label: 'Completed' },
				{ value: 'Cancelled', label: 'Cancelled' }
			], defaultValue: 'Scheduled', filterable: true }
		]
	},

	student_marks: {
		key: 'student_marks',
		label: 'Marks Entry',
		group: 'Examination',
		table: 'student_marks',
		titleField: 'student_id',
		searchFields: [],
		scoped: true,
		fields: [
			{ key: 'exam_id', label: 'Exam', type: 'select', optionSource: 'exams', required: true, filterable: true },
			{ key: 'student_id', label: 'Student', type: 'select', optionSource: 'students', required: true, filterable: true },
			{ key: 'subject_id', label: 'Subject', type: 'select', optionSource: 'subjects', required: true },
			{ key: 'internal_marks', label: 'Internal Marks', type: 'decimal', min: 0 },
			{ key: 'external_marks', label: 'External Marks', type: 'decimal', min: 0 },
			{ key: 'practical_marks', label: 'Practical Marks', type: 'decimal', min: 0 },
			{ key: 'total_marks', label: 'Total Marks', type: 'decimal', min: 0 },
			{ key: 'grade', label: 'Grade', type: 'text' },
			{ key: 'is_pass', label: 'Pass', type: 'checkbox' }
		]
	},

	results: {
		key: 'results',
		label: 'Results',
		group: 'Examination',
		table: 'results',
		titleField: 'student_id',
		searchFields: [],
		scoped: true,
		fields: [
			{ key: 'exam_id', label: 'Exam', type: 'select', optionSource: 'exams', required: true, filterable: true },
			{ key: 'student_id', label: 'Student', type: 'select', optionSource: 'students', required: true, filterable: true },
			{ key: 'total_marks', label: 'Total Marks', type: 'decimal' },
			{ key: 'percentage', label: 'Percentage', type: 'decimal' },
			{ key: 'grade', label: 'Grade', type: 'text' },
			{ key: 'sgpa', label: 'SGPA', type: 'decimal' },
			{ key: 'cgpa', label: 'CGPA', type: 'decimal' },
			{ key: 'result_status', label: 'Result', type: 'select', options: [
				{ value: 'Pass', label: 'Pass' },
				{ value: 'Fail', label: 'Fail' },
				{ value: 'Absent', label: 'Absent' }
			], filterable: true },
			{ key: 'is_published', label: 'Published', type: 'checkbox' }
		]
	},

	fee_structures: {
		key: 'fee_structures',
		label: 'Fee Structure',
		group: 'Fees & Accounts',
		table: 'fee_structures',
		titleField: 'name',
		searchFields: ['name'],
		scoped: true,
		fields: [
			{ key: 'name', label: 'Name', type: 'text', required: true, searchable: true },
			programmeField({ required: true }),
			semesterField({ required: true }),
			academicYearField({ required: true }),
			{ key: 'fee_type', label: 'Fee Type', type: 'select', options: [
				{ value: 'Tuition', label: 'Tuition' },
				{ value: 'Admission', label: 'Admission' },
				{ value: 'Exam', label: 'Exam' },
				{ value: 'Library', label: 'Library' },
				{ value: 'Hostel', label: 'Hostel' },
				{ value: 'Transport', label: 'Transport' },
				{ value: 'Laboratory', label: 'Laboratory' },
				{ value: 'Other', label: 'Other' }
			], required: true, filterable: true },
			{ key: 'amount', label: 'Amount', type: 'currency', required: true, min: 0 },
			{ key: 'due_date', label: 'Due Date', type: 'date' },
			{ key: 'status', label: 'Status', type: 'select', options: statusOptions, defaultValue: 'Active' }
		]
	},

	student_fees: {
		key: 'student_fees',
		label: 'Student Fees',
		group: 'Fees & Accounts',
		table: 'student_fees',
		titleField: 'student_id',
		searchFields: [],
		scoped: true,
		fields: [
			{ key: 'student_id', label: 'Student', type: 'select', optionSource: 'students', required: true, filterable: true },
			{ key: 'fee_structure_id', label: 'Fee Structure', type: 'select', optionSource: 'fee_structures' },
			academicYearField({ required: true }),
			{ key: 'total_amount', label: 'Total Amount', type: 'currency', required: true, min: 0 },
			{ key: 'paid_amount', label: 'Paid Amount', type: 'currency', defaultValue: 0, min: 0 },
			{ key: 'discount_amount', label: 'Discount', type: 'currency', defaultValue: 0, min: 0 },
			{ key: 'scholarship_amount', label: 'Scholarship', type: 'currency', defaultValue: 0, min: 0 },
			{ key: 'due_date', label: 'Due Date', type: 'date' },
			{ key: 'status', label: 'Status', type: 'select', options: [
				{ value: 'Unpaid', label: 'Unpaid' },
				{ value: 'Partial', label: 'Partial' },
				{ value: 'Paid', label: 'Paid' },
				{ value: 'Overdue', label: 'Overdue' }
			], defaultValue: 'Unpaid', filterable: true }
		]
	},

	fee_payments: {
		key: 'fee_payments',
		label: 'Fee Payments',
		group: 'Fees & Accounts',
		table: 'fee_payments',
		titleField: 'receipt_number',
		searchFields: ['receipt_number', 'transaction_reference'],
		defaultSort: { column: 'payment_date', ascending: false },
		scoped: true,
		fields: [
			{ key: 'receipt_number', label: 'Receipt Number', type: 'text', required: true, unique: true, searchable: true },
			{ key: 'student_id', label: 'Student', type: 'select', optionSource: 'students', required: true, filterable: true },
			{ key: 'student_fee_id', label: 'Student Fee', type: 'select', optionSource: 'student_fees' },
			{ key: 'amount', label: 'Amount', type: 'currency', required: true, min: 0 },
			{ key: 'payment_date', label: 'Payment Date', type: 'date', required: true, filterable: true },
			{ key: 'payment_mode', label: 'Payment Mode', type: 'select', options: paymentModeOptions, required: true, filterable: true },
			{ key: 'transaction_reference', label: 'Reference No', type: 'text' },
			{ key: 'remarks', label: 'Remarks', type: 'text' }
		]
	},

	scholarships: {
		key: 'scholarships',
		label: 'Scholarships',
		group: 'Fees & Accounts',
		table: 'scholarships',
		titleField: 'name',
		searchFields: ['name', 'provider'],
		scoped: true,
		fields: [
			{ key: 'student_id', label: 'Student', type: 'select', optionSource: 'students', required: true, filterable: true },
			{ key: 'name', label: 'Scholarship Name', type: 'text', required: true, searchable: true },
			{ key: 'provider', label: 'Provider', type: 'text' },
			{ key: 'amount', label: 'Amount', type: 'currency', required: true, min: 0 },
			academicYearField({}),
			{ key: 'status', label: 'Status', type: 'select', options: [
				{ value: 'Applied', label: 'Applied' },
				{ value: 'Approved', label: 'Approved' },
				{ value: 'Rejected', label: 'Rejected' },
				{ value: 'Disbursed', label: 'Disbursed' }
			], defaultValue: 'Applied', filterable: true }
		]
	},

	chart_of_accounts: {
		key: 'chart_of_accounts',
		label: 'Chart of Accounts',
		group: 'Fees & Accounts',
		table: 'chart_of_accounts',
		titleField: 'name',
		searchFields: ['name', 'code'],
		scoped: true,
		fields: [
			{ key: 'code', label: 'Account Code', type: 'text', required: true, unique: true },
			{ key: 'name', label: 'Account Name', type: 'text', required: true, searchable: true },
			{ key: 'account_type', label: 'Type', type: 'select', options: [
				{ value: 'Asset', label: 'Asset' },
				{ value: 'Liability', label: 'Liability' },
				{ value: 'Income', label: 'Income' },
				{ value: 'Expense', label: 'Expense' },
				{ value: 'Equity', label: 'Equity' }
			], required: true, filterable: true },
			{ key: 'parent_id', label: 'Parent Account', type: 'select', optionSource: 'chart_of_accounts' },
			{ key: 'opening_balance', label: 'Opening Balance', type: 'currency', defaultValue: 0 },
			{ key: 'status', label: 'Status', type: 'select', options: statusOptions, defaultValue: 'Active' }
		]
	},

	ledger_entries: {
		key: 'ledger_entries',
		label: 'Ledger',
		group: 'Fees & Accounts',
		table: 'ledger_entries',
		titleField: 'narration',
		searchFields: ['narration', 'reference_number'],
		defaultSort: { column: 'entry_date', ascending: false },
		scoped: true,
		fields: [
			{ key: 'entry_date', label: 'Date', type: 'date', required: true, filterable: true },
			{ key: 'account_id', label: 'Account', type: 'select', optionSource: 'chart_of_accounts', required: true, filterable: true },
			{ key: 'narration', label: 'Narration', type: 'text', searchable: true },
			{ key: 'reference_number', label: 'Reference', type: 'text' },
			{ key: 'debit', label: 'Debit', type: 'currency', defaultValue: 0, min: 0 },
			{ key: 'credit', label: 'Credit', type: 'currency', defaultValue: 0, min: 0 }
		]
	},

	expenses: {
		key: 'expenses',
		label: 'Expenses',
		group: 'Fees & Accounts',
		table: 'expenses',
		titleField: 'title',
		searchFields: ['title', 'reference_number'],
		defaultSort: { column: 'expense_date', ascending: false },
		scoped: true,
		fields: [
			{ key: 'expense_date', label: 'Date', type: 'date', required: true, filterable: true },
			{ key: 'title', label: 'Title', type: 'text', required: true, searchable: true },
			{ key: 'category', label: 'Category', type: 'text', filterable: true },
			{ key: 'amount', label: 'Amount', type: 'currency', required: true, min: 0 },
			{ key: 'payment_mode', label: 'Payment Mode', type: 'select', options: paymentModeOptions },
			{ key: 'reference_number', label: 'Reference', type: 'text' },
			{ key: 'remarks', label: 'Remarks', type: 'textarea' }
		]
	},

	employees: {
		key: 'employees',
		label: 'Employees',
		group: 'Employees & HR',
		table: 'employees',
		titleField: 'employee_code',
		searchFields: ['employee_code', 'first_name', 'last_name', 'mobile', 'email'],
		defaultSort: { column: 'created_at', ascending: false },
		softDelete: true,
		scoped: true,
		system: true,
		fields: [
			{ key: 'employee_code', label: 'Employee Code', type: 'text', required: true, unique: true, searchable: true, section: 'Identity' },
			{ key: 'first_name', label: 'First Name', type: 'text', required: true, searchable: true, section: 'Personal' },
			{ key: 'middle_name', label: 'Middle Name', type: 'text', section: 'Personal' },
			{ key: 'last_name', label: 'Last Name', type: 'text', required: true, searchable: true, section: 'Personal' },
			{ key: 'gender', label: 'Gender', type: 'select', options: genderOptions, section: 'Personal' },
			{ key: 'date_of_birth', label: 'Date of Birth', type: 'date', section: 'Personal' },
			{ key: 'mobile', label: 'Mobile', type: 'mobile', searchable: true, section: 'Contact' },
			{ key: 'email', label: 'Email', type: 'email', searchable: true, section: 'Contact' },
			{ key: 'address', label: 'Address', type: 'textarea', section: 'Contact' },
			{ key: 'emergency_contact', label: 'Emergency Contact', type: 'text', section: 'Contact' },
			departmentField({ section: 'Employment' }),
			{ key: 'designation', label: 'Designation', type: 'text', filterable: true, section: 'Employment' },
			{ key: 'employee_type', label: 'Employee Type', type: 'select', options: employeeTypeOptions, required: true, filterable: true, section: 'Employment' },
			{ key: 'joining_date', label: 'Joining Date', type: 'date', section: 'Employment' },
			{ key: 'confirmation_date', label: 'Confirmation Date', type: 'date', section: 'Employment' },
			{ key: 'qualification', label: 'Qualification', type: 'text', section: 'Employment' },
			{ key: 'specialization', label: 'Specialization', type: 'text', section: 'Employment' },
			{ key: 'experience_years', label: 'Experience (Years)', type: 'decimal', min: 0, section: 'Employment' },
			{ key: 'pan_number', label: 'PAN', type: 'text', section: 'Statutory' },
			{ key: 'pf_number', label: 'PF Number', type: 'text', section: 'Statutory' },
			{ key: 'bank_account_number', label: 'Bank Account Number', type: 'text', section: 'Statutory' },
			{ key: 'bank_name', label: 'Bank Name', type: 'text', section: 'Statutory' },
			{ key: 'ifsc_code', label: 'IFSC Code', type: 'text', section: 'Statutory' },
			{ key: 'status', label: 'Status', type: 'select', options: statusOptions, defaultValue: 'Active', filterable: true, section: 'Status' }
		]
	},

	employee_leave: {
		key: 'employee_leave',
		label: 'Leave',
		group: 'Employees & HR',
		table: 'employee_leave',
		titleField: 'leave_type',
		searchFields: ['leave_type', 'reason'],
		defaultSort: { column: 'created_at', ascending: false },
		scoped: true,
		fields: [
			{ key: 'employee_id', label: 'Employee', type: 'select', optionSource: 'employees', required: true, filterable: true },
			{ key: 'leave_type', label: 'Leave Type', type: 'select', options: [
				{ value: 'Casual Leave', label: 'Casual Leave' },
				{ value: 'Sick Leave', label: 'Sick Leave' },
				{ value: 'Earned Leave', label: 'Earned Leave' },
				{ value: 'Medical Leave', label: 'Medical Leave' },
				{ value: 'Maternity Leave', label: 'Maternity Leave' },
				{ value: 'Duty Leave', label: 'Duty Leave' },
				{ value: 'Other', label: 'Other' }
			], required: true, filterable: true },
			{ key: 'start_date', label: 'Start Date', type: 'date', required: true },
			{ key: 'end_date', label: 'End Date', type: 'date', required: true },
			{ key: 'days', label: 'Days', type: 'decimal', required: true, min: 0.5 },
			{ key: 'reason', label: 'Reason', type: 'textarea' },
			{ key: 'status', label: 'Status', type: 'select', options: approvalStatus, defaultValue: 'Pending', filterable: true },
			{ key: 'approved_by', label: 'Approved By', type: 'select', optionSource: 'employees' }
		]
	},

	salary_structures: {
		key: 'salary_structures',
		label: 'Salary Structure',
		group: 'Employees & HR',
		table: 'salary_structures',
		titleField: 'name',
		searchFields: ['name'],
		scoped: true,
		fields: [
			{ key: 'name', label: 'Name', type: 'text', required: true, searchable: true },
			{ key: 'employee_id', label: 'Employee', type: 'select', optionSource: 'employees' },
			{ key: 'basic_salary', label: 'Basic Salary', type: 'currency', required: true, min: 0 },
			{ key: 'hra', label: 'HRA', type: 'currency', defaultValue: 0, min: 0 },
			{ key: 'da', label: 'DA', type: 'currency', defaultValue: 0, min: 0 },
			{ key: 'other_allowances', label: 'Other Allowances', type: 'currency', defaultValue: 0, min: 0 },
			{ key: 'pf', label: 'PF', type: 'currency', defaultValue: 0, min: 0 },
			{ key: 'professional_tax', label: 'Professional Tax', type: 'currency', defaultValue: 0, min: 0 },
			{ key: 'tds', label: 'TDS', type: 'currency', defaultValue: 0, min: 0 },
			{ key: 'status', label: 'Status', type: 'select', options: statusOptions, defaultValue: 'Active' }
		]
	},

	payroll: {
		key: 'payroll',
		label: 'Payroll',
		group: 'Employees & HR',
		table: 'payroll',
		titleField: 'payroll_month',
		searchFields: ['payroll_month'],
		defaultSort: { column: 'payroll_month', ascending: false },
		scoped: true,
		fields: [
			{ key: 'employee_id', label: 'Employee', type: 'select', optionSource: 'employees', required: true, filterable: true },
			{ key: 'payroll_month', label: 'Payroll Month', type: 'text', required: true, placeholder: '2026-09', filterable: true },
			{ key: 'gross_salary', label: 'Gross Salary', type: 'currency', required: true, min: 0 },
			{ key: 'total_deductions', label: 'Total Deductions', type: 'currency', defaultValue: 0, min: 0 },
			{ key: 'net_salary', label: 'Net Salary', type: 'currency', min: 0 },
			{ key: 'payment_status', label: 'Payment Status', type: 'select', options: [
				{ value: 'Pending', label: 'Pending' },
				{ value: 'Paid', label: 'Paid' }
			], defaultValue: 'Pending', filterable: true },
			{ key: 'paid_date', label: 'Paid Date', type: 'date' }
		]
	},

	library_books: {
		key: 'library_books',
		label: 'Books',
		group: 'Library',
		table: 'library_books',
		titleField: 'title',
		searchFields: ['title', 'isbn', 'author'],
		softDelete: true,
		scoped: true,
		fields: [
			{ key: 'title', label: 'Title', type: 'text', required: true, searchable: true },
			{ key: 'author', label: 'Author', type: 'text', searchable: true },
			{ key: 'publisher', label: 'Publisher', type: 'text' },
			{ key: 'isbn', label: 'ISBN', type: 'text', unique: true, searchable: true },
			{ key: 'category', label: 'Category', type: 'text', filterable: true },
			{ key: 'edition', label: 'Edition', type: 'text' },
			{ key: 'price', label: 'Price', type: 'currency', min: 0 },
			{ key: 'total_copies', label: 'Total Copies', type: 'number', min: 0, defaultValue: 1 },
			{ key: 'available_copies', label: 'Available Copies', type: 'number', min: 0, defaultValue: 1 }
		]
	},

	library_transactions: {
		key: 'library_transactions',
		label: 'Issue / Return',
		group: 'Library',
		table: 'library_transactions',
		titleField: 'book_id',
		searchFields: [],
		defaultSort: { column: 'issue_date', ascending: false },
		scoped: true,
		fields: [
			{ key: 'book_id', label: 'Book', type: 'select', optionSource: 'library_books', required: true, filterable: true },
			{ key: 'member_type', label: 'Member Type', type: 'select', options: [
				{ value: 'Student', label: 'Student' },
				{ value: 'Faculty', label: 'Faculty' },
				{ value: 'Employee', label: 'Employee' }
			], required: true },
			{ key: 'student_id', label: 'Student', type: 'select', optionSource: 'students' },
			{ key: 'employee_id', label: 'Employee', type: 'select', optionSource: 'employees' },
			{ key: 'issue_date', label: 'Issue Date', type: 'date', required: true },
			{ key: 'due_date', label: 'Due Date', type: 'date', required: true },
			{ key: 'return_date', label: 'Return Date', type: 'date' },
			{ key: 'status', label: 'Status', type: 'select', options: [
				{ value: 'Issued', label: 'Issued' },
				{ value: 'Returned', label: 'Returned' },
				{ value: 'Overdue', label: 'Overdue' },
				{ value: 'Lost', label: 'Lost' }
			], defaultValue: 'Issued', filterable: true },
			{ key: 'fine_amount', label: 'Fine', type: 'currency', defaultValue: 0, min: 0 }
		]
	},

	inventory_items: {
		key: 'inventory_items',
		label: 'Items',
		group: 'Inventory & Purchase',
		table: 'inventory_items',
		titleField: 'name',
		searchFields: ['name', 'code'],
		softDelete: true,
		scoped: true,
		fields: [
			{ key: 'code', label: 'Item Code', type: 'text', required: true, unique: true, searchable: true },
			{ key: 'name', label: 'Item Name', type: 'text', required: true, searchable: true },
			{ key: 'category', label: 'Category', type: 'select', options: [
				{ value: 'Computer', label: 'Computer' },
				{ value: 'Printer', label: 'Printer' },
				{ value: 'Furniture', label: 'Furniture' },
				{ value: 'Stationery', label: 'Stationery' },
				{ value: 'Laboratory Equipment', label: 'Laboratory Equipment' },
				{ value: 'Electrical Items', label: 'Electrical Items' },
				{ value: 'Sports Items', label: 'Sports Items' },
				{ value: 'Other', label: 'Other' }
			], filterable: true },
			{ key: 'unit', label: 'Unit', type: 'text', defaultValue: 'Nos' },
			{ key: 'opening_stock', label: 'Opening Stock', type: 'number', min: 0, defaultValue: 0 },
			{ key: 'current_stock', label: 'Current Stock', type: 'number', min: 0, defaultValue: 0 },
			{ key: 'reorder_level', label: 'Reorder Level', type: 'number', min: 0, defaultValue: 0 },
			{ key: 'unit_price', label: 'Unit Price', type: 'currency', min: 0 },
			{ key: 'status', label: 'Status', type: 'select', options: statusOptions, defaultValue: 'Active' }
		]
	},

	inventory_transactions: {
		key: 'inventory_transactions',
		label: 'Stock Movements',
		group: 'Inventory & Purchase',
		table: 'inventory_transactions',
		titleField: 'item_id',
		searchFields: ['reference_number'],
		defaultSort: { column: 'transaction_date', ascending: false },
		scoped: true,
		fields: [
			{ key: 'item_id', label: 'Item', type: 'select', optionSource: 'inventory_items', required: true, filterable: true },
			{ key: 'transaction_type', label: 'Type', type: 'select', options: [
				{ value: 'Stock In', label: 'Stock In' },
				{ value: 'Stock Out', label: 'Stock Out' },
				{ value: 'Transfer', label: 'Transfer' },
				{ value: 'Adjustment', label: 'Adjustment' }
			], required: true, filterable: true },
			{ key: 'quantity', label: 'Quantity', type: 'number', required: true },
			{ key: 'transaction_date', label: 'Date', type: 'date', required: true },
			{ key: 'department_id', label: 'Department', type: 'select', optionSource: 'departments' },
			{ key: 'reference_number', label: 'Reference', type: 'text' },
			{ key: 'remarks', label: 'Remarks', type: 'textarea' }
		]
	},

	vendors: {
		key: 'vendors',
		label: 'Vendors',
		group: 'Inventory & Purchase',
		table: 'vendors',
		titleField: 'company_name',
		searchFields: ['company_name', 'contact_person', 'mobile', 'gst_number'],
		softDelete: true,
		scoped: true,
		fields: [
			{ key: 'company_name', label: 'Company Name', type: 'text', required: true, searchable: true },
			{ key: 'contact_person', label: 'Contact Person', type: 'text', searchable: true },
			{ key: 'mobile', label: 'Mobile', type: 'mobile' },
			{ key: 'email', label: 'Email', type: 'email' },
			{ key: 'gst_number', label: 'GST Number', type: 'text', searchable: true },
			{ key: 'pan_number', label: 'PAN', type: 'text' },
			{ key: 'address', label: 'Address', type: 'textarea' },
			{ key: 'bank_details', label: 'Bank Details', type: 'textarea' },
			{ key: 'status', label: 'Status', type: 'select', options: statusOptions, defaultValue: 'Active', filterable: true }
		]
	},

	purchase_requests: {
		key: 'purchase_requests',
		label: 'Purchase Requests',
		group: 'Inventory & Purchase',
		table: 'purchase_requests',
		titleField: 'request_number',
		searchFields: ['request_number', 'title'],
		defaultSort: { column: 'created_at', ascending: false },
		scoped: true,
		fields: [
			{ key: 'request_number', label: 'Request Number', type: 'text', required: true, unique: true, searchable: true },
			{ key: 'title', label: 'Title', type: 'text', required: true, searchable: true },
			departmentField({ required: true }),
			{ key: 'requested_by', label: 'Requested By', type: 'select', optionSource: 'employees' },
			{ key: 'request_date', label: 'Request Date', type: 'date', required: true },
			{ key: 'estimated_amount', label: 'Estimated Amount', type: 'currency', min: 0 },
			{ key: 'justification', label: 'Justification', type: 'textarea' },
			{ key: 'status', label: 'Status', type: 'select', options: approvalStatus, defaultValue: 'Draft', filterable: true }
		]
	},

	purchase_orders: {
		key: 'purchase_orders',
		label: 'Purchase Orders',
		group: 'Inventory & Purchase',
		table: 'purchase_orders',
		titleField: 'order_number',
		searchFields: ['order_number'],
		defaultSort: { column: 'order_date', ascending: false },
		scoped: true,
		fields: [
			{ key: 'order_number', label: 'Order Number', type: 'text', required: true, unique: true, searchable: true },
			{ key: 'vendor_id', label: 'Vendor', type: 'select', optionSource: 'vendors', required: true, filterable: true },
			{ key: 'request_id', label: 'Purchase Request', type: 'select', optionSource: 'purchase_requests' },
			{ key: 'order_date', label: 'Order Date', type: 'date', required: true },
			{ key: 'expected_delivery', label: 'Expected Delivery', type: 'date' },
			{ key: 'total_amount', label: 'Total Amount', type: 'currency', min: 0 },
			{ key: 'status', label: 'Status', type: 'select', options: [
				{ value: 'Draft', label: 'Draft' },
				{ value: 'Sent', label: 'Sent' },
				{ value: 'Received', label: 'Received' },
				{ value: 'Invoiced', label: 'Invoiced' },
				{ value: 'Paid', label: 'Paid' },
				{ value: 'Cancelled', label: 'Cancelled' }
			], defaultValue: 'Draft', filterable: true }
		]
	},

	maintenance_requests: {
		key: 'maintenance_requests',
		label: 'Maintenance',
		group: 'Facilities',
		table: 'maintenance_requests',
		titleField: 'request_number',
		searchFields: ['request_number', 'title'],
		defaultSort: { column: 'created_at', ascending: false },
		scoped: true,
		fields: [
			{ key: 'request_number', label: 'Request Number', type: 'text', required: true, unique: true, searchable: true },
			{ key: 'title', label: 'Title', type: 'text', required: true, searchable: true },
			{ key: 'category', label: 'Category', type: 'select', options: [
				{ value: 'Electrical', label: 'Electrical' },
				{ value: 'Civil', label: 'Civil' },
				{ value: 'Plumbing', label: 'Plumbing' },
				{ value: 'Furniture', label: 'Furniture' },
				{ value: 'Computer', label: 'Computer' },
				{ value: 'Network', label: 'Network' },
				{ value: 'AC', label: 'AC' },
				{ value: 'Cleaning', label: 'Cleaning' },
				{ value: 'Other', label: 'Other' }
			], required: true, filterable: true },
			{ key: 'description', label: 'Description', type: 'textarea' },
			{ key: 'location', label: 'Location', type: 'text' },
			{ key: 'requested_by', label: 'Requested By', type: 'select', optionSource: 'employees' },
			{ key: 'assigned_to', label: 'Assigned To', type: 'select', optionSource: 'employees' },
			{ key: 'priority', label: 'Priority', type: 'select', options: [
				{ value: 'Low', label: 'Low' },
				{ value: 'Medium', label: 'Medium' },
				{ value: 'High', label: 'High' },
				{ value: 'Urgent', label: 'Urgent' }
			], defaultValue: 'Medium', filterable: true },
			{ key: 'status', label: 'Status', type: 'select', options: [
				{ value: 'Requested', label: 'Requested' },
				{ value: 'Assigned', label: 'Assigned' },
				{ value: 'In Progress', label: 'In Progress' },
				{ value: 'Completed', label: 'Completed' },
				{ value: 'Verified', label: 'Verified' },
				{ value: 'Closed', label: 'Closed' }
			], defaultValue: 'Requested', filterable: true }
		]
	},

	hostels: {
		key: 'hostels',
		label: 'Hostels',
		group: 'Facilities',
		table: 'hostels',
		titleField: 'name',
		searchFields: ['name', 'code'],
		scoped: true,
		fields: [
			{ key: 'code', label: 'Code', type: 'text', required: true, unique: true },
			{ key: 'name', label: 'Hostel Name', type: 'text', required: true, searchable: true },
			{ key: 'type', label: 'Type', type: 'select', options: [
				{ value: 'Boys', label: 'Boys' },
				{ value: 'Girls', label: 'Girls' },
				{ value: 'Co-ed', label: 'Co-ed' }
			], required: true },
			{ key: 'warden_name', label: 'Warden Name', type: 'text' },
			{ key: 'warden_mobile', label: 'Warden Mobile', type: 'mobile' },
			{ key: 'total_rooms', label: 'Total Rooms', type: 'number', min: 0 },
			{ key: 'address', label: 'Address', type: 'textarea' },
			{ key: 'status', label: 'Status', type: 'select', options: statusOptions, defaultValue: 'Active' }
		]
	},

	hostel_allocations: {
		key: 'hostel_allocations',
		label: 'Hostel Allocation',
		group: 'Facilities',
		table: 'hostel_allocations',
		titleField: 'student_id',
		searchFields: [],
		scoped: true,
		fields: [
			{ key: 'student_id', label: 'Student', type: 'select', optionSource: 'students', required: true, filterable: true },
			{ key: 'hostel_id', label: 'Hostel', type: 'select', optionSource: 'hostels', required: true, filterable: true },
			{ key: 'room_number', label: 'Room Number', type: 'text' },
			{ key: 'bed_number', label: 'Bed Number', type: 'text' },
			{ key: 'allocation_date', label: 'Allocation Date', type: 'date' },
			{ key: 'vacate_date', label: 'Vacate Date', type: 'date' },
			{ key: 'fee_amount', label: 'Hostel Fee', type: 'currency', min: 0 },
			{ key: 'status', label: 'Status', type: 'select', options: [
				{ value: 'Allocated', label: 'Allocated' },
				{ value: 'Vacated', label: 'Vacated' }
			], defaultValue: 'Allocated', filterable: true }
		]
	},

	vehicles: {
		key: 'vehicles',
		label: 'Vehicles',
		group: 'Facilities',
		table: 'vehicles',
		titleField: 'vehicle_number',
		searchFields: ['vehicle_number'],
		scoped: true,
		fields: [
			{ key: 'vehicle_number', label: 'Vehicle Number', type: 'text', required: true, unique: true, searchable: true },
			{ key: 'vehicle_type', label: 'Vehicle Type', type: 'select', options: [
				{ value: 'Bus', label: 'Bus' },
				{ value: 'Van', label: 'Van' },
				{ value: 'Car', label: 'Car' },
				{ value: 'Other', label: 'Other' }
			], required: true, filterable: true },
			{ key: 'model', label: 'Model', type: 'text' },
			{ key: 'capacity', label: 'Capacity', type: 'number', min: 1 },
			{ key: 'insurance_expiry', label: 'Insurance Expiry', type: 'date' },
			{ key: 'fitness_expiry', label: 'Fitness Expiry', type: 'date' },
			{ key: 'status', label: 'Status', type: 'select', options: statusOptions, defaultValue: 'Active', filterable: true }
		]
	},

	transport_routes: {
		key: 'transport_routes',
		label: 'Transport Routes',
		group: 'Facilities',
		table: 'transport_routes',
		titleField: 'name',
		searchFields: ['name', 'code'],
		scoped: true,
		fields: [
			{ key: 'code', label: 'Route Code', type: 'text', required: true, unique: true },
			{ key: 'name', label: 'Route Name', type: 'text', required: true, searchable: true },
			{ key: 'vehicle_id', label: 'Vehicle', type: 'select', optionSource: 'vehicles' },
			{ key: 'driver_name', label: 'Driver Name', type: 'text' },
			{ key: 'driver_mobile', label: 'Driver Mobile', type: 'mobile' },
			{ key: 'start_point', label: 'Start Point', type: 'text' },
			{ key: 'end_point', label: 'End Point', type: 'text' },
			{ key: 'fare_amount', label: 'Fare Amount', type: 'currency', min: 0 },
			{ key: 'status', label: 'Status', type: 'select', options: statusOptions, defaultValue: 'Active' }
		]
	},

	transport_allocations: {
		key: 'transport_allocations',
		label: 'Transport Allocation',
		group: 'Facilities',
		table: 'transport_allocations',
		titleField: 'student_id',
		searchFields: [],
		scoped: true,
		fields: [
			{ key: 'student_id', label: 'Student', type: 'select', optionSource: 'students', required: true, filterable: true },
			{ key: 'route_id', label: 'Route', type: 'select', optionSource: 'transport_routes', required: true, filterable: true },
			{ key: 'stop_name', label: 'Stop', type: 'text' },
			{ key: 'allocation_date', label: 'Allocation Date', type: 'date' },
			{ key: 'fare_amount', label: 'Fare Amount', type: 'currency', min: 0 },
			{ key: 'status', label: 'Status', type: 'select', options: statusOptions, defaultValue: 'Active', filterable: true }
		]
	},

	companies: {
		key: 'companies',
		label: 'Companies',
		group: 'Placements',
		table: 'companies',
		titleField: 'name',
		searchFields: ['name', 'industry'],
		scoped: true,
		fields: [
			{ key: 'name', label: 'Company Name', type: 'text', required: true, searchable: true },
			{ key: 'industry', label: 'Industry', type: 'text', filterable: true },
			{ key: 'website', label: 'Website', type: 'url' },
			{ key: 'contact_person', label: 'Contact Person', type: 'text' },
			{ key: 'mobile', label: 'Mobile', type: 'mobile' },
			{ key: 'email', label: 'Email', type: 'email' },
			{ key: 'address', label: 'Address', type: 'textarea' },
			{ key: 'status', label: 'Status', type: 'select', options: statusOptions, defaultValue: 'Active' }
		]
	},

	placements: {
		key: 'placements',
		label: 'Placements',
		group: 'Placements',
		table: 'placements',
		titleField: 'student_id',
		searchFields: [],
		defaultSort: { column: 'created_at', ascending: false },
		scoped: true,
		fields: [
			{ key: 'student_id', label: 'Student', type: 'select', optionSource: 'students', required: true, filterable: true },
			{ key: 'company_id', label: 'Company', type: 'select', optionSource: 'companies', required: true, filterable: true },
			{ key: 'job_role', label: 'Job Role', type: 'text' },
			{ key: 'package_amount', label: 'Package (Annual)', type: 'currency', min: 0 },
			{ key: 'joining_date', label: 'Joining Date', type: 'date' },
			{ key: 'offer_date', label: 'Offer Date', type: 'date' },
			{ key: 'status', label: 'Status', type: 'select', options: [
				{ value: 'Offered', label: 'Offered' },
				{ value: 'Accepted', label: 'Accepted' },
				{ value: 'Joined', label: 'Joined' },
				{ value: 'Declined', label: 'Declined' }
			], defaultValue: 'Offered', filterable: true }
		]
	},

	internships: {
		key: 'internships',
		label: 'Internships',
		group: 'Placements',
		table: 'internships',
		titleField: 'student_id',
		searchFields: ['project_title'],
		scoped: true,
		fields: [
			{ key: 'student_id', label: 'Student', type: 'select', optionSource: 'students', required: true, filterable: true },
			{ key: 'company_id', label: 'Company', type: 'select', optionSource: 'companies' },
			{ key: 'faculty_guide_id', label: 'Faculty Guide', type: 'select', optionSource: 'employees' },
			{ key: 'project_title', label: 'Project Title', type: 'text', searchable: true },
			{ key: 'start_date', label: 'Start Date', type: 'date' },
			{ key: 'end_date', label: 'End Date', type: 'date' },
			{ key: 'evaluation', label: 'Evaluation', type: 'text' },
			{ key: 'certificate_issued', label: 'Certificate Issued', type: 'checkbox' },
			{ key: 'status', label: 'Status', type: 'select', options: [
				{ value: 'Ongoing', label: 'Ongoing' },
				{ value: 'Completed', label: 'Completed' },
				{ value: 'Cancelled', label: 'Cancelled' }
			], defaultValue: 'Ongoing', filterable: true }
		]
	},

	certificates: {
		key: 'certificates',
		label: 'Certificates',
		group: 'Placements',
		table: 'certificates',
		titleField: 'certificate_number',
		searchFields: ['certificate_number', 'student_id'],
		defaultSort: { column: 'created_at', ascending: false },
		scoped: true,
		fields: [
			{ key: 'certificate_number', label: 'Certificate Number', type: 'text', required: true, unique: true, searchable: true },
			{ key: 'student_id', label: 'Student', type: 'select', optionSource: 'students', required: true, filterable: true },
			{ key: 'certificate_type', label: 'Certificate Type', type: 'select', options: [
				{ value: 'Bonafide', label: 'Bonafide' },
				{ value: 'Study Certificate', label: 'Study Certificate' },
				{ value: 'Character Certificate', label: 'Character Certificate' },
				{ value: 'NOC', label: 'NOC' },
				{ value: 'Leaving Certificate', label: 'Leaving Certificate' },
				{ value: 'Internship Certificate', label: 'Internship Certificate' },
				{ value: 'Other', label: 'Other' }
			], required: true, filterable: true },
			{ key: 'issue_date', label: 'Issue Date', type: 'date', required: true },
			{ key: 'purpose', label: 'Purpose', type: 'text' },
			{ key: 'verification_code', label: 'Verification Code', type: 'text', unique: true },
			{ key: 'status', label: 'Status', type: 'select', options: [
				{ value: 'Draft', label: 'Draft' },
				{ value: 'Issued', label: 'Issued' },
				{ value: 'Revoked', label: 'Revoked' }
			], defaultValue: 'Draft', filterable: true }
		]
	},

	notices: {
		key: 'notices',
		label: 'Notices',
		group: 'Communication',
		table: 'notices',
		titleField: 'title',
		searchFields: ['title', 'body'],
		defaultSort: { column: 'created_at', ascending: false },
		scoped: true,
		fields: [
			{ key: 'title', label: 'Title', type: 'text', required: true, searchable: true },
			{ key: 'notice_type', label: 'Type', type: 'select', options: [
				{ value: 'Notice', label: 'Notice' },
				{ value: 'Circular', label: 'Circular' },
				{ value: 'Announcement', label: 'Announcement' },
				{ value: 'Event', label: 'Event' }
			], required: true, filterable: true },
			{ key: 'body', label: 'Content', type: 'textarea', required: true },
			{ key: 'target_audience', label: 'Target Audience', type: 'select', options: [
				{ value: 'All Colleges', label: 'All Colleges' },
				{ value: 'One College', label: 'One College' },
				{ value: 'Department', label: 'Department' },
				{ value: 'Programme', label: 'Programme' },
				{ value: 'Semester', label: 'Semester' },
				{ value: 'Students', label: 'Students' },
				{ value: 'Faculty', label: 'Faculty' },
				{ value: 'Employees', label: 'Employees' },
				{ value: 'Parents', label: 'Parents' }
			], defaultValue: 'One College', filterable: true },
			{ key: 'publish_date', label: 'Publish Date', type: 'date' },
			{ key: 'expiry_date', label: 'Expiry Date', type: 'date' },
			{ key: 'is_published', label: 'Published', type: 'checkbox', defaultValue: true }
		]
	},

	approval_requests: {
		key: 'approval_requests',
		label: 'Approvals',
		group: 'Communication',
		table: 'approval_requests',
		titleField: 'title',
		searchFields: ['title'],
		defaultSort: { column: 'created_at', ascending: false },
		scoped: true,
		fields: [
			{ key: 'title', label: 'Title', type: 'text', required: true, searchable: true },
			{ key: 'request_type', label: 'Type', type: 'select', options: [
				{ value: 'Student Request', label: 'Student Request' },
				{ value: 'Leave', label: 'Leave' },
				{ value: 'Purchase', label: 'Purchase' },
				{ value: 'Maintenance', label: 'Maintenance' },
				{ value: 'Admission', label: 'Admission' },
				{ value: 'Certificate', label: 'Certificate' },
				{ value: 'Other', label: 'Other' }
			], required: true, filterable: true },
			{ key: 'module', label: 'Module', type: 'text' },
			{ key: 'record_id', label: 'Record ID', type: 'text' },
			{ key: 'requested_by', label: 'Requested By', type: 'select', optionSource: 'employees' },
			{ key: 'current_step', label: 'Current Step', type: 'number', defaultValue: 1 },
			{ key: 'status', label: 'Status', type: 'select', options: approvalStatus, defaultValue: 'Pending', filterable: true },
			{ key: 'remarks', label: 'Remarks', type: 'textarea' }
		]
	},

	audit_logs: {
		key: 'audit_logs',
		label: 'Audit Logs',
		group: 'System',
		table: 'audit_logs',
		titleField: 'action',
		searchFields: ['action', 'module', 'record_id'],
		defaultSort: { column: 'created_at', ascending: false },
		scoped: true,
		fields: [
			{ key: 'action', label: 'Action', type: 'text', filterable: true },
			{ key: 'module', label: 'Module', type: 'text', filterable: true },
			{ key: 'record_id', label: 'Record ID', type: 'text' },
			{ key: 'actor_email', label: 'User', type: 'text' },
			{ key: 'created_at', label: 'Time', type: 'datetime', readonly: true }
		]
	}
};

export const MODULE_GROUPS = [
	'Students',
	'Academics',
	'Attendance',
	'Examination',
	'Fees & Accounts',
	'Employees & HR',
	'Library',
	'Inventory & Purchase',
	'Facilities',
	'Placements',
	'Communication',
	'System'
] as const;

export function getModule(key: string): ModuleConfig | undefined {
	return MODULES[key];
}

export function modulesByGroup(): { group: string; modules: ModuleConfig[] }[] {
	const groups = new Map<string, ModuleConfig[]>();
	for (const module of Object.values(MODULES)) {
		const list = groups.get(module.group) ?? [];
		list.push(module);
		groups.set(module.group, list);
	}
	return [...groups.entries()].map(([group, modules]) => ({ group, modules }));
}

/** Return the field used to render the primary label for a record. */
export function primaryLabel(module: ModuleConfig, row: Record<string, unknown>): string {
	const direct = row[module.titleField];
	if (direct !== undefined && direct !== null && direct !== '') return String(direct);
	const firstText = module.fields.find((field) => field.type === 'text' && row[field.key]);
	if (firstText) return String(row[firstText.key]);
	return (row.id as string) ?? 'Record';
}

export { yesNo, paymentModeOptions, employeeTypeOptions, studentStatusOptions, genderOptions, statusOptions, attendanceOptions, approvalStatus, levelOptions };
