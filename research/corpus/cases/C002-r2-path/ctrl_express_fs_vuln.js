// C002-K-V | CWE-22 | calibration: Express -> fs.readFileSync
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
const app = express();

function readPublicFile(baseDir, key) {
  const data = fs.readFileSync(path.join(baseDir, 'public', key)); // SINK
  return data.toString('utf8');
}

app.get('/api/v1/corpus/c002/files', async (req, res) => {
  const key = req.query.key;
  res.send(readPublicFile(req.app.locals.filesDir, key));
});

export default app;
