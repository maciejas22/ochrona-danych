import * as crypto from 'crypto';

import { hashPassword } from './hash';

const ALGORITHMS = 'aes-256-cbc';

export function generateIV() {
  return crypto.randomBytes(16).toString('hex');
}

export function encrypt(data: string, iv: string, key: string) {
  const ivBuffer = Buffer.from(iv, 'hex');
  const keyBuffer = Buffer.from(key, 'hex');

  const cipher = crypto.createCipheriv(ALGORITHMS, keyBuffer, ivBuffer);
  const encrypted = cipher.update(data, 'utf-8', 'hex') + cipher.final('hex');
  return encrypted;
}

export function decrypt(data: string, iv: string, key: string) {
  const ivBuffer = Buffer.from(iv, 'hex');
  const keyBuffer = Buffer.from(key, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHMS, keyBuffer, ivBuffer);
  const decrypted =
    decipher.update(data, 'hex', 'utf-8') + decipher.final('utf-8');
  return decrypted;
}

export function getKEK(partialPassword: string, salt: string) {
  return hashPassword(partialPassword, salt).hash;
}

export function generateKey() {
  return crypto.randomBytes(32).toString('hex');
}
