import type { NextApiRequest, NextApiResponse } from 'next';

const DRAFT_MODE_SECRET = process.env.DRAFT_MODE_SECRET;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const secret = Array.isArray(req.query.secret) ? req.query.secret[0] : req.query.secret;
  const itemId = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;

  if (!DRAFT_MODE_SECRET) {
    res.status(500).send('Draft mode is not configured on this server');
    return;
  }

  if (!secret || secret !== DRAFT_MODE_SECRET) {
    res.status(401).send('Invalid or missing secret');
    return;
  }

  res.setDraftMode({ enable: true });

  const target = itemId ? `/elibrary?preview=${encodeURIComponent(itemId)}` : '/elibrary';
  res.writeHead(307, { Location: target });
  res.end();
}
