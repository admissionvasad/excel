# 5-COLLEGE COMPLETE EDUCATION ERP

## AI DEVELOPMENT SPECIFICATION

Build a complete, production-ready, multi-college Education ERP application using:

* Node.js
* SvelteKit
* TypeScript
* Supabase
* PostgreSQL
* Supabase Auth
* Supabase Storage
* GitHub
* npm

## IMPORTANT

This is a **MULTI-COLLEGE ERP**.

There are exactly 5 independent colleges/institutions using the same ERP application.

All 5 colleges must have completely separated operational data.

Use a centralized database with a mandatory `college_id` / tenant ID on all college-specific tables.

Do NOT create five separate applications.

Do NOT create five separate databases.

Use:

```text
1 GitHub Repository
1 SvelteKit Application
1 Supabase Project
1 PostgreSQL Database
5 Colleges
```

---

# 1. MAIN OBJECTIVE

Create a complete College ERP where the following can be managed from one application:

```text
College
Students
Parents
Admission
Academics
Departments
Programmes
Courses
Subjects
Faculty
Employees
Attendance
Timetable
Examination
Results
Fees
Accounts
HR
Payroll
Leave
Library
Inventory
Purchase
Vendors
Maintenance
Hostel
Transport
Placement
Internship
Certificates
Notices
Notifications
Documents
Reports
Audit Logs
Settings
```

---

# 2. MULTI-COLLEGE ARCHITECTURE

The application must support 5 colleges.

Initial college records:

```text
COL001
COL002
COL003
COL004
COL005
```

College names must be configurable from Super Admin.

Example:

```text
College 1
College 2
College 3
College 4
College 5
```

Super Admin can edit:

* College Name
* Short Name
* Code
* Logo
* Address
* City
* State
* Pincode
* Email
* Phone
* Website
* GST details if applicable
* University affiliation
* Academic settings

---

# 3. DATA ISOLATION

Every college-specific record must contain:

```text
college_id UUID NOT NULL
```

Example:

```text
students
employees
departments
programmes
subjects
attendance
exams
fees
library
inventory
purchase
maintenance
hostel
transport
placement
```

must be linked to the college.

Use Supabase Row Level Security.

A user belonging to:

```text
COL001
```

must NEVER be able to read or modify:

```text
COL002
COL003
COL004
COL005
```

data.

Super Admin may access all colleges.

---

# 4. USER ROLES

Create role-based access control.

Roles:

```text
SUPER_ADMIN
COLLEGE_ADMIN
PRINCIPAL
VICE_PRINCIPAL
REGISTRAR
HOD
ADMISSION_ADMIN
ACADEMIC_ADMIN
FACULTY
ACCOUNTANT
HR_ADMIN
LIBRARIAN
STORE_KEEPER
PURCHASE_ADMIN
MAINTENANCE_ADMIN
TRANSPORT_ADMIN
HOSTEL_ADMIN
PLACEMENT_ADMIN
STUDENT
PARENT
```

Permissions must be configurable.

---

# 5. LOGIN

Create a professional login page.

Fields:

```text
Email / Username
Password
College
Role
Login
Forgot Password
```

Super Admin:

```text
Super Admin Login
```

College users:

```text
Select College
Login
```

After login:

```text
User
 ↓
Profile
 ↓
Role
 ↓
College
 ↓
Permissions
 ↓
Dashboard
```

Use Supabase Auth.

Never store plain-text passwords.

---

# 6. SUPER ADMIN DASHBOARD

Super Admin dashboard must display all five colleges.

Example:

```text
TOTAL COLLEGES       5
TOTAL STUDENTS       10,000+
TOTAL EMPLOYEES      800+
TOTAL FACULTY        500+
TOTAL DEPARTMENTS    100+
TOTAL FEES           ₹XXXX
PENDING REQUESTS     XX
```

College cards:

```text
College 1
Students
Employees
Departments
Fees
Attendance
Results
```

Repeat for all 5 colleges.

Super Admin can select any college.

---

# 7. COLLEGE DASHBOARD

Each college gets its own dashboard.

Dashboard:

```text
Students
Employees
Faculty
Departments
Programmes
Attendance
Fees
Pending Fees
Admissions
Examinations
Library
Inventory
Purchase
Maintenance
Leave
Notices
```

Use charts and summary cards.

---

# 8. COLLEGE MASTER

Create:

```text
College Master
```

Fields:

```text
College ID
College Code
College Name
Short Name
Logo
Address
City
State
Pincode
Email
Phone
Website
University
Affiliation
Academic Year
Status
```

Actions:

```text
Add
Edit
View
Delete
Activate
Deactivate
```

---

# 9. STUDENT MANAGEMENT

Create complete Student Master.

Fields:

```text
Student ID
Enrollment Number
Roll Number
Admission Number

First Name
Middle Name
Last Name

Gender
Date of Birth
Blood Group

Mobile
Email

Aadhaar / ID reference
Category
Caste
Nationality

Address
City
State
Pincode

Parent Name
Father Name
Mother Name
Guardian Name

Parent Mobile
Parent Email

College
Department
Programme
Course
Semester
Division
Batch
Academic Year

Admission Date
Student Status
```

Statuses:

```text
Active
Inactive
Passed
Dropped
Cancelled
Suspended
Alumni
```

---

# 10. STUDENT DOCUMENTS

Student documents:

```text
Photo
Signature
10th Marksheet
12th Marksheet
Leaving Certificate
Transfer Certificate
Aadhaar
Migration Certificate
Caste Certificate
Income Certificate
Domicile
Scholarship Documents
Other Documents
```

Store files in Supabase Storage.

Use secure access policies.

---

# 11. PARENT MANAGEMENT

Parent Master:

```text
Parent ID
Student ID
Name
Relation
Mobile
Email
Occupation
Address
```

Parent portal should display:

```text
Student Profile
Attendance
Fees
Result
Timetable
Notices
```

---

# 12. ADMISSION MODULE

Features:

```text
Admission Application
Application Number
Applicant Details
Programme Selection
Document Upload
Document Verification
Merit
Admission Approval
Fee Payment
Enrollment
Admission Cancellation
Refund
```

Workflow:

```text
Application
 ↓
Document Verification
 ↓
Admission Admin
 ↓
HOD
 ↓
Authority
 ↓
Approved
 ↓
Student Created
```

---

# 13. DEPARTMENT MANAGEMENT

Fields:

```text
Department ID
College ID
Department Code
Department Name
Short Name
HOD
Email
Phone
Status
```

Examples:

