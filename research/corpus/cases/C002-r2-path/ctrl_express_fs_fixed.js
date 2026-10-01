// C002-K-F | CWE-22 | calibration fixed: Express -> fs.readFileSync
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
const app = express();

function readPublicFile(baseDir, key) {
  const publicDir = path.resolve(baseDir, 'public');
  const target = path.resolve(publicDir, key);
  if (!target.startsWith(publicDir + path.sep)) return null;
  const data = fs.readFileSync(target);
  return data.toString('utf8');
}

app.get('/api/v1/corpus/c002/files', async (req, res) => {
  const key = req.query.key;
  res.send(readPublicFile(req.app.locals.filesDir, key));
});

export default app;
