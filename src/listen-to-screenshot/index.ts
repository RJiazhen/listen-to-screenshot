/**
 * listen request to take a android screenshot
 */
import { exec } from 'child_process';
import path from 'path';
import chalk from 'chalk';
import http from 'http';
import { existsSync, mkdirSync } from 'fs';
import { networkInterfaces } from 'os';
import dayjs from 'dayjs';
import portfinder from 'portfinder';

// const chalk = require('chalk');
const adbDir = path.resolve(__dirname, './platform-tools/adb.exe');
const screenShotPath = path.resolve(__dirname, './screenshot');
let port = Number(process.env.PORT || 0) || 3939;
const screenshotApiName = '/screenshot';

const consoleApiInfo = () => {
  consoleSuccess(`Server listening on port ${port}`);

  const ip = getLocalIpAddress();
  console.log(`Go to the following url to take screenshot:`);
  console.log(
    'Local:',
    chalk.blue.bold(`http://localhost:${port}${screenshotApiName}`),
  );
  console.log(
    'On your network:',
    chalk.blue.bold(`http://${ip}:${port}${screenshotApiName}`),
  );
};

const consoleError = (message: string) =>
  console.error(chalk.red.bold(message));
const consoleSuccess = (message: string) =>
  console.log(chalk.green.bold(message));

const getLocalIpAddress = () => {
  const interfaces = networkInterfaces();
  for (const key in interfaces) {
    const infoList = interfaces[key];
    for (const info of infoList || []) {
      if (info.family === 'IPv4' && info.address !== '127.0.0.1') {
        return info.address;
      }
    }
  }
  return 'localhost';
};

const checkAndCreateScreenshotDir = () => {
  if (!screenShotPath) {
    consoleError('screenshot path not found');
    return;
  }
  if (existsSync(screenShotPath)) return;

  console.log('creating screenshot directory');
  mkdirSync(screenShotPath);
};

const screenshot = () => {
  const screenshotFileName = `screenshot_${dayjs().format(
    'YYYY-MM-DD_HH-mm-ss',
  )}.png`;
  const outputPath = path.resolve(screenShotPath, screenshotFileName);
  const execCommand = `${adbDir} exec-out screencap -p > ${outputPath}`;
  checkAndCreateScreenshotDir();

  console.clear();
  console.log('exec screenshot command: ', execCommand);
  consoleApiInfo();

  exec(execCommand, (error, stdout, stderr) => {
    if (error) {
      consoleError(`exec error: ${error}`);
      return;
    }
    stdout && consoleSuccess(`stdout: ${stdout}`);
    stderr && consoleSuccess(`stderr: ${stderr}`);
  });
};

const allowCors = (req: http.IncomingMessage, res: http.ServerResponse) => {
  // enable cors
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type',
  );
};
export const main = async () => {
  /** create a server to listen to screenshot request */
  const server = http.createServer((req, res) => {
    allowCors(req, res);

    if (req.url !== '/screenshot') {
      consoleError(`Invalid request url: ${req.url}`);
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }

    screenshot();
    res.writeHead(200, { 'Content-Type': 'text/plain' });

    res.end('screenshot taken');
  });

  const availablePort = await portfinder.getPortPromise({
    port: port,
    stopPort: 65535,
  });
  port = availablePort;

  server.listen(port, () => {
    console.clear();
    consoleApiInfo();
  });
};
