# Multi-College Education ERP Platform

## 1. Project Overview

Build a complete, reusable, dynamic **Multi-College Education ERP Platform** for educational institutions.

The system must support multiple colleges, campuses, departments, programs, students, employees, admissions, merit, timetable, attendance, examination, fees, payroll, accounts, purchase, inventory, library, hostel, transport, scholarship, placement, alumni, grievance, documents, notifications, reports and audit logs.

The ERP must NOT be hard-coded for one college. A new college must be configurable from the Admin Panel without source-code changes for normal master data and business-rule changes.

---

# 2. Technology Stack

- Node.js
- SvelteKit
- TypeScript
- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- Tailwind CSS
- GitHub
- Vercel-ready
- PDF generation
- Excel/CSV import/export

No traditional custom backend is required.

Use SvelteKit server routes/actions and Supabase.

Required commands:

```bash
npm install
npm run dev
npm run build
npm run preview
npm run check
npm run lint
npm run format
npm run test
```

---

# 3. Multi-College Architecture

```text
Organization / Trust
        |
        +-- College 1
        |     +-- Campus
        |     +-- Departments
        |     +-- Programs
        |     +-- Students
        |     +-- Employees
        |
        +-- College 2
        |
        +-- College 3
        |
        +-- College N
```

Every important record must support appropriate tenant scope:

- organization_id
- college_id
- campus_id
- department_id
- program_id
- academic_year_id
- semester_id

College configuration must include:

- College name
- College code
- Logo
- Address
- Contact number
- Email
- Website
- Principal
- Departments
- Programs
- Academic settings
- Admission settings
- Fee settings
- Receipt numbering
- Examination settings
- Attendance settings
- Payroll settings
- Notification settings
- Reports
- Users

Never hard-code college names.

---

# 4. User Roles

Create dynamic role and permission management.

Default roles:

- Super Admin
- Trust / Organization Admin
- College Admin
- Principal
- HOD
- Admission Admin
- Admission Clerk
- Academic Admin
- Exam Admin
- Accounts Admin
- HR Admin
- Payroll Admin
- Purchase Admin
- Store Incharge
- Library Admin
- Faculty
- Staff
- Student

Permissions:

- View
- Create
- Edit
- Delete
- Approve
- Reject
- Print
- Export
- Import
- Process
- Finalize
- Lock
- Unlock

Permissions must be configurable module-wise and action-wise.

---

# 5. Main ERP Modules

1. Dashboard
2. Organization & College
3. Campus
4. User & Role Management
5. Admission
6. Merit
7. Student Management
8. Academic Management
9. Department
10. Program/Course
11. Subject
12. Timetable
13. Faculty/Employee
14. Punching Machine
15. Attendance
16. Leave
17. Examination
18. Fees
19. Accounts
20. Payroll
21. HR
22. Purchase
23. Inventory
24. Library
25. Hostel
26. Transport
27. Scholarship
28. Training & Placement
29. Alumni
30. Grievance
31. Documents
32. Notifications
33. Reports
34. Settings
35. Audit Logs

---

# 6. Admission Management

Create a completely dynamic Admission Form Builder.

Supported field types:

- Text
- Textarea
- Number
- Date
- Time
- Dropdown
- Radio
- Checkbox
- Multi-select
- File
- Image
- Email
- Phone
- Currency
- Percentage
- Table
- Conditional field

Each field must support:

- Label
- Field name
- Required/optional
- Default value
- Validation
- Min/max
- Options
- Visibility rule
- Read-only
- Help text
- Display order

Example:

```text
IF Admission Type = NRI
THEN show NRI-specific fields
```

Admission types:

- ACPC
- ACPDC
- GCAS
- Management Quota / MQ
- VQ
- NRI
- University
- Other

Admission workflow:

```text
Application
   ↓
Document Upload
   ↓
Document Verification
   ↓
Eligibility Check
   ↓
Merit
   ↓
Seat Allocation
   ↓
Fee Payment
   ↓
Admission Confirmation
   ↓
Student ID / Enrollment
```

---

# 7. Merit Management

Merit calculation must be completely dynamic.

Support:

- PCM marks
- PCB marks
- Individual subject marks
- Board percentage
- GUJCET marks
- GUJCET percentile
- ACPC data
- Entrance examination score
- Other score
- Category
- Admission type
- Eligibility

