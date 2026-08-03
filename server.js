const express = require('express');
const { execSync } = require('child_process');
const multer = require('multer');
const ExcelJS = require('exceljs');
const pdfParse = require('pdf-parse');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.static('public'));
app.use(express.json());

function normalizeText(text) {
  return String(text || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function normalizeAlphaNumeric(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function normalizeName(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function normalizeMobile(text) {
  return String(text || '').replace(/\D+/g, '');
}

function safeGetCell(row, col) {
  try {
    return row.getCell(col);
  } catch (error) {
    return { value: '' };
  }
}

function getCellText(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map(getCellText).join(' ');
  }
  if (value.richText) {
    return value.richText.map((part) => String(part.text || '')).join(' ');
  }
  if (value.text) {
    return String(value.text);
  }
  if (value.hyperlink) {
    return String(value.text || value.hyperlink);
  }
  return String(value);
}

function detectColumns(headerRow) {
  const mapping = {};
  headerRow.eachCell((cell, col) => {
    const value = getCellText(cell.value).toLowerCase();
    if (/application\s*number|app\s*no|app\s*id|acpc\s*application|acpc\s*no|application\s*id/.test(value)) {
      mapping.applicationNumber = col;
    }
    if (/name/.test(value) && !mapping.name) {
      mapping.name = col;
    }
    if (/mobile|phone|contact/.test(value) && !mapping.mobileNumber) {
      mapping.mobileNumber = col;
    }
  });
  return mapping;
}

function parseExcelRows(worksheet) {
  const headerRow = worksheet.getRow(1);
  const columns = detectColumns(headerRow);

  if (!columns.applicationNumber && !columns.name && !columns.mobileNumber) {
    columns.applicationNumber = 1;
    columns.name = 2;
    columns.mobileNumber = 3;
  }

  const rows = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    const applicationNumber = normalizeText(getCellText(safeGetCell(row, columns.applicationNumber).value));
    const name = getCellText(safeGetCell(row, columns.name).value).trim();
    const mobileNumber = normalizeMobile(getCellText(safeGetCell(row, columns.mobileNumber).value));

    if (!applicationNumber && !name && !mobileNumber) return;

    rows.push({ applicationNumber, name, mobileNumber });
  });

  return rows;
}

function detectSalaryColumns(headerRow) {
  const mapping = {};
  headerRow.eachCell((cell, col) => {
    const value = getCellText(cell.value).toLowerCase();
    if (/name|faculty|teacher|staff|employee/.test(value) && !mapping.name) {
      mapping.name = col;
    }
    if (/(lecture|class|period|session|hour|hours|unit|units|qty|quantity|count|no\.?\s*of|number of)/.test(value) && !mapping.units) {
      mapping.units = col;
    }
    if (/(rate|per\s*lecture|per\s*hour|amount|salary|pay)/.test(value) && !mapping.rate) {
      mapping.rate = col;
    }
  });
  return mapping;
}

function parseNumeric(value) {
  const parsed = parseFloat(String(getCellText(value)).replace(/[^\d.-]/g, ''));
  return isFinite(parsed) ? parsed : 0;
}

function parseSalaryAttendance(worksheet) {
  const headerRow = worksheet.getRow(1);
  const columns = detectSalaryColumns(headerRow);

  if (!columns.name) columns.name = 1;
  if (!columns.units) columns.units = 2;

  const rows = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    const name = getCellText(safeGetCell(row, columns.name).value).trim();
    const units = parseNumeric(safeGetCell(row, columns.units).value);

    if (!name && !units) return;

    rows.push({ name, units });
  });

  return rows;
}

function parseSalaryRates(worksheet) {
  const headerRow = worksheet.getRow(1);
  const columns = detectSalaryColumns(headerRow);

  if (!columns.name) columns.name = 1;
  if (!columns.rate) columns.rate = 2;

  const rows = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    const name = getCellText(safeGetCell(row, columns.name).value).trim();
    const rate = parseNumeric(safeGetCell(row, columns.rate).value);

    if (!name) return;

    rows.push({ name, rate });
  });

  return rows;
}

function getRecordSignatures(record) {
  const appKey = normalizeAlphaNumeric(record.applicationNumber || '');
  const nameKey = normalizeName(record.name || '');
  const mobileKey = normalizeMobile(record.mobileNumber || '');
  const nameMobileKey = nameKey && mobileKey ? `${nameKey}|${mobileKey}` : '';
  return { appKey, nameKey, mobileKey, nameMobileKey };
}

function addToMap(map, key, record) {
  if (!key) return;
  const list = map.get(key) || [];
  list.push(record);
  map.set(key, list);
}