```text
Computer Engineering
Civil Engineering
Mechanical Engineering
Electrical Engineering
Architecture
Management
Nursing
Science
Commerce
```

---

# 14. PROGRAMME MANAGEMENT

Fields:

```text
Programme ID
College ID
Department
Programme Name
Programme Code
Level
Duration
University
Affiliation
Status
```

Levels:

```text
Diploma
UG
PG
Certificate
PhD
Other
```

---

# 15. COURSE MANAGEMENT

Create:

```text
Course
Course Code
Course Name
Programme
Department
Duration
Semester
Credits
Status
```

---

# 16. SUBJECT MANAGEMENT

Fields:

```text
Subject ID
Subject Code
Subject Name
Programme
Department
Semester
Credits
Theory
Practical
Internal Marks
External Marks
Total Marks
Status
```

---

# 17. FACULTY MANAGEMENT

Faculty is an employee.

Create faculty allocation:

```text
Faculty
Department
Programme
Semester
Division
Subject
Academic Year
Workload
```

---

# 18. ACADEMIC YEAR

Example:

```text
2026-27
2027-28
2028-29
```

Only one academic year may be active per college unless configured otherwise.

---

# 19. SEMESTER

Support:

```text
Semester 1
Semester 2
Semester 3
Semester 4
Semester 5
Semester 6
Semester 7
Semester 8
```

Allow configurable semester count.

---

# 20. DIVISION / BATCH

Fields:

```text
Division
Batch
Programme
Semester
Academic Year
Class Teacher
HOD
```

---

# 21. TIMETABLE

Create complete timetable system.

Fields:

```text
College
Academic Year
Programme
Semester
Division
Day
Start Time
End Time
Subject
Faculty
Room
Type
```

Types:

```text
Lecture
Practical
Tutorial
Break
Other
```

Features:

```text
Create Timetable
Edit
Delete
Print
PDF
Faculty Timetable
Student Timetable
Room Timetable
```

---

# 22. STUDENT ATTENDANCE

Features:

```text
Date
College
Programme
Semester
Division
Subject
Faculty
Student
Status
```

Status:

```text
Present
Absent
Late
Leave
```

Reports:

```text
Daily
Monthly
Subject-wise
Student-wise
Semester-wise
Division-wise
```

Calculate:

```text
Present %
Absent %
Total Classes
```

Attendance shortage alert.

---

# 23. EMPLOYEE / HR MASTER

Create complete Employee Master.

Fields:

```text
Employee ID
College ID
Employee Code

First Name
Middle Name
Last Name

Gender
Date of Birth

Mobile
Email

Department
Designation
Employee Type

Joining Date
Confirmation Date

Qualification
Experience
Specialization

Bank Details
PF Details
PAN
ID References

Address
Emergency Contact

Status
```

Employee types:

```text
Teaching
Non-Teaching
Administrative
Technical
Support
Contract
Visiting
Other
```

---

# 24. EMPLOYEE DOCUMENTS

Store:

```text
Photo
Resume
Appointment Letter
Qualification Certificates
Experience Certificates
ID Proof
PAN
Bank Proof
Joining Documents
Other Documents
```

---

# 25. EMPLOYEE ATTENDANCE

Fields:

```text
Employee
Date
Punch In
Punch Out
Status
Working Hours
Remarks
```

Statuses:

```text
Present
Absent
Late
Half Day
Leave
Holiday
Week Off
```

---

# 26. LEAVE MANAGEMENT

Leave types:

```text
Casual Leave
Sick Leave
Earned Leave
Medical Leave
Maternity Leave
Duty Leave
Other
```

Workflow:

```text
Employee
 ↓
HOD
 ↓
Principal / Authority
 ↓
Approved / Rejected
```

---

# 27. PAYROLL

Create:

```text
Salary Structure
Employee Salary
Allowances
Deductions
PF
Professional Tax
TDS
Other Deductions
Net Salary
Payroll Month
Payslip
```

Formula:

```text
Gross Salary
-
Deductions
=
Net Salary
```

Generate PDF payslip.

---

# 28. EXAMINATION

Create:

```text
Exam Master
Exam Schedule
Exam Subjects
Student Registration
Marks Entry
Internal Marks
External Marks
Practical Marks
Grades
Result
Marksheet
```

Support:

```text
Internal
Mid Semester
Unit Test
Practical
External
Final
Supplementary
Backlog
```

---

# 29. RESULT

Calculate:

```text
Total Marks
Percentage
Grade
Grade Point
SGPA
CGPA
Pass / Fail
```

Make grading configurable.

Generate:

```text
Marksheet PDF
Result PDF
```

---

# 30. FEES

Create Fee Management.

Fee types:

```text
Tuition
Admission
Exam
Library
Hostel
Transport
Laboratory
Other
```

Features:

```text
Fee Structure
Student Fee
Invoice
Receipt
Payment
Outstanding
Refund
Discount
Scholarship
```

Payment modes:

```text
Cash
UPI
Card
Bank Transfer
Cheque
Online Gateway
Other
```

Generate receipt PDF.

---

# 31. ACCOUNTS

Create basic accounting system:

```text
Chart of Accounts
Ledger
Income
Expense
Journal
Payment
Receipt
Bank
Cash
```

Reports:

```text
Ledger
Trial Balance
Income & Expense
Profit & Loss
Balance Sheet
Cash Book
Bank Book
```

---

# 32. LIBRARY

Create:

```text
Book Master
Book Category
Author
Publisher
ISBN
Book Copy
Barcode
Library Member
Issue
Return
Renewal
Fine
Lost Book
```

Library members:

```text
Student
Faculty
Employee
```

Reports:

```text
Available Books
Issued Books
Overdue
Fine
Stock
```

---

# 33. INVENTORY

Create:

```text
Item Master
Category
Unit
Opening Stock
Stock In
Stock Out
Stock Transfer
Stock Adjustment
Department Stock
Current Stock
```

Example:

```text
Computer
Printer
Furniture
Stationery
Laboratory Equipment
Electrical Items
Sports Items
Other
```

---

# 34. PURCHASE

Workflow:

```text
Purchase Request
 ↓
HOD
 ↓
Purchase Department
 ↓
Quotation
 ↓
Vendor Selection
 ↓
Purchase Order
 ↓
Goods Receipt
 ↓
Inventory
 ↓
Invoice
 ↓
Accounts
 ↓
Payment
```

---

# 35. VENDOR MANAGEMENT

Fields:

```text
Vendor ID
Company Name
Contact Person
Mobile
Email
Address
GST Number
PAN
Bank Details
Status
```