Dynamic selected-subject totals must be supported.

Example:

```text
Select:
Physics
Chemistry
Mathematics

Total = Physics + Chemistry + Mathematics
```

Merit list fields:

- Rank
- Application number
- Student name
- Category
- Board
- Subject marks
- Selected subject total
- Percentage
- GUJCET marks
- GUJCET percentile
- Eligibility
- Admission type
- Status

Create a dynamic Merit Rule Builder.

Rules must have:

- Rule name
- College
- Program
- Admission type
- Academic year
- Selected subjects
- Calculation formula
- Minimum eligibility
- Effective from
- Effective to
- Status
- Reference document

ACPC-generated PDF/rule documents must be uploadable and associated with the merit rule.

Do not permanently hard-code government or university merit rules.

---

# 8. Student Management

Student Master must include:

- Student ID
- Admission number
- Enrollment number
- Application number
- Name
- Photo
- Gender
- Date of birth
- Mobile
- Email
- Address
- City
- State
- Pincode
- Category
- Caste/category details
- Parent/guardian
- Emergency contact
- College
- Campus
- Department
- Program
- Semester
- Division
- Academic year
- Admission type
- Admission date
- Documents
- Scholarship
- Fees
- Attendance
- Examination
- Hostel
- Transport
- Placement
- Alumni status

---

# 9. Faculty / Employee Management

Employee fields:

- Employee ID
- Biometric ID
- Name
- Photo
- Gender
- DOB
- Mobile
- Email
- Address
- College
- Campus
- Department
- Designation
- Faculty Type
- Joining Date
- Employment Status
- Bank Details
- Salary Structure
- Reporting Manager

Employee categories:

- Teaching
- Non-Teaching
- Administrative
- Technical
- Support

Faculty types must be dynamic:

- Regular Faculty
- Visiting Faculty
- Guest Faculty
- Ad-hoc Faculty
- Contract Faculty
- Part-Time Faculty
- Other

Each faculty type can have separate:

- Attendance rule
- Salary rule
- Leave rule
- Working-hour rule
- Lecture rule
- Overtime rule
- Approval rule

Never hard-code salary rates.

---

# 10. Timetable Management

Timetable must be dynamic.

Fields:

- College
- Campus
- Department
- Program
- Semester
- Division
- Day
- Time slot
- Subject
- Faculty
- Room
- Lecture type
- Batch

Default example schedule:

```text
9:30       Punch-in

9:45-10:45 Class 1
10:45-11:45 Class 2
11:45-12:45 Class 3

12:45-1:30  Recess

1:30-2:30   Class 4
2:30-3:30   Class 5
3:30-4:25   Class 6

4:30        Punch-out
```

These timings must be configurable by college/campus and must not be hard-coded.

---

# 11. Punching Machine Integration

Create a complete biometric/punching machine integration module.

Machine master:

- Machine name
- Machine ID
- Serial number
- IP
- Port
- Protocol/API type
- Campus
- Location
- Status
- Last sync

Punch record:

- Biometric employee ID
- Employee
- Date
- Punch time
- IN/OUT
- Machine
- Campus
- Raw data
- Sync status

Because biometric vendors use different protocols, create a connector abstraction.

Support:

- Vendor API
- REST API
- SDK
- Device database
- CSV
- Excel
- Manual import
- LAN/HTTP
- Scheduled sync

Normalize every punch into:

```text
{
  biometricEmployeeId,
  punchDate,
  punchTime,
  punchType,
  machineId
}
```

Do not hard-code a specific biometric vendor.

---

# 12. Attendance Management

Calculate:

- First punch
- Last punch
- Total working hours
- Late minutes
- Early leaving
- Missing punch
- Overtime
- Attendance status

Statuses:

- Present
- Absent
- Half Day
- Late
- Leave
- Holiday
- Weekly Off
- Missing Punch
- On Duty
- Work From Home

Manual corrections require permission and audit logging.

Dynamic attendance rules:

- Office start time
- Grace period
- Office end time
- Minimum hours
- Half-day hours
- Late threshold
- Early leave threshold
- Overtime start
- Weekly off
- Holiday calendar

---

# 13. Faculty Lecture Attendance

