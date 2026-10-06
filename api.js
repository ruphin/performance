// Mock API used by all benchmark apps. Mounted as connect middleware on the
// Vite dev and preview servers (see vite.config.js).

const messages = [
  { text: 'Welcome at the performance login.', code: 'blue' },
  { text: 'Please login with username an password.', code: 'blue' },
  { text: 'Sorry, an error occurred.', code: 'blue' },
  { text: 'Our data center is on fire hold on.', code: 'blue' }
];

function send(res, body) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.setEncoding('utf8');
    req.on('data', chunk => (data += chunk));
    req.on('end', () => {
      const type = req.headers['content-type'] || '';
      try {
        if (type.includes('application/json')) return resolve(JSON.parse(data || '{}'));
        return resolve(Object.fromEntries(new URLSearchParams(data)));
      } catch (e) {
        return resolve({});
      }
    });
    req.on('error', reject);
  });
}

// Connect middleware, expected to be mounted at /api
export async function apiMiddleware(req, res, next) {
  const path = req.url.split('?')[0];

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.statusCode = 204;
    return res.end();
  }

  if (req.method === 'GET' && path === '/status') {
    const messageNumber = Math.floor(Math.random() * 4);
    return setTimeout(() => send(res, messages[messageNumber]), 200);
  }

  if (req.method === 'POST' && path === '/login') {
    const body = await readBody(req);
    const username = String(body.username || '').toUpperCase();
    const password = String(body.password || '').toUpperCase();
    if (username === 'HELLO' && password === 'WORLD') {
      return send(res, { text: 'Successful login.', code: 'green' });
    }
    return send(res, { text: 'Error login please try again', code: 'red' });
  }

  return next();
}