---

# 36. MAINTENANCE

Create maintenance request system.

Categories:

```text
Electrical
Civil
Plumbing
Furniture
Computer
Network
AC
Cleaning
Other
```

Workflow:

```text
Request
 ↓
Maintenance Admin
 ↓
Assign Technician
 ↓
Work In Progress
 ↓
Completed
 ↓
Verified
 ↓
Closed
```

---

# 37. HOSTEL

Create:

```text
Hostel
Building
Floor
Room
Bed
Student Allocation
Hostel Fee
Hostel Attendance
Complaint
Vacancy
```

---

# 38. TRANSPORT

Create:

```text
Vehicle
Vehicle Number
Driver
Route
Stop
Student Allocation
Employee Allocation
Fuel
Maintenance
Insurance
Documents
```

---

# 39. PLACEMENT

Create:

```text
Company
Job Opening
Eligibility
Student Registration
Interview
Selection
Placement
Salary Package
Placement Statistics
```

---

# 40. INTERNSHIP

Create:

```text
Company
Student
Faculty Guide
Start Date
End Date
Project
Evaluation
Certificate
```

---

# 41. CERTIFICATE MANAGEMENT

Generate customizable PDF certificates.

Certificates:

```text
Bonafide
Study Certificate
Character Certificate
NOC
Leaving Certificate
Internship Certificate
Other
```

Admin can configure:

```text
College Logo
College Name
Certificate Header
Signature
Footer
Certificate Number
Date
```

---

# 42. NOTICE MANAGEMENT

Create:

```text
Notice
Circular
Announcement
Event
```

Target:

```text
All Colleges
One College
Department
Programme
Semester
Students
Faculty
Employees
Parents
```

---

# 43. NOTIFICATION SYSTEM

Support:

```text
In-App
Email
SMS
WhatsApp
```

Do not hard-code external API credentials.

Create configurable notification providers.

---

# 44. DOCUMENT MANAGEMENT

Create central document storage.

Folders logically separated by:

```text
College
Student
Employee
Department
Finance
HR
Admission
Certificates
Notices
```

Use Supabase Storage.

Never expose private documents publicly.

---

# 45. REPORTS

Every major module must have reports.

Export:

```text
PDF
Excel
CSV
Print
```

Student reports:

```text
Student List
Department-wise
Programme-wise
Semester-wise
Division-wise
Attendance
Result
Fees
```

Employee reports:

```text
Employee List
Department-wise
Designation-wise
Attendance
Leave
Payroll
```

Finance:

```text
Fee Collection
Outstanding
Income
Expense
Ledger
Trial Balance
P&L
Balance Sheet
```

Inventory:

```text
Stock
Purchase
Issue
Department Stock
Vendor
```

---

# 46. SEARCH

Global search should support:

```text
Student ID
Enrollment Number
Roll Number
Student Name
Mobile
Email

Employee ID
Employee Name
Department

Book Barcode
Item Code
Purchase Order
Receipt Number
```

---

# 47. IMPORT / EXPORT

Support importing:

```text
Students
Employees
Departments
Subjects
Fees
Books
Inventory
```

from Excel/CSV.

Provide sample templates.

Before import:

```text
Validate
Preview
Error Report
Confirm Import
```

---

# 48. BARCODE / QR

Support:

```text
Student QR
Employee QR
Library Barcode
Inventory Barcode
Certificate QR
```

Certificate QR should allow verification.

---

# 49. AUDIT LOG

Record all important actions.

Table:

```text
audit_logs
```

Fields:

```text
id
college_id
user_id
action
module
record_id
old_data
new_data
created_at
```

Actions:

```text
CREATE
UPDATE
DELETE
LOGIN
LOGOUT
APPROVE
REJECT
EXPORT
```

---

# 50. DATABASE TABLES

Create normalized PostgreSQL tables.

Minimum tables:

```text
colleges

profiles
roles
permissions
role_permissions
user_roles
user_colleges

academic_years
departments
programmes
courses
semesters
divisions
batches
subjects
faculty_subjects
timetable
timetable_entries

students
student_parents
student_addresses
student_documents
student_academic_records

admissions
admission_documents
admission_verifications

student_attendance
employee_attendance

employees
employee_documents
employee_qualifications
employee_experience
employee_leave

exams
exam_subjects
student_exam_registrations
student_marks
results

fee_structures
student_fees
fee_receipts
fee_payments
refunds
scholarships

chart_of_accounts
ledger_entries
journal_entries
income
expenses

salary_structures
payroll
payslips

library_books
library_copies
library_members
library_transactions
library_fines

vendors
purchase_requests
purchase_request_items
quotations
purchase_orders
purchase_order_items
goods_receipts

inventory_items
inventory_stock
inventory_transactions

maintenance_requests
maintenance_assignments

hostels
hostel_buildings
hostel_rooms
hostel_beds
hostel_allocations

vehicles
drivers
transport_routes
transport_stops
transport_allocations

companies
job_openings
placement_applications
placements
internships

certificates
certificate_templates

notices
notifications

files
audit_logs
settings
```

---

# 51. DATABASE RULE

All relevant tables must have:

```text
college_id
created_at
updated_at
created_by
updated_by
```

where applicable.

Use UUID primary keys.

Do not use predictable integer IDs as the only security mechanism.

---

# 52. DATABASE RELATIONSHIPS

Main relationship:

```text
COLLEGE
  │
  ├── DEPARTMENT
  │      │
  │      ├── PROGRAMME
  │      │      │
  │      │      ├── COURSE
  │      │      └── SUBJECT
  │      │
  │      └── EMPLOYEE
  │
  └── STUDENT
          │
          ├── ATTENDANCE
          ├── EXAM
          ├── RESULT
          ├── FEES
          ├── LIBRARY
          ├── HOSTEL
          ├── TRANSPORT
          ├── PLACEMENT
          ├── INTERNSHIP
          └── CERTIFICATE
```

---

# 53. ROW LEVEL SECURITY

RLS is mandatory.

Rules:

```text
SUPER_ADMIN
→ All colleges

COLLEGE_ADMIN
→ Own college

PRINCIPAL
→ Own college

HOD
→ Own college + assigned department

FACULTY
→ Own college + assigned academic records

ACCOUNTANT
→ Own college + finance permissions

HR
→ Own college + HR permissions

STUDENT
→ Own student record

PARENT
→ Linked student records
```

Never rely only on frontend filtering for security.

Security must be enforced at database level.

---

# 54. SVELTEKIT STRUCTURE