Pipeline:

```text
Faculty
   ↓
Timetable
   ↓
Scheduled Lecture
   ↓
Campus Punch
   ↓
Lecture Attendance
   ↓
Lecture Conducted
   ↓
HOD/Coordinator Approval
```

Lecture statuses:

- Scheduled
- Conducted
- Cancelled
- Substituted
- Rescheduled
- Not Conducted
- Approved
- Rejected

---

# 14. Visiting Faculty Payment

Visiting faculty can be paid using:

```text
Approved Lectures × Rate Per Lecture
```

or:

```text
Approved Teaching Hours × Rate Per Hour
```

Workflow:

```text
Timetable
 ↓
Lecture Conducted
 ↓
Attendance Verification
 ↓
HOD Approval
 ↓
Payable Lecture/Hour
 ↓
Configured Rate
 ↓
Payroll
```

Rates must be configurable.

---

# 15. Salary Rule Engine

Create a Dynamic Salary Rule Builder.

Fields:

- Rule name
- Faculty type
- College
- Campus
- Department
- Effective from
- Effective to
- Calculation type
- Formula
- Approval required
- Status

Calculation types:

- Monthly
- Daily
- Hourly
- Per Lecture
- Fixed
- Percentage
- Custom Formula

Components:

- Attendance
- Leave
- Late
- Early leaving
- Overtime
- Approved lecture
- Holiday
- Weekly off
- Allowance
- Deduction

Example Regular Faculty:

```text
Monthly Salary
+ Allowances
+ Approved Overtime
- Approved Deductions
= Net Salary
```

Example Visiting Faculty:

```text
Approved Lectures × Configured Rate
= Payable Amount
```

Salary rules must use effective dates and versioning.

Historical salary rules must never be overwritten.

---

# 16. Payroll

Workflow:

```text
Attendance Lock
 ↓
Leave Verification
 ↓
Lecture Verification
 ↓
Salary Calculation
 ↓
Payroll Review
 ↓
HOD Approval
 ↓
HR/Admin Approval
 ↓
Accounts Approval
 ↓
Finalize
 ↓
Payslip
 ↓
Accounting Entry
```

Finalized payroll must be locked.

Corrections must use controlled reversal/reprocessing.

Every payroll item must store:

- Employee
- Faculty Type
- Approved lectures/hours
- Rate
- Gross
- Deductions
- Net Payable
- Calculation breakdown
- Source values

This is required for audit and reproducibility.

---

# 17. Leave Management

Dynamic leave types:

- Casual
- Earned
- Medical
- Duty
- Academic
- Other

Workflow:

```text
Employee
 ↓
Leave Application
 ↓
Reporting Officer
 ↓
HOD
 ↓
HR
 ↓
Approved
```

Rules may vary by employee type.

---

# 18. Fees Management

Dynamic fee heads:

- Tuition
- Development
- Examination
- Library
- Laboratory
- Hostel
- Transport
- Other

Fee structures can depend on:

- College
- Program
- Semester
- Category
- Admission type
- Academic year

Support:

- Installments
- Discounts
- Scholarships
- Late fees
- Refunds
- Receipts
- Pending fees
- Payment history

---

# 19. College-wise Receipt Numbering

Each college must have separate receipt numbering.

Examples:

```text
ENG/2026/00001
DIP/2026/00001
ARCH/2026/00001
```

Receipt series may be configured by:

- College
- Campus
- Department
- Fee type
- Academic year
- Financial year

Receipt numbers must be transaction-safe and unique.

---

# 20. Examination Management

Exam types:

- Internal
- External
- Mid Semester
- End Semester
- Practical
- Viva
- Assignment
- Project
- Other

Dynamic exam configuration:

- Exam name
- Exam type
- Program
- Semester
- Subject
- Max marks
- Passing marks
- Weightage
- Date
- Time
- Room
- Examiner

Marks:

- Student
- Subject
- Internal
- External
- Practical
- Total
- Grade
- Result

---

# 21. Accounts

Support:

- Chart of Accounts
- Income
- Expense
- Assets
- Liabilities
- Cash
- Bank
- Journal
- Receipt
- Payment
- Contra
- Ledger
- Fees integration
- Payroll integration
- Purchase integration
- Inventory integration
- Refund
- Scholarship

