/* eslint-disable max-len */
import {connection} from '../src/services/db.js';
import dotenv from 'dotenv';
import fs from 'fs';
import {fileURLToPath} from 'url';
import {dirname, join, resolve} from 'path';
import mssql from 'mssql';
import {promisify} from 'util';
import {exec} from 'child_process';

const execPromise = promisify(exec);

/*
 * RESTORE DATABASE [mock] FROM DISK = N'C:\rc_backup\mock_backup.bak'
 * WITH MOVE 'mock'
 * TO 'C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESS1\MSSQL\DATA\mock.mdf',
 * MOVE 'mock_log'
 * TO 'C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESS1\MSSQL\DATA\mock_log.ldf'
 * WITH NORECOVERY;
 *
 * icacls c:\rc_backup_client /t /grant Everyone:R
 */

const prepareDir = async (moveDone, dir) => {
  try {
    if (moveDone !== true) throw Error('Not done moving files yet');
    if (process.platform !== 'win32') {
      return;
    }
    const cmd = `icacls ${dir} /t /grant Everyone:R`;
    const {stdout, stderr} = await execPromise(cmd);
    console.log(cmd);
    console.log(stdout);
    console.log(stderr);
  } catch (e) {
    console.error(e);
    return false;
  }
  return true;
};

const createConnection = async (config) => {
  const sqlConfig = {
    user: config.username,
    password: config.password,
    server: config.server,
    port: config.port,
    trustServerCertificate: true,
  };

  await mssql.connect(sqlConfig);

  return mssql;
};

const restoreLog = async (prepareDone, connection, logs) => {
  if (!prepareDone) {
    return;
  }
  const record = await connection.query(
      `SELECT SERVERPROPERTY('instancedefaultdatapath') AS [DefaultFile]`,
  );
  const dataLoc = record['recordset'][0]['DefaultFile'];
  const dir = process.env.DIR_BACKUP;
  const isDone = await Promise.all(logs.map(async (log) => {
    try {
      if (log.type === 'backup') {
        return;
      }
      const fileName = log.filename;
      const database = log.database;
      const stmt =`RESTORE LOG [${database}] FROM DISK = N'${dir}${fileName}'
      WITH STANDBY= '${dataLoc}${database}_standby.bak'`;
      const isRestore = await connection.query(stmt);
      if (isRestore) {
        await restoreCallback(null, log);
      }
    } catch (error) {
      console.error(error);
    }
  }));

  if (isDone) {
    return true;
  }
};

const restoreCallback = async (err, log) => {
  try {
    if (err) throw err;
    console.log(`successfully moving ${log.filename}`);

    return await connection('logs')
        .where('id', log.id)
        .update({
          is_restore: 1,
        });
  } catch (e) {
    console.error(e);
  }
};

const getLogs = async () => {
  try {
    const logs = await connection.select(
        'id', 'filename', 'database', 'type', 'is_move', 'is_restore')
        .where({is_move: 0})
        .orWhere({is_restore: 0})
        .from('logs');

    if (logs) {
      return logs;
    }
  } catch (e) {
    console.error(e);
  }
};

const moveCallback = async (err, log) => {
  try {
    if (err) throw err;
    console.log(`successfully moving ${log.filename}`);

    return await connection('logs')
        .where('id', log.id)
        .update({
          is_move: 1,
        });
  } catch (e) {
    console.error(e);
  }
};

const move = (source, target, log) => {
  return new Promise((resolve, reject) => {
    try {
      fs.rename(source, target, async (err) => {
        resolve(await moveCallback(err, log));
      });
    } catch (e) {
      reject(e);
    };
  });
};

const moveLogs = async (logs) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const isDone = await Promise.all(logs.map(async (log) => {
    if (log.is_move !== 1) {
      const source = join(__dirname, '../', 'uploads/', log.filename);
      const target = join(resolve(process.env.DIR_BACKUP), log.filename);
      await move(source, target, log);
    }
  }));

  if (isDone) {
    return true;
  }
};

const main = async () => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    dotenv.config({path: __dirname+'/.env'});
    const logs = await getLogs();
    const config = {
      username: process.env.MSSQL_USERNAME,
      password: process.env.MSSQL_PASSWORD,
      server: process.env.MSSQL_HOST,
      port: Number(process.env.MSSQL_PORT),
    };

    const mssql = await createConnection(config);
    const moveDone = await moveLogs(logs);
    const prepareDone = await prepareDir(moveDone, process.env.DIR_BACKUP);
    const restoreDone = await restoreLog(prepareDone, mssql, logs);

    if (restoreDone) {
      mssql.close();
      connection.destroy();
    }
  } catch (e) {
    console.error(e);
  }
  return;
};

main();
