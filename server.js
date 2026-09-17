require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const supabaseStore = require('./lib/supabase-store');

const app = express();
const port = process.env.PORT || 3000;

const colleges = [
  { id: 'COL001', name: 'Northbridge Institute', shortName: 'NBI', city: 'Ahmedabad', students: 2840, employees: 186, attendance: 92.4, fees: 84.2, color: '#d96c45' },
  { id: 'COL002', name: 'Riverstone College', shortName: 'RSC', city: 'Vadodara', students: 2160, employees: 154, attendance: 89.8, fees: 79.6, color: '#287d72' },
  { id: 'COL003', name: 'Aravalli School of Technology', shortName: 'AST', city: 'Gandhinagar', students: 1980, employees: 142, attendance: 91.1, fees: 87.4, color: '#4e68a1' },
  { id: 'COL004', name: 'Westfield Arts & Commerce', shortName: 'WAC', city: 'Surat', students: 1740, employees: 121, attendance: 88.6, fees: 75.9, color: '#b8893e' },
  { id: 'COL005', name: 'Cedar Grove University', shortName: 'CGU', city: 'Rajkot', students: 1320, employees: 98, attendance: 93.2, fees: 81.8, color: '#795b8f' },
];

const collegeData = new Map(colleges.map((college) => [college.id, {
  departments: [
    { id: `${college.id}-DEP001`, name: 'Computer Engineering', code: 'CE' },
    { id: `${college.id}-DEP002`, name: 'Management', code: 'MG' },
  ],
  courses: [],
  students: [],
}]));

const dataDirectory = path.join(__dirname, 'data');
const dataFile = path.join(dataDirectory, 'erp-data.json');

function saveStore() {
  fs.mkdirSync(dataDirectory, { recursive: true });
  fs.writeFileSync(dataFile, JSON.stringify({ colleges, collegeData: Object.fromEntries(collegeData) }, null, 2));
}

function loadStore() {
  if (!fs.existsSync(dataFile)) {
    saveStore();
    return;
  }

  try {
    const saved = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    colleges.splice(0, colleges.length, ...(saved.colleges || []));
    collegeData.clear();
    Object.entries(saved.collegeData || {}).forEach(([id, data]) => collegeData.set(id, data));
  } catch (error) {
    console.error('Could not load ERP data store; using seed data.', error.message);
    saveStore();
  }
}

loadStore();

const modules = [
  { id: 'overview', label: 'Overview', icon: '◈' },
  { id: 'students', label: 'Students', icon: '◎', count: 10040 },
  { id: 'admissions', label: 'Admissions', icon: '↗', count: 128 },
  { id: 'academics', label: 'Academics', icon: '▤' },
  { id: 'attendance', label: 'Attendance', icon: '◷' },
  { id: 'examination', label: 'Examination', icon: '□' },
  { id: 'fees', label: 'Fees & Accounts', icon: '₹', count: 246 },
  { id: 'employees', label: 'Employees & HR', icon: '♙' },
  { id: 'library', label: 'Library', icon: '▥' },
  { id: 'inventory', label: 'Inventory', icon: '⌂' },
  { id: 'reports', label: 'Reports', icon: '▥' },
  { id: 'college-setup', label: 'College Setup', icon: '+' },
];