---

# 22. Purchase

Workflow:

```text
Purchase Requisition
 ↓
Quotation
 ↓
Quotation Comparison
 ↓
Approval
 ↓
Purchase Order
 ↓
Goods Receipt
 ↓
Invoice
 ↓
Payment
```

Approval levels must be dynamic.

---

# 23. Inventory

Support:

- Item
- Category
- Unit
- Opening stock
- Purchase
- Issue
- Return
- Transfer
- Closing stock
- Minimum stock
- Supplier
- Location
- College
- Campus
- Department
- Store

---

# 24. Library

Support:

- Book master
- Barcode
- Member
- Issue
- Return
- Renewal
- Fine
- Lost book
- Supplier
- Stock
- Reports

---

# 25. Hostel

Support:

- Hostel
- Block
- Room
- Bed
- Student allocation
- Fees
- Attendance
- Leave
- Mess
- Reports

---

# 26. Transport

Support:

- Vehicle
- Route
- Driver
- Conductor
- Student
- Faculty
- Pass
- Fees
- Attendance
- Maintenance

---

# 27. Scholarship

Support:

- Scholarship type
- Student
- Eligibility
- Application
- Documents
- Approval
- Amount
- Received amount
- Pending amount

---

# 28. Training & Placement

Support:

- Company
- Placement drive
- Eligibility
- Student registration
- Shortlist
- Interview
- Offer
- Placement
- Package
- Reports

---

# 29. Alumni

Support:

- Profile
- Passing year
- Program
- Company
- Designation
- Contact
- Higher studies
- Achievements
- Events
- Donations

---

# 30. Grievance Management

Categories:

- Academic
- Fees
- Hostel
- Transport
- Examination
- Infrastructure
- HR
- Other

Workflow:

```text
Student/Employee
 ↓
Grievance
 ↓
Assigned Department
 ↓
Action
 ↓
Resolution
 ↓
Close
```

---

# 31. Document Management

Support:

- Student documents
- Employee documents
- Admission documents
- Certificates
- Letters
- Circulars
- PDFs
- Images
- Other attachments

Use Supabase Storage with access controls.

---

# 32. Notification System

Channels:

- In-App
- Email
- Optional SMS
- Optional WhatsApp API

Events:

- Admission confirmation
- Fee receipt
- Fee reminder
- Leave approval
- Exam notice
- Result
- Payroll
- Circular
- Password reset

---

# 33. Dynamic Form Builder

Supported field types:

```text
Text
Textarea
Number
Date
Time
Dropdown
Radio
Checkbox
Multi Select
File
Image
Email
Phone
Currency
Percentage
Table
```

Properties:

```text
label
fieldName
required
defaultValue
validation
min
max
options
visibilityRule
readOnly
helpText
order
```

Example:

```text
IF Admission Type = NRI
THEN show NRI fields
```

---

# 34. Dynamic Table Builder

Admin must be able to configure:

- Table name
- Columns
- Data types
- Required
- Unique
- Default
- Validation
- College scope
- Department scope

---

# 35. Dynamic Report Builder

Reports must support:

- Module
- Fields
- Filters
- Grouping
- Sorting
- Columns
- Date range
- College
- Department
- Program
- Academic year

Output:

- Screen
- PDF
- Excel
- CSV
- Print

Report templates can be saved.

Never hard-code report columns.

---

# 36. Import / Export

Import:

- Excel
- CSV

Export:

- Excel
- CSV
- PDF
- Print

Import workflow:

```text
Download Template
 ↓
Upload
 ↓
Validation
 ↓
Preview
 ↓
Error Report
 ↓
Confirm Import
```

---

# 37. Approval Engine

Create a generic configurable approval engine.

Example:

```text
Draft
 ↓
Submitted
 ↓
Under Review
 ↓
Approved
```

Advanced example:

```text
Draft
 ↓
Submitted
 ↓
HOD Approval
 ↓
Admin Approval
 ↓
Accounts Approval
 ↓
Finalized
```

Approval workflows must be configurable by module.

---

# 38. Audit Logs

Track:

- User
- Role
- College
- Module
- Action
- Record ID
- Old value
- New value
- Date/time
- IP/device where appropriate

Examples:

- Salary rule changed
- Fee modified
- Student edited
- Attendance corrected
- Receipt cancelled
- Payroll finalized

---

# 39. Database Tables

Create PostgreSQL tables including:

```text
organizations
colleges
campuses
departments
programs
courses
academic_years
semesters
divisions
subjects
faculty
employees
faculty_types
students
admissions
admission_forms
admission_fields
admission_documents
merit_rules
merit_rule_subjects
merit_applications
fee_heads
fee_structures
fee_transactions
receipt_series
timetables
time_slots
machines
machine_punches
attendance
attendance_rules
leave_types
leave_applications
lecture_records
salary_rules
salary_rule_components
payroll_runs
payroll_items
payroll_approvals
exam_types
exams
exam_subjects
marks
accounts
ledger_entries
purchase_requests
purchase_orders
inventory_items
stock_transactions
library_books
library_transactions
hostels
hostel_rooms
transport_vehicles
scholarships
placements
alumni
grievances
documents
notifications
roles
permissions
role_permissions
user_college_access
audit_logs
report_templates
custom_forms
custom_form_fields
custom_tables
custom_table_columns
settings
```

Use UUID primary keys where practical.

Do not use names or receipt numbers as primary keys.

Create proper:

- Foreign keys
- Unique constraints
- Indexes
- Check constraints
- Timestamps
- Soft-delete where appropriate

---

# 40. RLS Security

Supabase Row Level Security must be enabled.

Access model:

```text
Super Admin
   ↓
All organizations

Organization Admin
   ↓
Assigned organization

College Admin
   ↓
Assigned college

HOD
   ↓
Assigned department

Faculty
   ↓
Assigned teaching/employee records

Student
   ↓
Own records
```

Database RLS must enforce access, not only frontend checks.

Never expose the Supabase service-role key in the browser.

---

# 41. Security

Implement:

- Supabase Auth
- RLS
- Role-based access
- College-level access
- Department-level access
- Secure storage policies
- Input validation
- Server-side authorization
- Audit logs
- Secure environment variables
- Rate limiting where applicable
- Backup strategy

Critical financial/payroll records must be protected from unauthorized modification.

---

# 42. Environment Variables

Create `.env.example`:

```text
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Never commit production secrets.

Use deployment secrets in Vercel/GitHub.

---

# 43. Suggested SvelteKit Structure

```text
src/
├── routes/
│   ├── login/
│   ├── dashboard/
│   ├── colleges/
│   ├── departments/
│   ├── programs/
│   ├── students/
│   ├── admissions/
│   ├── merit/
│   ├── timetable/
│   ├── faculty/
│   ├── attendance/
│   ├── punching-machine/
│   ├── leave/
│   ├── exams/
│   ├── fees/
│   ├── accounts/
│   ├── payroll/
│   ├── purchase/
│   ├── inventory/
│   ├── library/
│   ├── hostel/
│   ├── transport/
│   ├── reports/
│   └── settings/
│
├── lib/
│   ├── components/
│   ├── server/
│   ├── db/
│   ├── auth/
│   ├── permissions/
│   ├── validation/
│   ├── pdf/
│   ├── export/
│   └── utils/
│
└── app.html
```

---

# 44. UI Design

Use a professional responsive ERP interface.

```text
┌─────────────────────────────────────────────┐
│ College Logo | ERP | Search | Bell | User  │
├──────────────┬──────────────────────────────┤
│ Dashboard    │                              │
│ Admission    │      Page Content            │
│ Students     │                              │
│ Academics    │                              │
│ Attendance   │                              │
│ Examination  │                              │
│ Fees         │                              │
│ Payroll      │                              │
│ Reports      │                              │
│ Settings     │                              │
└──────────────┴──────────────────────────────┘
```

All major pages should support:

- Search
- Filter
- Pagination
- Add
- Edit
- Delete
- View
- Approve
- Export
- Print

---

# 45. Gujarati + English

ERP must support:

- English
- Gujarati

Use translation keys:

```text
student.title
student.add
student.edit
attendance.present
attendance.absent
```

Do not hard-code user-facing text unnecessarily.

---

# 46. Mobile / PWA

Support:

- Desktop
- Laptop
- Tablet
- Android
- iPhone

Mobile priorities:

- Punch/Attendance
- Leave
- Faculty timetable
- Student information
- Approvals
- Notifications
- Dashboard

PWA may be used for selected offline functions.

Critical financial/payroll changes must not be allowed offline without safe synchronization.

---

# 47. Punch-to-Pay Pipeline

```text
Machine Punch
      ↓