Use:

```text
src/
├── lib/
│   ├── components/
│   ├── server/
│   ├── supabase/
│   ├── stores/
│   ├── types/
│   ├── utils/
│   └── validation/
│
└── routes/
    ├── login/
    ├── super-admin/
    ├── college/
    │   ├── dashboard/
    │   ├── students/
    │   ├── admission/
    │   ├── academics/
    │   ├── attendance/
    │   ├── examination/
    │   ├── fees/
    │   ├── accounts/
    │   ├── employees/
    │   ├── hr/
    │   ├── payroll/
    │   ├── library/
    │   ├── inventory/
    │   ├── purchase/
    │   ├── maintenance/
    │   ├── hostel/
    │   ├── transport/
    │   ├── placement/
    │   ├── internship/
    │   ├── certificates/
    │   ├── notices/
    │   └── reports/
    └── profile/
```

---

# 55. UI DESIGN

Create modern professional college ERP UI.

Requirements:

```text
Responsive
Desktop
Tablet
Mobile
Clean Sidebar
Top Navigation
Breadcrumb
Search
Notifications
User Profile
Dark/Light Theme
```

Use reusable components:

```text
Button
Input
Select
DatePicker
Modal
Table
Pagination
Tabs
Card
Badge
Dropdown
File Upload
Chart
Toast
Confirm Dialog
```

---

# 56. SIDEBAR

Super Admin:

```text
Dashboard
Colleges
Users
Roles & Permissions
Reports
Audit Logs
Settings
```

College Admin:

```text
Dashboard

Admission
Students
Parents

Academics
Departments
Programmes
Courses
Subjects
Timetable

Attendance

Examination
Results

Fees
Accounts

Employees
HR
Leave
Payroll

Library

Inventory
Purchase

Maintenance

Hostel
Transport

Placement
Internship

Certificates

Notices
Notifications

Reports

Settings
```

---

# 57. API / SERVER DESIGN

Do NOT create a separate Express backend.

Use SvelteKit:

```text
+page.svelte
+page.ts
+page.server.ts
+server.ts
```

where required.

Use Supabase for:

```text
Database
Authentication
Storage
Realtime
Database Functions
```

Sensitive server operations must not expose service-role credentials to browser code.

---

# 58. ENVIRONMENT VARIABLES

Create:

```text
.env.example
```

Example:

```env
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
```

Never commit:

```text
.env
```

Never expose:

```text
SUPABASE_SERVICE_ROLE_KEY
```

to frontend/browser code.

If a service role key is required, use it only in secure server-side environment variables.

---

# 59. PACKAGE.JSON

Create working npm scripts:

```json
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "lint": "eslint .",
    "format": "prettier --write ."
  }
}
```

Commands must work:

```bash
npm install
npm run dev
npm run check
npm run build
npm run preview
```

---

# 60. GITHUB

Repository structure:

```text
college-erp/
```

GitHub must contain:

```text
README.md
package.json
package-lock.json
src/
static/
supabase/
tests/
.env.example
.gitignore
```

`.gitignore`:

```text
node_modules/
.env
.env.local
.svelte-kit/
build/
dist/
.DS_Store
```

---

# 61. SUPABASE MIGRATIONS

Create SQL migrations:

```text
001_colleges.sql
002_auth_roles.sql
003_departments.sql
004_academics.sql
005_students.sql
006_admissions.sql
007_employees.sql
008_attendance.sql
009_examination.sql
010_fees.sql
011_accounts.sql
012_hr_payroll.sql
013_library.sql
014_inventory.sql
015_purchase.sql
016_maintenance.sql
017_hostel.sql
018_transport.sql
019_placement.sql
020_certificates.sql
021_notifications.sql
022_audit_logs.sql
023_rls.sql
```

Also create:

```text
supabase/seed.sql
```

Seed:

```text
5 colleges
default roles
default permissions
sample departments
sample programmes
sample academic year
```

---

# 62. DEFAULT SUPER ADMIN

Create a documented setup process for the first Super Admin.

Do NOT hard-code a production password in the source code.

Provide:

```text
First Admin Setup
```

through a secure setup process.

---

# 63. ERROR HANDLING

Every module must handle:

```text
Loading
Success
Validation Error
Database Error
Unauthorized
Forbidden
Not Found
Network Error
```

Show user-friendly messages.

Never display raw database errors to normal users.

---

# 64. FORM VALIDATION

Use strong validation.

Validate:

```text
Required fields
Email
Mobile
Date
Numbers
Unique IDs
Duplicate records
File type
File size
```

Prevent duplicate:

```text
Enrollment Number
Employee ID
College Code
Department Code
Subject Code
Receipt Number
Certificate Number
```

where applicable.

---

# 65. FILE UPLOAD SECURITY

Allowed document types:

```text
PDF
JPG
JPEG
PNG
DOC
DOCX
XLS
XLSX
```

Configure file-size limits.

Use private Supabase Storage buckets.

Use signed URLs for private documents.

---

# 66. PERFORMANCE

Use:

```text
Pagination
Server-side filtering
Database indexes
Lazy loading
Debounced search
Efficient joins
Selective queries
```

Do not load thousands of records into the browser unnecessarily.

---

# 67. RESPONSIVE DESIGN

Desktop is primary but the application must also work on:

```text
Laptop
Desktop
Tablet
Mobile
```

Tables should become responsive.

---

# 68. DARK MODE

Support:

```text
Light
Dark
System
```

Save user preference.

---

# 69. COLLEGE BRANDING

Each college can have:

```text
Logo
College Name
Short Name
Primary Theme
Address
Contact
Footer
Certificate Header
```

The UI should automatically use the selected college's branding.

---

# 70. GLOBAL SETTINGS

Settings:

```text
College
Academic Year
Date Format
Currency
Timezone
Language
Logo
Email
SMS
WhatsApp
Payment Gateway
Certificate
Notification
```

Default timezone:

```text
Asia/Kolkata
```

Currency:

```text
INR ₹
```

---

# 71. LANGUAGE

Initially support:

```text
English
Gujarati
```

Keep all UI labels translatable.

Do not hard-code UI text throughout components.

Use a translation structure.

---

# 72. SECURITY REQUIREMENTS

Implement:

```text
Supabase Auth
RLS
Role-based access
Permission-based access
Secure file storage
Input validation
Server-side authorization
Audit logging
Session management
```

Never trust:

```text
college_id
user_id
role
permissions
```

sent directly by the browser without server/database authorization.

---

# 73. TESTING

Create tests for:

