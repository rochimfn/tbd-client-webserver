import express from 'express';
import dotenv from 'dotenv';
import {login} from './services/auth.js';
import {auth} from './middleware/auth.js';
import {upload} from './services/upload.js';
import {connection} from './services/db.js';

const main = () => {
  const app = express();
  const port = 3000;
  dotenv.config();

  app.use(express.json());

  app.get('/', (req, res) => {
    res.json({
      message: 'ok',
    });
  });

  app.get('/welcome', auth, (req, res) => {
    res.status(200).json({message: 'Welcome 🙌 '});
  });

  app.get('/monitor', auth, async (req, res) => {
    const data = await connection.select(
        'database', 'filename', 'type', 'created_at', 'is_move', 'is_restore',
    )
        .from('logs');
    res.status(200).json({message: 'ok', data});
  });

  app.post('/upload', auth, upload.array('logs'), async (req, res) => {
    if (req.files === undefined) {
      res.json({error: 'file not found'});
    } else {
      const metaData = JSON.parse(req.body.metadata);
      try {
        const results = await connection('logs').insert(metaData);
        console.log(results);
      } catch (e) {
        console.log(e);
      }

      res.status(201).json({message: 'ok'});
    }
  });

  app.post('/login', login);

  app.listen(port, '127.0.0.1', () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
};

main();