Normalize Punch
      ↓
Employee Match
      ↓
Daily Attendance
      ↓
Apply Attendance Rule
      ↓
Apply Leave/Holiday
      ↓
Calculate Working Hours
      ↓
Timetable/Lecture Verification
      ↓
Faculty Type
      ↓
Salary Rule
      ↓
Payroll Item
      ↓
Approval
      ↓
Finalize
      ↓
Payslip
```

---

# 48. Business Rules

The system must follow these principles:

1. Never hard-code college names.
2. Never hard-code departments.
3. Never hard-code faculty types.
4. Never hard-code salary rates.
5. Never hard-code admission form fields.
6. Never hard-code merit subjects.
7. Never hard-code receipt numbering.
8. Never hard-code attendance timings.
9. Never hard-code exam marks.
10. Never hard-code report columns.
11. Store effective dates for rules.
12. Keep audit history.
13. Use database-level permissions.
14. Financial records become immutable after finalization unless reversed through an authorized workflow.
15. Government/university rules must be configurable and versioned.
16. Historical transactions must remain reproducible using the rule version active at the transaction date.

---

# 49. Government / University Rules

Admission, ACPC, ACPDC, GCAS, examination, salary, PF/ESIC, tax, attendance and other statutory rules can change.

Therefore:

- Store rules with effective dates.
- Allow authorized administrators to update rules.
- Store official reference documents where appropriate.
- Do not permanently hard-code government rules.
- Keep historical rules for old records.
- Record who changed a rule and when.

---

# 50. Backup and Recovery

Maintain backup/recovery strategy for:

- Students
- Admissions
- Fees
- Receipts
- Attendance
- Payroll
- Accounts
- Documents
- Audit logs

Critical data must be recoverable.

---

# 51. GitHub Workflow

Branches:

```text
main
development
feature/*
bugfix/*
```

Example commits:

```text
feat: add dynamic admission form builder
feat: add biometric attendance sync
feat: add salary rule engine
fix: prevent duplicate receipt numbers
feat: add multi-college RLS
feat: add dynamic merit calculation
```

---

# 52. Development Order

Build in this order:

1. Project setup
2. Supabase connection
3. Authentication
4. Organization / College
5. Roles / Permissions
6. Departments / Programs
7. Academic Year
8. Student Master
9. Employee / Faculty Master
10. Admission
11. Merit
12. Fees
13. Timetable
14. Punching Machine
15. Attendance
16. Leave
17. Faculty Lecture Records
18. Salary Rule Engine
19. Payroll
20. Examination
21. Accounts
22. Purchase
23. Inventory
24. Library
25. Hostel
26. Transport
27. Reports
28. Notifications
29. Audit Logs
30. Production Hardening

---

# 53. Admin Settings

Create settings pages for:

- Organization
- College
- Campus
- Academic
- Admission
- Fees
- Receipt
- Attendance
- Punching Machine
- Salary
- Payroll
- Examination
- Notification
- Security
- Numbering
- Languages
- Document types
- Approval workflows

---

# 54. Dynamic Configuration Principle

The Admin Panel must allow authorized users to configure:

- Colleges
- Campuses
- Departments
- Programs
- Courses
- Subjects
- Semesters
- Divisions
- Faculty types
- Admission types
- Admission forms
- Merit rules
- Fee structures
- Receipt series
- Timings
- Attendance rules
- Salary rules
- Approval workflows
- Exam structures
- Report templates
- Numbering formats
- Notifications

Normal configuration changes must not require code deployment.

---

# 55. Important Data Relationships

```text
Organization
    ↓
College
    ↓
Campus
    ↓
Department
    ↓
Program
    ↓
Semester
    ↓
Division
    ↓
Subject
```

Student:

```text
College
 ↓
Program
 ↓
Semester
 ↓
Division
 ↓
Subjects
```

Faculty:

```text
College
 ↓
Department
 ↓
Faculty Type
 ↓
Timetable
 ↓
Attendance
 ↓
Lecture Records
 ↓
Salary Rule
 ↓
Payroll
```

---

# 56. Final Architecture

```text
                         CENTRAL ERP
                              |
                ┌─────────────┴─────────────┐
                |                           |
          Organization                  Users/Roles
                |
       ┌────────┼────────┐
       |        |        |
    College   College  College
       |
    Campus
       |
 Department
       |
 Program
       |
 Semester
       |
 Subject
       |
 ┌─────┼───────────────┐
 |     |               |
Student Faculty       Admission
 |     |               |
Fees   Timetable      Merit
 |     |
Accounts Punch Machine
 |       |
Payroll Attendance
 |       |
 └───────┴─────────────┐
                       |
                Reports / Audit
```

---

# 57. Definition of Done

The initial production pilot is complete when:

- Multiple colleges can be created.
- College logo/address/settings are separate.
- Users can be restricted by college and department.
- Students can be admitted.
- Dynamic admission forms work.
- Merit can be configured.
- PCM/PCB/GUJCET calculations work.
- ACPC/rule documents can be stored.
- Fees and separate receipt series work.
- Timetable works.
- Employees/faculty can be configured.
- Punching machine connector imports normalized punch data.
- Attendance calculates automatically.
- Faculty types are configurable.
- Visiting faculty lecture payment calculates.
- Regular faculty payroll calculates.
- Payroll approval and locking work.
- Examination and marks work.
- Reports filter by college/department/program.
- PDF/Excel export works.
- Audit logs work.
- RLS/security policies are tested.
- Backups are configured.
- Historical business rules remain reproducible.

---

# 58. Developer / GitHub AI Instructions

When implementing this README:

1. Do not create a hard-coded single-college application.
2. Build reusable components.
3. Build dynamic CRUD screens.
4. Create Supabase migrations for database tables.
5. Create RLS policies for tenant isolation.
6. Create seed data only for development/demo.
7. Make all business rules configurable.
8. Validate data both client-side and server-side.
9. Use TypeScript types throughout.
10. Keep financial and payroll calculations auditable.
11. Use transactions for receipt numbering and critical financial operations.
12. Do not expose service-role credentials.
13. Add proper loading, empty, error and success states.
14. Add pagination for large datasets.
15. Add search and filtering to master/list pages.
16. Add confirmation dialogs for destructive actions.
17. Add audit logs for sensitive changes.
18. Add database indexes for frequently searched fields.
19. Keep historical records immutable after finalization.
20. Make the application responsive.
21. Support English and Gujarati.
22. Provide clear setup instructions.
23. Provide `.env.example`.
24. Provide database migration scripts.
25. Provide seed scripts.
26. Provide test cases for critical business rules.
27. Ensure `npm run dev` starts the application.
28. Ensure `npm run build` succeeds.
29. Ensure `npm run check` succeeds.
30. Keep the architecture ready for additional colleges without rewriting the application.

---

# 59. Expected Project Setup

The generated project should contain at minimum:

```text
README.md
package.json
svelte.config.js
vite.config.ts
tsconfig.json
.env.example

src/
supabase/
  migrations/
  seed/

static/
tests/
```

The final application must be GitHub-ready and deployable.

---

# 60. Final Goal

Build a professional, scalable and secure:

**MULTI-COLLEGE EDUCATION ERP PLATFORM**

using:

**Node.js + SvelteKit + TypeScript + Supabase PostgreSQL + Supabase Auth + Supabase Storage + GitHub**

with:

- Multi-college
- Multi-campus
- Dynamic forms
- Dynamic tables
- Dynamic merit rules
- ACPC/ACPDC/GCAS/MQ/VQ/NRI admission
- PCM/PCB/GUJCET merit
- Student management
- Employee/faculty management
- Timetable
- Punching machine integration
- Attendance
- Faculty lecture tracking
- Dynamic salary rules
- Visiting faculty payment
- Payroll
- Fees
- Separate receipt numbering
- Accounts
- Examination
- Purchase
- Inventory
- Library
- Hostel
- Transport
- Scholarship
- Placement
- Alumni
- Grievance
- Documents
- Notifications
- Reports
- Audit logs
- RLS security
- English + Gujarati
- Mobile responsive interface

A new college must be addable from the Admin Panel without changing source code for normal configuration.