```text
Authentication
College isolation
Student CRUD
Employee CRUD
Attendance
Fees
Exam
RLS
Permissions
File Upload
Reports
```

Critical test:

```text
College 1 user
MUST NOT access College 2 data.
```

---

# 74. SAMPLE USER FLOW

## Student

```text
Login
 ↓
Student Dashboard
 ↓
Profile
 ↓
Attendance
 ↓
Result
 ↓
Fees
 ↓
Timetable
 ↓
Library
 ↓
Documents
 ↓
Certificates
```

## Faculty

```text
Login
 ↓
Faculty Dashboard
 ↓
Timetable
 ↓
Students
 ↓
Attendance
 ↓
Marks
 ↓
Leave
 ↓
Profile
```

## Accountant

```text
Login
 ↓
Accounts Dashboard
 ↓
Fee Collection
 ↓
Receipts
 ↓
Outstanding
 ↓
Income
 ↓
Expense
 ↓
Reports
```

## HOD

```text
Login
 ↓
HOD Dashboard
 ↓
Department
 ↓
Faculty
 ↓
Students
 ↓
Attendance
 ↓
Results
 ↓
Timetable
 ↓
Approvals
```

---

# 75. APPROVAL SYSTEM

Create generic approval engine.

Tables:

```text
approval_workflows
approval_steps
approval_requests
approval_actions
```

Support:

```text
Student Requests
Leave
Purchase
Maintenance
Admission
Certificates
Other
```

Workflow configurable by college.

---

# 76. DASHBOARD REPORTING

Create dashboards using database aggregation.

Charts:

```text
Student Strength
Department Strength
Attendance
Fee Collection
Outstanding
Admissions
Results
Employee Strength
Library
Inventory
Placement
```

Allow:

```text
Daily
Monthly
Yearly
Academic Year
College
Department
Programme
```

---

# 77. DATA BACKUP

Design database for safe backup.

Provide documentation for:

```text
Supabase Backup
Database Export
CSV Export
Report Export
```

Do not implement destructive delete without confirmation.

Prefer soft delete where appropriate:

```text
deleted_at
is_active
```

---

# 78. DELETE RULE

For important master records use:

```text
Soft Delete
```

Examples:

```text
Student
Employee
Department
Programme
Subject
Vendor
Book
Inventory
```

Do not physically delete historical financial or academic records unless explicitly permitted.

---

# 79. FINAL FOLDER STRUCTURE

Generate complete project:

```text
college-erp/
│
├── README.md
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
├── svelte.config.js
├── vite.config.ts
├── tsconfig.json
│
├── src/
│   ├── app.html
│   ├── app.d.ts
│   │
│   ├── lib/
│   │   ├── components/
│   │   ├── server/
│   │   ├── supabase/
│   │   ├── stores/
│   │   ├── types/
│   │   ├── utils/
│   │   └── validation/
│   │
│   └── routes/
│       ├── login/
│       ├── super-admin/
│       ├── college/
│       └── profile/
│
├── static/
│   ├── logos/
│   └── icons/
│
├── supabase/
│   ├── migrations/
│   ├── seed.sql
│   └── config.toml
│
└── tests/
```

---

# 80. AI CODING INSTRUCTION

You are the developer of this project.

DO NOT only provide examples.

Generate the actual working project files.

Every file must contain complete working code.

Do not create placeholder functions such as:

```text
TODO
implement later
coming soon
dummy function
```

unless the feature genuinely requires an external service that has not yet been configured.

For external integrations, create proper provider interfaces and configuration.

The project must compile.

The project must run with:

```bash
npm install
npm run dev
```

The project must build with:

```bash
npm run build
```

Fix TypeScript errors.

Fix Svelte errors.

Fix SQL errors.

Fix import errors.

Fix routing errors.

Fix authentication errors.

Fix RLS errors.

---

# 81. DEVELOPMENT ORDER

Build in this order:

```text
STEP 1
Project setup

STEP 2
Supabase connection

STEP 3
Database schema

STEP 4
RLS

STEP 5
Authentication

STEP 6
Roles & permissions

STEP 7
5 College setup

STEP 8
Main dashboard

STEP 9
Student module

STEP 10
Admission

STEP 11
Academic

STEP 12
Attendance

STEP 13
Employee / HR

STEP 14
Payroll

STEP 15
Examination

STEP 16
Fees

STEP 17
Accounts

STEP 18
Library

STEP 19
Inventory

STEP 20
Purchase

STEP 21
Maintenance

STEP 22
Hostel

STEP 23
Transport

STEP 24
Placement

STEP 25
Internship

STEP 26
Certificates

STEP 27
Notifications

STEP 28
Reports

STEP 29
Audit Logs

STEP 30
Testing

STEP 31
Build verification
```

---

# 82. DEFINITION OF DONE

The project is complete only when:

```text
[ ] npm install works
[ ] npm run dev works
[ ] npm run check works
[ ] npm run build works
[ ] Supabase connection works
[ ] Login works
[ ] Logout works
[ ] Password reset works
[ ] 5 colleges exist
[ ] Super Admin works
[ ] College Admin works
[ ] RLS works
[ ] Student module works
[ ] Employee module works
[ ] Admission works
[ ] Academic module works
[ ] Attendance works
[ ] Examination works
[ ] Fees works
[ ] Accounts works
[ ] HR works
[ ] Payroll works
[ ] Library works
[ ] Inventory works
[ ] Purchase works
[ ] Maintenance works
[ ] Hostel works
[ ] Transport works
[ ] Placement works
[ ] Internship works
[ ] Certificates work
[ ] Notices work
[ ] Reports work
[ ] PDF generation works
[ ] Excel/CSV export works
[ ] Audit logs work
[ ] College data isolation works
[ ] Responsive UI works
[ ] English works
[ ] Gujarati architecture is ready
```

---

# 83. MOST IMPORTANT SECURITY TEST

Create automated test:

```text
Given:

User belongs to COL001

When:

User requests students belonging to COL002

Then:

Database must return ZERO records
OR
permission must be denied.
```

This test is mandatory.

---

# 84. FINAL COMMANDS

After cloning:

```bash
npm install
```

Configure:

```text
.env
```

Then:

```bash
npm run dev
```

Production check:

```bash
npm run check
npm run build
npm run preview
```

---

# 85. FINAL REQUIREMENT

Build this as a **real multi-tenant College ERP**, not a demo.

Use clean architecture.

Use reusable components.

Use normalized PostgreSQL tables.

Use Supabase RLS.

Use secure authentication.

