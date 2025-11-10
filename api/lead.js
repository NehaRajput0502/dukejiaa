// /api/lead.js
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, phone, city, product, ts, page, utm, ua } = req.body || {};
    if (!name || !phone) return res.status(400).json({ error: 'Missing fields' });

    const payload = {
      ts: ts || Date.now(),
      name,
      phone,
      city: city || '',
      product: product || 'Free-Designs',
      source: 'free-designs',
      page: page || (req.headers.referer || ''),
      ua: ua || (req.headers['user-agent'] || ''),
      utm: utm || {}
    };

    const hook = process.env.N8N_WEBHOOK_URL;
    if (hook) {
      await fetch(hook, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};
