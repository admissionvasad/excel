const { createClient } = require('@supabase/supabase-js');

const url = process.env.PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const enabled = Boolean(url && serviceRoleKey);
const client = enabled ? createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } }) : null;

function assertConfigured() {
  if (!enabled) throw new Error('Supabase is not configured. Set PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
}

async function listColleges() {
  assertConfigured();
  const { data, error } = await client.from('colleges').select('*').order('code');
  if (error) throw error;
  return data.map(mapCollege);
}

function mapCollege(row) {
  return { id: row.id, name: row.name, shortName: row.short_name, city: row.city, students: row.students, employees: row.employees, attendance: Number(row.attendance), fees: Number(row.fees), color: row.color };
}

function mapDepartment(row) {
  return { id: row.id, name: row.name, code: row.code };
}

function mapCourse(row) {
  return { id: row.id, collegeId: row.college_id, departmentId: row.department_id, name: row.name, code: row.code, intake: row.intake, acpcCode: row.acpc_code };
}

function mapStudent(row) {
  return { id: row.id, collegeId: row.college_id, firstName: row.first_name, lastName: row.last_name, enrollmentNumber: row.enrollment_number, programme: row.programme, semester: row.semester, mobile: row.mobile || '', status: row.status };
}

async function getCollege(id) {
  assertConfigured();
  const [collegeResult, departmentResult, courseResult, studentResult] = await Promise.all([
    client.from('colleges').select('*').eq('id', id).single(),
    client.from('departments').select('*').eq('college_id', id).order('code'),
    client.from('courses').select('*').eq('college_id', id).order('code'),
    client.from('students').select('*').eq('college_id', id).order('enrollment_number'),
  ]);
  if (collegeResult.error) throw collegeResult.error;
  if (departmentResult.error) throw departmentResult.error;
  if (courseResult.error) throw courseResult.error;
  if (studentResult.error) throw studentResult.error;
  return { college: mapCollege(collegeResult.data), departments: departmentResult.data.map(mapDepartment), courses: courseResult.data.map(mapCourse), students: studentResult.data.map(mapStudent) };
}

async function insertCollege(college) {
  assertConfigured();
  const { data, error } = await client.from('colleges').insert({ id: college.id, code: college.id, name: college.name, short_name: college.shortName, city: college.city, color: college.color }).select('*').single();
  if (error) throw error;
  return data;
}

async function insertDepartment(department, collegeId) {
  assertConfigured();
  const { data, error } = await client.from('departments').insert({ id: department.id, college_id: collegeId, code: department.code, name: department.name }).select('*').single();
  if (error) throw error;
  return data;
}

async function insertCourse(course) {
  assertConfigured();
  const { data, error } = await client.from('courses').insert({ id: course.id, college_id: course.collegeId, department_id: course.departmentId, code: course.code, name: course.name, intake: course.intake, acpc_code: course.acpcCode }).select('*').single();
  if (error) throw error;
  return data;
}

async function insertStudent(student) {
  assertConfigured();
  const { data, error } = await client.from('students').insert({ id: student.id, college_id: student.collegeId, first_name: student.firstName, last_name: student.lastName, enrollment_number: student.enrollmentNumber, programme: student.programme, semester: student.semester, mobile: student.mobile, status: student.status }).select('*').single();
  if (error) throw error;
  return data;
}

module.exports = { enabled, listColleges, getCollege, insertCollege, insertDepartment, insertCourse, insertStudent };
