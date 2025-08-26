export default function handler(req, res) {
  const { keyid, key } = req.query;

  if (!keyid || !key) {
    return res.status(400).json({
      error: 'Missing Key ID or Key'
    });
  }

  function hexToBase64Url(hex) {
    try {
      const bytes = new Uint8Array(hex.match(/.{1,2}/g).map(b => parseInt(b, 16)));
      return Buffer.from(bytes).toString("base64").replace(/=+$/, '');
    } catch {
      return '';
    }
  }

  const finalKeyId64 = hexToBase64Url(keyid);
  const finalKey64 = hexToBase64Url(key);

  if (!finalKeyId64 || !finalKey64) {
    return res.status(400).json({
      error: 'Invalid Key ID or Key format'
    });
  }

  res.setHeader("Content-Type", "application/json");
  res.status(200).json({
    keys: [{ kty: "oct", k: finalKey64, kid: finalKeyId64 }],
    type: "temporary"
  });
}