Use role-based permissions.

Use college-level data isolation.

Keep the application maintainable for many years.

The final result must be a GitHub-ready SvelteKit + Supabase project that starts with:

```bash
npm install
npm run dev
```

and can be deployed after configuring Supabase environment variables.

# END OF SPECIFICATION
# 86. DYNAMIC FORM & TABLE ENGINE

This ERP must NOT be built using only hard-coded forms and tables.

The system must provide a reusable **Dynamic Form Builder + Dynamic Table Builder** so that the Super Admin / College Admin can create and modify forms, fields, tables, rows, columns, dropdowns and workflows without changing source code.

---

# 87. DYNAMIC FORM BUILDER

Create a module:

```text
Settings
  ↓
Form Builder
```

Admin can create:

```text
Form
Section
Field
Row
Column
Tab
Sub-form
Validation
Dropdown
Workflow
Permission
```

Example:

```text
Student Admission Form
│
├── Personal Information
│   ├── First Name
│   ├── Middle Name
│   ├── Last Name
│   ├── Date of Birth
│   ├── Gender
│   └── Blood Group
│
├── Contact Information
│   ├── Mobile
│   ├── Email
│   └── Address
│
├── Academic Information
│   ├── Programme
│   ├── Department
│   ├── Semester
│   └── Academic Year
│
└── Documents
    ├── Photo
    ├── Signature
    └── Marksheet
```

---

# 88. FORM FIELD TYPES

The Dynamic Form Builder must support at least:

```text
Text
Textarea
Number
Decimal
Currency
Email
Mobile
Password
Date
Time
Date & Time
Checkbox
Radio
Switch
Dropdown
Multi Select
Search Select
Autocomplete
File Upload
Image Upload
Signature
Barcode
QR Code
Rich Text
Color
URL
Hidden
Read Only
Calculated
Formula
```

---

# 89. FIELD CONFIGURATION

Every field must support:

```text
Field ID
Field Name
Label
Placeholder
Description
Help Text
Data Type
Default Value
Required
Unique
Read Only
Hidden
Disabled
Searchable
Sortable
Filterable
Min Length
Max Length
Min Value
Max Value
Pattern
Validation
Display Order
Width
Section
Row
Column
```

Example:

```text
Field:
Mobile Number

Type:
Mobile

Required:
Yes

Unique:
No

Searchable:
Yes

Validation:
10 digit Indian mobile number
```

---

# 90. DYNAMIC DROPDOWN

Dropdowns must NOT be hard-coded.

Support:

```text
Static Options
Database Options
API Options
Dependent Options
```

Example:

```text
Country
   ↓
State
   ↓
District
   ↓
City
```

Another example:

```text
College
   ↓
Department
   ↓
Programme
   ↓
Semester
   ↓
Division
```

If College changes, Department dropdown must automatically show only departments belonging to that college.

---

# 91. DYNAMIC FIELD DEPENDENCY

Support conditional fields.

Example:

```text
Are you a hostel student?
        │
     Yes / No
        │
       Yes
        ↓
Hostel
Room
Bed
```

If:

```text
Hostel Student = No
```

then:

```text
Hostel
Room
Bed
```

must automatically hide.

---

# 92. CONDITIONAL LOGIC

Support:

```text
Show If
Hide If
Required If
Disable If
Enable If
Set Value If
```

Example:

```text
IF employee_type = "Teaching"
THEN show:
    Faculty Qualification
    Subject Specialization
    Workload
```

Example:

```text
IF payment_mode = "Cheque"
THEN show:
    Cheque Number
    Bank Name
    Cheque Date
```

---

# 93. FORM SECTIONS

Every form can contain multiple sections.

Example:

```text
Student Master

1. Personal Information
2. Contact Information
3. Parent Information
4. Academic Information
5. Address
6. Documents
7. Scholarship
8. Hostel
9. Transport
10. Additional Information
```

Admin can:

```text
Add Section
Edit Section
Delete Section
Reorder Section
Hide Section
```

---

# 94. FORM ROW & COLUMN SYSTEM

Forms must support responsive rows and columns.

Example:

```text
Row 1
┌──────────────────┬──────────────────┐
│ First Name       │ Last Name        │
└──────────────────┴──────────────────┘

Row 2
┌────────────┬────────────┬────────────┐
│ DOB        │ Gender     │ Blood Group│
└────────────┴────────────┴────────────┘

Row 3
┌──────────────────────────────────────┐
│ Address                              │
└──────────────────────────────────────┘
```

Admin can configure:

```text
1 Column
2 Columns
3 Columns
4 Columns
6 Columns
12-column grid
```

Use responsive grid.

---

# 95. DYNAMIC TABLE BUILDER

Create:

```text
Settings
  ↓
Table Builder
```

Admin can create a table definition.

Example:

```text
Student Master Table
```

Columns:

```text
Student ID
Enrollment No
Name
Department
Programme
Semester
Division
Mobile
Status
Actions
```

Admin can:

```text
Add Column
Edit Column
Delete Column
Reorder Column
Hide Column
Show Column
Set Width
Set Type
Set Formatter
```

---

# 96. DYNAMIC TABLE FEATURES

Every generated table should support:

```text
Search
Global Search
Column Search
Filter
Advanced Filter
Sort
Multi Sort
Pagination
Page Size
Column Visibility
Column Reordering
Export
Print
Bulk Select
Bulk Delete
Bulk Update
Row Actions
Inline Edit
```

Page sizes:

```text
10
25
50
100
250
500
```

---

# 97. DYNAMIC TABLE ROW

Each row must support configurable actions:

```text
View
Edit
Delete
Duplicate
Print
Download
Approve
Reject
Activate
Deactivate
Custom Action
```

Admin can decide which actions are visible for each role.

Example:

```text
Student Table

[View] [Edit] [Documents] [Fees] [Attendance] [Delete]
```

Faculty may see:

```text
[View] [Attendance] [Result]
```

but not:

```text
[Delete]
[Fees]
```

---

# 98. BULK ROW OPERATIONS

Tables must support selecting multiple rows.

Example:

```text
☑ Student 001
☑ Student 002
☑ Student 003
```

Then:

```text
Bulk Action
----------------
Export
Print
Activate
Deactivate
Assign Division
Assign Semester
Send Notification
Delete
```

Permissions must apply.

---

# 99. DYNAMIC MASTER CREATOR

Admin should be able to create new master tables/modules without changing application code.

Example:

```text
Settings
 ↓
Master Builder
 ↓
Create New Master
```

Admin enters:

