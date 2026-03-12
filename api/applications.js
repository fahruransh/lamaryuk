// GET  /api/applications  → list all
// POST /api/applications  → create new

const { v4: uuidv4 } = require('uuid');
const sheets = require('./_lib/sheets');

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const VALID_STATUS = ['Draft','Sudah Dilamar','Diproses','Interview','Tes','Offer','Ditolak','Diterima'];

function validate(body) {
  const errors = [];
  if (!body.perusahaan?.trim()) errors.push('Nama perusahaan wajib diisi');
  if (!body.posisi?.trim())     errors.push('Posisi wajib diisi');
  if (!body.kota?.trim())       errors.push('Kota wajib diisi');
  if (!body.tanggal_lamar)      errors.push('Tanggal lamar wajib diisi');
  if (!VALID_STATUS.includes(body.status)) errors.push('Status tidak valid');
  return errors;
}

module.exports = async function handler(req, res) {
  // CORS preflight
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(200).end();

  // ── GET all ──────────────────────────────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const data = await sheets.getAllApplications();
      return res.status(200).json({ success: true, data, count: data.length });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Gagal mengambil data', error: err.message });
    }
  }

  // ── POST create ──────────────────────────────────────────────────────────
  if (req.method === 'POST') {
    const body   = req.body || {};
    const errors = validate(body);
    if (errors.length) {
      return res.status(400).json({ success: false, message: errors[0], errors });
    }
    try {
      const payload = { id: body.id || uuidv4(), ...body };
      const result  = await sheets.addApplication(payload);
      return res.status(201).json({ success: true, data: result, message: 'Yeay, lamaran berhasil disimpan 💌' });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Gagal menyimpan lamaran', error: err.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
};