app.use(express.json());
app.use(express.static('public'));
app.get('/api/bootstrap', async (_req, res) => {
  try {
    const visibleColleges = supabaseStore.enabled ? await supabaseStore.listColleges() : colleges;
    res.json({ colleges: visibleColleges, modules, academicYear: '2026-27', currency: 'INR', storage: supabaseStore.enabled ? 'supabase' : 'local' });
  } catch (error) {
    res.status(502).json({ error: 'Supabase could not load college data.', detail: error.message });
  }
});
app.post('/api/colleges', async (req, res) => {
  const { name, shortName, city } = req.body || {};
  if (!name || !shortName || !city) return res.status(400).json({ error: 'College name, short name, and city are required.' });
  const id = `COL${String(colleges.length + 1).padStart(3, '0')}`;
  const college = { id, name: name.trim(), shortName: shortName.trim().toUpperCase(), city: city.trim(), students: 0, employees: 0, attendance: 0, fees: 0, color: '#4e68a1' };
  try {
    if (supabaseStore.enabled) await supabaseStore.insertCollege(college);
    colleges.push(college);
    collegeData.set(id, { departments: [], courses: [], students: [] });
    saveStore();
    res.status(201).json(college);
  } catch (error) {
    res.status(502).json({ error: 'Supabase could not save the college.', detail: error.message });
  }
});
app.post('/api/college/:id/departments', async (req, res) => {
  const college = colleges.find((item) => item.id === req.params.id);
  const data = collegeData.get(req.params.id);
  const { name, code } = req.body || {};
  if (!college || !data) return res.status(404).json({ error: 'College not found' });
  if (!name || !code) return res.status(400).json({ error: 'Department name and code are required.' });
  const department = { id: `${college.id}-DEP${String(data.departments.length + 1).padStart(3, '0')}`, name: name.trim(), code: code.trim().toUpperCase() };
  try {
    if (supabaseStore.enabled) await supabaseStore.insertDepartment(department, college.id);
    data.departments.push(department);
    saveStore();
    res.status(201).json(department);
  } catch (error) {
    res.status(502).json({ error: 'Supabase could not save the department.', detail: error.message });
  }
});
app.post('/api/college/:id/courses', async (req, res) => {
  const college = colleges.find((item) => item.id === req.params.id);
  const data = collegeData.get(req.params.id);
  const { departmentId, name, code, intake, acpcCode } = req.body || {};
  if (!college || !data) return res.status(404).json({ error: 'College not found' });
  if (!departmentId || !name || !code || !intake || !acpcCode) return res.status(400).json({ error: 'Department, course name, course code, intake, and ACPC code are required.' });
  if (!data.departments.some((department) => department.id === departmentId)) return res.status(400).json({ error: 'Department does not belong to this college.' });
  const course = { id: `${college.id}-CRS${String(data.courses.length + 1).padStart(3, '0')}`, collegeId: college.id, departmentId, name: name.trim(), code: code.trim().toUpperCase(), intake: Number(intake), acpcCode: acpcCode.trim().toUpperCase() };
  try {
    if (supabaseStore.enabled) await supabaseStore.insertCourse(course);
    data.courses.push(course);
    saveStore();
    res.status(201).json(course);
  } catch (error) {
    res.status(502).json({ error: 'Supabase could not save the course.', detail: error.message });
  }
});
app.get('/api/college/:id/students', async (req, res) => {
  if (supabaseStore.enabled) {
    try {
      const data = await supabaseStore.getCollege(req.params.id);
      return res.json(data.students);
    } catch (error) {
      return res.status(502).json({ error: 'Supabase could not load students.', detail: error.message });
    }
  }
  const data = collegeData.get(req.params.id);
  if (!data) return res.status(404).json({ error: 'College not found' });
  res.json(data.students || []);
});
app.post('/api/college/:id/students', async (req, res) => {
  const college = colleges.find((item) => item.id === req.params.id);
  const data = collegeData.get(req.params.id);
  const { firstName, lastName, enrollmentNumber, programme, semester, mobile, status } = req.body || {};
  if (!college || !data) return res.status(404).json({ error: 'College not found' });
  if (!firstName || !lastName || !enrollmentNumber || !programme || !semester) return res.status(400).json({ error: 'First name, last name, enrollment number, programme, and semester are required.' });
  if ((data.students || []).some((student) => student.enrollmentNumber.toLowerCase() === enrollmentNumber.trim().toLowerCase())) return res.status(409).json({ error: 'Enrollment number already exists in this college.' });
  const student = { id: `${college.id}-STU${String((data.students || []).length + 1).padStart(4, '0')}`, collegeId: college.id, firstName: firstName.trim(), lastName: lastName.trim(), enrollmentNumber: enrollmentNumber.trim().toUpperCase(), programme: programme.trim(), semester: Number(semester), mobile: (mobile || '').trim(), status: status || 'Active' };
  try {
    if (supabaseStore.enabled) await supabaseStore.insertStudent(student);
    data.students = data.students || [];
    data.students.push(student);
    college.students += 1;
    saveStore();
    res.status(201).json(student);
  } catch (error) {
    res.status(502).json({ error: 'Supabase could not save the student.', detail: error.message });
  }
});
app.get('/api/college/:id', async (req, res) => {
  if (supabaseStore.enabled) {
    try {
      const remote = await supabaseStore.getCollege(req.params.id);
      return res.json({ ...remote, activity: [] });
    } catch (error) {
      return res.status(502).json({ error: 'Supabase could not load college data.', detail: error.message });
    }
  }
  const college = colleges.find((item) => item.id === req.params.id);
  if (!college) return res.status(404).json({ error: 'College not found' });
  const data = collegeData.get(college.id);
  res.json({
    college,
    departments: data.departments.map((department, index) => ({ ...department, students: Math.round(college.students * [0.28, 0.2, 0.18, 0.16, 0.18][index % 5]), color: [college.color, '#287d72', '#b8893e', '#4e68a1', '#795b8f'][index % 5] })),
    courses: data.courses,
    students: data.students || [],
    legacyDepartments: [
      { name: 'Computer Engineering', students: Math.round(college.students * 0.28), color: college.color },
      { name: 'Management', students: Math.round(college.students * 0.2), color: '#287d72' },
      { name: 'Commerce', students: Math.round(college.students * 0.18), color: '#b8893e' },
      { name: 'Science', students: Math.round(college.students * 0.16), color: '#4e68a1' },
      { name: 'Arts & Humanities', students: Math.round(college.students * 0.18), color: '#795b8f' },
    ],
    activity: [
      { title: 'Fee receipt generated', detail: 'Student ST-24018 · Tuition fee', time: '12 min ago' },
      { title: 'Admission application approved', detail: 'Application AD-2026-084 · Computer Engineering', time: '28 min ago' },
      { title: 'Leave request submitted', detail: 'Dr. Meera Shah · 18-20 Sep', time: '1 hr ago' },
      { title: 'New notice published', detail: 'Mid-semester examination schedule', time: '2 hrs ago' },
    ],
  });
});
app.get('*', (_req, res) => res.sendFile('index.html', { root: 'public' }));
app.listen(port, () => console.log(`College ERP running at http://localhost:${port}`));