function findFirstUnmatched(list, matchedSet) {
  if (!list) return null;
  for (const record of list) {
    if (!matchedSet.has(record)) {
      return record;
    }
  }
  return null;
}

function getMonthDates(monthValue) {
  if (!monthValue) return [];
  const [year, month] = monthValue.split('-').map(Number);
  if (!year || !month) return [];
  const daysInMonth = new Date(year, month, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, index) => {
    const date = new Date(year, month - 1, index + 1);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
}

function getWeekdayName(dateValue) {
  const date = new Date(`${dateValue}T00:00:00`);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function normalizeWeekdays(weeklyDays) {
  return String(weeklyDays || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
    .map((value) => value.replace(/\.$/, '').slice(0, 3));
}

function buildFacultyAttendance(month, dailyRate, facultyRows) {
  const monthDates = getMonthDates(month);
  const summaries = [];
  const dateWiseReport = [];

  facultyRows.forEach((faculty) => {
    const weeklyDays = normalizeWeekdays(faculty.weeklyDays);
    const entries = monthDates.map((dateValue) => {
      const weekday = getWeekdayName(dateValue);
      const isWorkingDay = weeklyDays.length === 0 || weeklyDays.includes(weekday.toLowerCase().slice(0, 3));
      const status = faculty.attendance?.[dateValue] || (isWorkingDay ? 'present' : 'absent');
      return { date: dateValue, weekday, workingDay: isWorkingDay, status };
    });

    const presentCount = entries.filter((entry) => entry.status === 'present').length;
    const absentCount = entries.filter((entry) => entry.status === 'absent').length;
    const workingDayCount = entries.filter((entry) => entry.workingDay).length;
    const monthlyAmount = Math.round(presentCount * Number(dailyRate || 0) * 100) / 100;

    summaries.push({
      employeeCode: faculty.employeeCode || '',
      name: faculty.name || '',
      weeklyDays: faculty.weeklyDays || '',
      presentCount,
      absentCount,
      workingDayCount,
      monthlyAmount,
    });

    entries.forEach((entry) => {
      dateWiseReport.push({
        employeeCode: faculty.employeeCode || '',
        name: faculty.name || '',
        date: entry.date,
        weekday: entry.weekday,
        workingDay: entry.workingDay,
        status: entry.status,
      });
    });
  });

  return { month, dailyRate: Number(dailyRate || 0), summaries, dateWiseReport };
}

app.post('/upload', upload.fields([
  { name: 'excelFile1', maxCount: 1 },
  { name: 'excelFile2', maxCount: 1 }
]), async (req, res) => {
  const excelFile1 = req.files?.excelFile1?.[0];
  const excelFile2 = req.files?.excelFile2?.[0];

  if (!excelFile1 || !excelFile2) {
    return res.status(400).json({ error: 'Both Excel files are required.' });
  }

  try {
    const workbook1 = new ExcelJS.Workbook();
    await workbook1.xlsx.load(excelFile1.buffer);
    const worksheet1 = workbook1.worksheets[0];
    if (!worksheet1) {
      return res.status(400).json({ error: 'First Excel file contains no worksheets.' });
    }

    const workbook2 = new ExcelJS.Workbook();
    await workbook2.xlsx.load(excelFile2.buffer);
    const worksheet2 = workbook2.worksheets[0];
    if (!worksheet2) {
      return res.status(400).json({ error: 'Second Excel file contains no worksheets.' });
    }

    const records1 = parseExcelRows(worksheet1);
    const records2 = parseExcelRows(worksheet2);

    if (records1.length === 0 || records2.length === 0) {
      return res.status(400).json({ error: 'One or both Excel files had no valid rows.' });
    }

    const file2AppMap = new Map();
    const file2NameMobileMap = new Map();
    const file2NameMap = new Map();
    const file2MobileMap = new Map();

    records2.forEach((record) => {
      const sig = getRecordSignatures(record);
      addToMap(file2AppMap, sig.appKey, record);
      addToMap(file2NameMobileMap, sig.nameMobileKey, record);
      addToMap(file2NameMap, sig.nameKey, record);
      addToMap(file2MobileMap, sig.mobileKey, record);
    });

    const matched = [];
    const onlyInFirst = [];
    const matchedSecond = new Set();

    records1.forEach((record) => {
      const sig = getRecordSignatures(record);
      let match = null;
      let method = null;

      if (sig.appKey) {
        match = findFirstUnmatched(file2AppMap.get(sig.appKey), matchedSecond);
        method = 'applicationNumber';
      }

      if (!match && sig.nameMobileKey) {
        match = findFirstUnmatched(file2NameMobileMap.get(sig.nameMobileKey), matchedSecond);
        method = 'nameMobile';
      }

      if (!match && sig.nameKey) {
        match = findFirstUnmatched(file2NameMap.get(sig.nameKey), matchedSecond);
        method = 'name';
      }

      if (!match && sig.mobileKey) {
        match = findFirstUnmatched(file2MobileMap.get(sig.mobileKey), matchedSecond);
        method = 'mobile';
      }

      if (match) {
        matched.push({ first: record, second: match, method });
        matchedSecond.add(match);
      } else {
        onlyInFirst.push(record);
      }
    });

    const onlyInSecond = records2.filter((record) => !matchedSecond.has(record));

    res.json({
      matched,
      onlyInFirst,
      onlyInSecond,
      totalFirst: records1.length,
      totalSecond: records2.length,
      branchName: getBranchName(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process the Excel files. Please check the uploaded files and try again.' });
  }
});

app.post('/salary', upload.fields([
  { name: 'attendanceFile', maxCount: 1 },
  { name: 'rateFile', maxCount: 1 }
]), async (req, res) => {
  const attendanceFile = req.files?.attendanceFile?.[0];
  const rateFile = req.files?.rateFile?.[0];

  if (!attendanceFile || !rateFile) {
    return res.status(400).json({ error: 'Both the attendance log and the rate sheet are required.' });
  }

  try {
    const attendanceWorkbook = new ExcelJS.Workbook();
    await attendanceWorkbook.xlsx.load(attendanceFile.buffer);
    const attendanceSheet = attendanceWorkbook.worksheets[0];
    if (!attendanceSheet) {
      return res.status(400).json({ error: 'Attendance file contains no worksheets.' });
    }

    const rateWorkbook = new ExcelJS.Workbook();
    await rateWorkbook.xlsx.load(rateFile.buffer);
    const rateSheet = rateWorkbook.worksheets[0];
    if (!rateSheet) {
      return res.status(400).json({ error: 'Rate file contains no worksheets.' });
    }

    const attendance = parseSalaryAttendance(attendanceSheet);
    const rates = parseSalaryRates(rateSheet);

    if (attendance.length === 0 || rates.length === 0) {
      return res.status(400).json({ error: 'One or both files had no valid rows.' });
    }

    const facultyMap = new Map();
    attendance.forEach((record) => {
      const key = normalizeName(record.name);
      if (!key) return;
      let entry = facultyMap.get(key);
      if (!entry) {
        entry = { name: record.name, units: 0, rate: 0 };
        facultyMap.set(key, entry);
      }
      entry.name = record.name || entry.name;
      entry.units += record.units;
    });

    rates.forEach((record) => {
      const key = normalizeName(record.name);
      if (!key) return;
      let entry = facultyMap.get(key);
      if (!entry) {
        entry = { name: record.name, units: 0, rate: 0 };
        facultyMap.set(key, entry);
      }
      entry.name = record.name || entry.name;
      if (record.rate > 0) entry.rate = record.rate;
    });

    const faculty = Array.from(facultyMap.values()).map((f) => ({
      name: f.name,
      units: f.units,
      rate: f.rate,
      salary: Math.round(f.units * f.rate * 100) / 100,
    }));

    const totalUnits = faculty.reduce((sum, f) => sum + f.units, 0);
    const totalSalary = Math.round(faculty.reduce((sum, f) => sum + f.salary, 0) * 100) / 100;

    res.json({
      faculty,
      totalFaculty: faculty.length,
      totalUnits,
      totalSalary,
      branchName: getBranchName(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process the files. Please check the uploaded files and try again.' });
  }
});

app.post('/faculty-attendance', (req, res) => {
  try {
    const { month, dailyRate, faculty } = req.body || {};

    if (!month) {
      return res.status(400).json({ error: 'Please select a month.' });
    }

    if (!Array.isArray(faculty) || faculty.length === 0) {
      return res.status(400).json({ error: 'Please add at least one faculty entry.' });
    }

    const report = buildFacultyAttendance(month, dailyRate, faculty);
    const totalPresent = report.summaries.reduce((sum, row) => sum + row.presentCount, 0);
    const totalAbsent = report.summaries.reduce((sum, row) => sum + row.absentCount, 0);
    const totalSalary = report.summaries.reduce((sum, row) => sum + row.monthlyAmount, 0);

    res.json({
      ...report,
      totalPresent,
      totalAbsent,
      totalSalary,
      branchName: getBranchName(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to build the faculty attendance report.' });
  }
});

app.get('/branch', (req, res) => {
  res.json({ branchName: getBranchName() });
});

function getBranchName() {
  try {
    const output = execSync('git rev-parse --abbrev-ref HEAD', { cwd: __dirname, encoding: 'utf8' });
    return output.trim();
  } catch (error) {
    return 'unknown';
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`Branch: ${getBranchName()}`);
});
