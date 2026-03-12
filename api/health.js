const CORS = { 'Access-Control-Allow-Origin': '*' };

module.exports = async function handler(req, res) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
  res.status(200).json({ status: 'ok', message: 'LamarYuk API berjalan 💖', timestamp: new Date().toISOString() });
};
