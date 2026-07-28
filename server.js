const express = require('express');
const { execSync } = require('child_process');
const multer = require('multer');
const ExcelJS = require('exceljs');
const pdfParse = require('pdf-parse');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.static('public'));

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

    const applicationNumber = normalizeText(getCellText(row.getCell(columns.applicationNumber).value));
    const name = getCellText(row.getCell(columns.name).value).trim();
    const mobileNumber = normalizeMobile(getCellText(row.getCell(columns.mobileNumber).value));

    if (!applicationNumber && !name && !mobileNumber) return;

    rows.push({ applicationNumber, name, mobileNumber });
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
