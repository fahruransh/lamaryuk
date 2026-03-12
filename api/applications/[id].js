// PUT    /api/applications/:id  → update
// DELETE /api/applications/:id  → delete

const sheets = require('../_lib/sheets');

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

module.exports = async function handler(req, res) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;

  // ── PUT update ───────────────────────────────────────────────────────────
  if (req.method === 'PUT') {
    try {
      const result = await sheets.updateApplication(id, req.body || {});
      return res.status(200).json({ success: true, data: result, message: 'Data berhasil diperbarui ✨' });
    } catch (err) {
      const status = err.message.includes('tidak ditemukan') ? 404 : 500;
      return res.status(status).json({ success: false, message: err.message });
    }
  }

  // ── DELETE ───────────────────────────────────────────────────────────────
  if (req.method === 'DELETE') {
    try {
      await sheets.deleteApplication(id);
      return res.status(200).json({ success: true, message: 'Data berhasil dihapus' });
    } catch (err) {
      const status = err.message.includes('tidak ditemukan') ? 404 : 500;
      return res.status(status).json({ success: false, message: err.message });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
};
