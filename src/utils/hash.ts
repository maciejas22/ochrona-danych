import crypto from 'crypto';

export function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

export function hashPassword(password: string, salt?: string) {
  salt = salt ?? generateSalt();
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 32, 'sha256')
    .toString('hex');

  return {
    salt,
    hash,
  };
}

export function comparePassword(
  candidatePassword: string,
  passwordSaltHash: string,
) {
  const { salt, hash } = splitHash(passwordSaltHash);
  const password = hashPassword(candidatePassword, salt).hash;
  return compareHash(password, hash);
}

export function generatePartialPassword(password: string) {
  const indexes = generatePartialPasswordIndexes(password);
  const partialPassword = indexes.map((index) => password[index]).join('');
  const { salt, hash } = hashPassword(partialPassword);

  return {
    partialPassword: partialPassword,
    hash: `${indexes.join('$')}.${salt}${hash}`,
  };
}

export function verifyPartialPassword(
  candidatePartialPassword: string,
  partialPasswordHash: string,
) {
  const { salt, hash } = splitHash(
    partialPasswordHash.slice(partialPasswordHash.indexOf('.') + 1),
  );
  return comparePassword(candidatePartialPassword, salt + hash);
}

function generatePartialPasswordIndexes(password: string): number[] {
  const partialLength = Math.ceil(password.length / 2);
  const indexes = new Set<number>();

  while (indexes.size < partialLength) {
    indexes.add(Math.floor(Math.random() * password.length));
  }

  return Array.from(indexes).sort();
}

export function splitHash(hash: string) {
  return {
    salt: hash.slice(0, 32),
    hash: hash.slice(32),
  };
}

export function compareHash(candidateHash: string, hash: string) {
  const candidateHashBuffer = Buffer.from(candidateHash, 'hex');
  const hashBuffer = Buffer.from(hash, 'hex');

  return crypto.timingSafeEqual(candidateHashBuffer, hashBuffer);
}
