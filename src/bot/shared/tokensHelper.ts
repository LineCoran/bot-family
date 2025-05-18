// @ts-nocheck

const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(process.cwd(), 'secrets.json');

export function readTokens() {
  try {
    if (!fs.existsSync(FILE_PATH)) {
      fs.writeFileSync(FILE_PATH, '{}');
      return {};
    }
    const rawData = fs.readFileSync(FILE_PATH, 'utf-8');
    return JSON.parse(rawData);
  } catch (err) {
    console.error('Ошибка чтения secrets.json:', err);
    return {};
  }
}

export function writeTokens(data) {
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Ошибка записи в secrets.json:', err);
  }
}