// Shared Google Sheets service for Vercel serverless functions
// Uses GOOGLE_SERVICE_ACCOUNT_JSON env var (JSON string) instead of a key file

const { google } = require('googleapis');

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const SHEET_NAME     = 'Lamaran';

const HEADERS = [
  'id','created_at','tanggal_lamar','perusahaan','posisi',
  'kota','metode_kirim','sumber_lowongan','status','kontak_hr',
  'link_lowongan','estimasi_gaji','catatan','updated_at','is_favorit'
];

// ── Auth ──────────────────────────────────────────────────────────────────────
async function getAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON env var tidak ada');
  const credentials = JSON.parse(raw);
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

async function getSheetsClient() {
  const auth = await getAuth();
  return google.sheets({ version: 'v4', auth });
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function rowToObject(row) {
  const obj = {};
  HEADERS.forEach((h, i) => { obj[h] = row[i] ?? ''; });
  return obj;
}

function objectToRow(obj) {
  return HEADERS.map(h => (obj[h] != null ? String(obj[h]) : ''));
}

// ── Init ──────────────────────────────────────────────────────────────────────
async function initializeSheet() {
  try {
    const sheets = await getSheetsClient();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:O1`,
    });
    if (!res.data.values?.length) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A1`,
        valueInputOption: 'RAW',
        requestBody: { values: [HEADERS] },
      });
    }
  } catch (e) { /* ignore — sheet may already be initialized */ }
}

// ── CRUD ──────────────────────────────────────────────────────────────────────
async function getAllApplications() {
  const sheets = await getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A2:O`,
  });
  return (res.data.values || []).map(rowToObject).filter(a => a.id?.trim());
}

async function addApplication(data) {
  await initializeSheet();
  const sheets = await getSheetsClient();
  const now = new Date().toISOString();
  const appData = { ...data, created_at: now, updated_at: now, is_favorit: data.is_favorit || 'false' };
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A:O`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [objectToRow(appData)] },
  });
  return appData;
}

async function updateApplication(id, updateData) {
  const sheets = await getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A:O`,
  });
  const rows = res.data.values || [];
  const idx  = rows.findIndex((r, i) => i > 0 && r[0] === id);
  if (idx === -1) throw new Error(`Lamaran dengan ID ${id} tidak ditemukan`);
  const now     = new Date().toISOString();
  const updated = { ...rowToObject(rows[idx]), ...updateData, updated_at: now };
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A${idx + 1}:O${idx + 1}`,
    valueInputOption: 'RAW',
    requestBody: { values: [objectToRow(updated)] },
  });
  return updated;
}

async function deleteApplication(id) {
  const sheets = await getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID, range: `${SHEET_NAME}!A:O`,
  });
  const rows = res.data.values || [];
  const idx  = rows.findIndex((r, i) => i > 0 && r[0] === id);
  if (idx === -1) throw new Error(`Lamaran dengan ID ${id} tidak ditemukan`);
  const info  = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const sheet = info.data.sheets.find(s => s.properties.title === SHEET_NAME);
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [{ deleteDimension: {
        range: { sheetId: sheet.properties.sheetId, dimension: 'ROWS', startIndex: idx, endIndex: idx + 1 }
      }}]
    },
  });
  return { success: true, id };
}

module.exports = { getAllApplications, addApplication, updateApplication, deleteApplication };
