import { comparePassword, hashPassword, splitHash } from './hash';

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

export function extractPartialPasswordIndexes(partialPasswordHash: string) {
  return partialPasswordHash
    .slice(0, partialPasswordHash.indexOf('.'))
    .split('$')
    .map((index) => parseInt(index));
}

export function extractPartialPasswordHash(partialPasswordHash: string) {
  return partialPasswordHash.slice(partialPasswordHash.indexOf('.') + 1);
}

function generatePartialPasswordIndexes(password: string): number[] {
  const partialLength = Math.ceil(password.length / 2);
  const indexes = new Set<number>();

  while (indexes.size < partialLength) {
    indexes.add(Math.floor(Math.random() * password.length));
  }

  return Array.from(indexes).sort((a, b) => a - b);
}
