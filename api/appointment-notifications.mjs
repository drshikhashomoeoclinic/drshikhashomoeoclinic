import { handler as netlifyHandler } from '../netlify/functions/appointment-notifications.mjs';

export default async function handler(req, res) {
  const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
  const result = await netlifyHandler({
    httpMethod: req.method,
    body
  });

  Object.entries(result.headers || {}).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  res.status(result.statusCode || 200).send(result.body || '');
}