```text
Master Name:
Vehicle Type

Fields:
Name
Code
Description
Status
```

System generates:

```text
Vehicle Type
    ├── Add
    ├── Edit
    ├── View
    ├── Delete
    ├── Search
    └── Report
```

---

# 100. CUSTOM MODULE BUILDER

Allow Super Admin to create a custom module.

Example:

```text
Module Name:
Alumni Management
```

Fields:

```text
Alumni ID
Student ID
Passing Year
Company
Designation
Mobile
Email
Location
```

System automatically generates:

```text
Menu
Dashboard
Form
Table
CRUD
Search
Filter
Export
Permissions
Audit Log
```

---

# 101. DYNAMIC DATABASE DESIGN

Do not create a new PostgreSQL table for every custom form created by the administrator.

Use a metadata-driven structure for custom forms.

Recommended tables:

```text
form_definitions
form_sections
form_fields
form_field_options
form_field_dependencies
form_validations
form_submissions
form_submission_values

table_definitions
table_columns
table_filters
table_actions

custom_modules
custom_module_permissions
```

---

# 102. FORM DEFINITIONS

Table:

```text
form_definitions
```

Fields:

```text
id
college_id
module_id
name
code
title
description
version
is_active
is_system
created_by
updated_by
created_at
updated_at
```

---

# 103. FORM SECTIONS

Table:

```text
form_sections
```

Fields:

```text
id
form_id
name
label
description
display_order
columns
is_active
created_at
updated_at
```

---

# 104. FORM FIELDS

Table:

```text
form_fields
```

Fields:

```text
id
form_id
section_id

field_key
field_name
label
description
placeholder

field_type
data_type

is_required
is_unique
is_readonly
is_hidden
is_disabled
is_searchable
is_filterable

default_value

min_length
max_length
min_value
max_value
validation_regex

display_order
row_number
column_number
column_span

data_source_type
data_source_config

created_at
updated_at
```

---

# 105. FORM OPTIONS

Table:

```text
form_field_options
```

Fields:

```text
id
field_id
option_value
option_label
display_order
is_active
```

Example:

```text
Gender

M → Male
F → Female
O → Other
```

---

# 106. FORM DEPENDENCIES

Table:

```text
form_field_dependencies
```

Fields:

```text
id
form_id
parent_field_id
child_field_id
operator
condition_value
action
```

Example:

```text
Parent:
student_type

Value:
Hosteller

Action:
SHOW

Child:
hostel_name
```

---

# 107. FORM SUBMISSIONS

For custom forms:

```text
form_submissions
```

Fields:

```text
id
form_id
college_id
submitted_by
status
submitted_at
updated_at
```

Values:

```text
form_submission_values
```

Fields:

```text
id
submission_id
field_id
value_text
value_number
value_boolean
value_date
value_json
```

Use the appropriate value column based on data type.

---

# 108. DYNAMIC TABLE DEFINITIONS

Table:

```text
table_definitions
```

Fields:

```text
id
college_id
module_id
name
code
title
source_type
source_config
is_active
created_at
updated_at
```

---

# 109. DYNAMIC TABLE COLUMNS

Table:

```text
table_columns
```

Fields:

```text
id
table_id
field_key
label
data_type
width
display_order
sortable
searchable
filterable
visible
formatter
```

---

# 110. DYNAMIC TABLE ACTIONS

Table:

```text
table_actions
```

Fields:

```text
id
table_id
action_key
label
icon
action_type
required_permission
display_order
is_active
```

Examples:

```text
view
edit
delete
approve
reject
print
download
custom
```

---

# 111. DYNAMIC REPORT BUILDER

Create:

```text
Reports
 ↓
Report Builder
```

Admin can select:

```text
Module
Fields
Filters
Grouping
Sorting
Columns
Charts
```

Example:

```text
Student Attendance Report

Filters:
College
Department
Programme
Semester
Division
Date Range

Columns:
Student
Enrollment
Subject
Present
Absent
Percentage
```

Export:

```text
PDF
Excel
CSV
Print
```

---

# 112. DYNAMIC DASHBOARD BUILDER

Admin can create dashboard widgets.

Widget types:

```text
Number Card
Table
Bar Chart
Line Chart
Pie Chart
Area Chart
Progress
Calendar
Recent Records
Pending Approvals
```

Admin selects:

```text
Module
Data Source
Filter
Aggregation
Display Type
```

---

# 113. DYNAMIC WORKFLOW BUILDER

Create:

```text
Workflow Builder
```

Admin can configure:

```text
Trigger
Condition
Approver
Sequence
Action
Notification
Final Status
```

Example:

```text
Purchase Request

Faculty
 ↓
HOD
 ↓
Purchase Admin
 ↓
Accounts
 ↓
Principal
 ↓
Approved
```

Another college may configure:

```text
Faculty
 ↓
HOD
 ↓
Principal
```

without changing source code.

---

# 114. DYNAMIC PERMISSION BUILDER

Permissions must be configurable.

Permission types:

```text
View
Create
Edit
Delete
Approve
Reject
Export
Print
Import
Upload
Download
```

Permissions can be assigned by:

```text
College
Role
Module
Form
Table
Action
Field
```

---

# 115. FIELD-LEVEL PERMISSION

Example:

Accountant may see:

```text
Student Name
Enrollment
Fees
Payment
Outstanding
```

but not:

```text
Student Aadhaar
Medical Information
Private Documents
```

HR may see employee salary.

Faculty may not see salary.

Implement field-level visibility where required.

---

# 116. DYNAMIC CRUD

Every dynamic module should automatically support:

```text
CREATE
READ
UPDATE
DELETE
```

with:

```text
Validation
Permissions
Audit Log
College Isolation
```

---

# 117. AUTO FORM GENERATION

When a new Master is created:

```text
Create Master
 ↓
Add Fields
 ↓
Save
 ↓
System generates:
     Form
     Table
     CRUD
     Search
     Filter
     Export
     Permissions
     Audit Log
```

No source-code change should be required.

---

# 118. AUTO TABLE GENERATION

When fields are created, the system should automatically offer:

```text
Table Column
```

Admin can choose:

```text
Visible
Hidden
Sortable
Searchable
Filterable
```

---

# 119. FORM VERSIONING

Forms must support versions.

Example:

```text
Student Admission Form

Version 1
Version 2
Version 3
```

Old submissions must continue to use the version under which they were created.

Do not break historical data when a form is modified.

---

# 120. FORM CLONING

Allow:

```text
Clone Form
Clone Module
Clone Table
Clone Workflow
```

