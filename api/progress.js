const { kv } = require('@vercel/kv');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const email = (req.query.email || '').toLowerCase().trim();
  if (!email) return res.status(400).json({ error: 'email required' });

  const key = 'iod:' + email;

  try {
    if (req.method === 'GET') {
      const data = await kv.get(key);
      return res.json(data || null);
    }
    if (req.method === 'POST') {
      const { cur, ans } = req.body;
      await kv.set(key, { cur, ans });
      return res.json({ ok: true });
    }
    if (req.method === 'DELETE') {
      await kv.del(key);
      return res.json({ ok: true });
    }
    res.status(405).json({ error: 'method not allowed' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