Example:

```text
College 1 Student Form
        ↓
Clone
        ↓
College 2 Student Form
```

Then College 2 can customize it.

---

# 121. COLLEGE-SPECIFIC CUSTOMIZATION

Each college can customize:

```text
Forms
Fields
Tables
Columns
Dropdowns
Reports
Workflows
Notifications
Dashboard
Logo
Theme
```

But common system modules remain centrally maintained.

---

# 122. SYSTEM MODULE VS CUSTOM MODULE

Each module must have:

```text
is_system
```

System modules:

```text
Students
Employees
Fees
Examination
Attendance
```

Custom modules:

```text
Alumni
Research
Event Management
Accreditation
Any future module
```

System modules cannot be accidentally deleted.

---

# 123. DYNAMIC MENU

Menu must come from database permissions.

Example:

```text
Dashboard
Students
Employees
Fees
Reports
```

If user does not have permission:

```text
Menu hidden
Route protected
Database access denied
```

Do not rely only on hiding the menu.

---

# 124. DYNAMIC SEARCH

Global search should automatically include configured searchable fields.

Search:

```text
Student
Employee
Book
Inventory
Vendor
Certificate
Notice
Custom Modules
```

---

# 125. DYNAMIC IMPORT

Import mapping must be configurable.

Example:

```text
Excel Column
       ↓
ERP Field

Student Name
       ↓
student_name

Enrollment No
       ↓
enrollment_no

Mobile
       ↓
mobile
```

Admin should preview before importing.

---

# 126. DYNAMIC EXPORT

Export should respect:

```text
Current filters
Visible columns
User permissions
College isolation
```

A user must never export another college's data.

---

# 127. DYNAMIC VALIDATION

Support:

```text
Required
Unique
Regex
Min
Max
Length
Email
Mobile
Date
File Type
File Size
Database Lookup
Custom Rule
```

---

# 128. FORMULA ENGINE

Support calculated fields.

Example:

```text
Total =
Tuition Fee + Library Fee + Exam Fee
```

Example:

```text
Net Salary =
Gross Salary - Total Deductions
```

Example:

```text
Attendance % =
Present / Total Classes * 100
```

Calculated fields must be configurable.

Do not execute arbitrary JavaScript from database configuration.

Use a safe formula parser/whitelist.

---

# 129. DYNAMIC ROW NUMBERING

Tables should support automatic row numbering:

```text
1
2
3
4
5
```

Row numbering must work correctly with pagination and filtering.

---

# 130. DYNAMIC MASTER TABLES

The following must be configurable Masters:

```text
Gender
Blood Group
Category
Religion
Nationality
Designation
Employee Type
Department
Programme
Semester
Division
Subject
Leave Type
Fee Type
Payment Mode
Book Category
Inventory Category
Vehicle Type
Maintenance Category
Certificate Type
Notice Type
```

Do not hard-code these unnecessarily.

---

# 131. DATABASE INDEXING

Create indexes for:

```text
college_id
student_id
employee_id
enrollment_no
department_id
programme_id
semester_id
academic_year_id
created_at
status
```

Also create composite indexes for common college-specific queries.

---

# 132. DATA INTEGRITY

Use:

```text
Foreign Keys
Unique Constraints
Check Constraints
Not Null
Indexes
Triggers where appropriate
Database Functions where appropriate
```

Never rely entirely on frontend validation.

---

# 133. AUDIT FOR DYNAMIC SYSTEM

Whenever an admin changes:

```text
Form
Field
Table
Column
Workflow
Permission
Dropdown
Master
```

create an audit record.

Example:

```text
Admin changed Student Form

Added:
Blood Group

Changed:
Mobile → Required

Deleted:
Old Field
```

---

# 134. AI IMPLEMENTATION REQUIREMENT

The coding AI must understand:

This is NOT just a collection of static CRUD pages.

It is:

```text
COLLEGE ERP
+
MULTI-TENANT
+
DYNAMIC FORM ENGINE
+
DYNAMIC TABLE ENGINE
+
DYNAMIC REPORT ENGINE
+
DYNAMIC WORKFLOW ENGINE
+
ROLE/PERMISSION ENGINE
```

All components must be reusable.

---

# 135. FINAL ACCEPTANCE TEST

The following test must work without changing source code:

```text
Login as Super Admin

Create:
College 5

Create:
Custom Module = Alumni

Create Fields:
Alumni ID
Student Name
Passing Year
Company
Designation
Mobile
Email

Save

System automatically creates:

Menu
Form
Add Page
Edit Page
View Page
Table
Search
Filter
Pagination
Export
Permissions
Audit Log
```

Then login as College 5 Admin.

The Alumni module must be available according to permission.

Login as College 1 Admin.

College 5 Alumni data must NOT be visible.

---

# 136. SECOND ACCEPTANCE TEST

Create a custom form:

```text
Event Registration
```

Fields:

```text
Name
Mobile
Email
Department
Programme
Semester
Event
Registration Date
Photo
```

Configure:

```text
Mobile = Required
Email = Required
Programme = Dropdown
Semester = Dependent Dropdown
Photo = Image Upload
```

The application must generate the working form without developer code.

---

# 137. THIRD ACCEPTANCE TEST

Create dynamic table:

```text
Event Registration
```

Columns:

```text
Registration No
Name
Department
Programme
Semester
Event
Date
Status
Actions
```

Configure:

```text
Search
Filter
Sort
Pagination
Export
Print
View
Edit
Delete
```

All must work automatically.

---

# 138. FINAL DEVELOPMENT RULE

When generating this ERP:

1. First create the database architecture.
2. Then create RLS policies.
3. Then authentication.
4. Then role/permission system.
5. Then multi-college system.
6. Then dynamic Form Builder.
7. Then dynamic Table Builder.
8. Then dynamic Workflow Builder.
9. Then dynamic Report Builder.
10. Then implement standard ERP modules using the same reusable engine.

Do not duplicate code for every module.

Create reusable:

```text
DynamicForm
DynamicField
DynamicTable
DynamicFilter
DynamicModal
DynamicReport
DynamicWorkflow
DynamicPermission
DynamicMaster
```

components.

---

# 139. FINAL COMMAND

The final project MUST run using:

```bash
npm install
npm run dev
```

and production build:

```bash
npm run check
npm run build
npm run preview
```

No separate backend server is required.

Use:

```text
SvelteKit
+
Supabase
+
PostgreSQL
+
Node.js
+
GitHub
```

END OF DYNAMIC ERP REQUIREMENTS
