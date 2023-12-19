export function calcEntropy(text: string) {
  const stat: Record<string, number> = {};
  const length = text.length;

  for (const symbol of text) {
    stat[symbol] = (stat[symbol] || 0) + 1;
  }

  let entropy = 0.0;

  for (const symbol in stat) {
    if (stat.hasOwnProperty(symbol)) {
      const probability = stat[symbol] / length;
      entropy -= probability * Math.log2(probability);
    }
  }

  return {
    entropy,
    strength: getStrength(entropy),
  };
}

function getStrength(entropy: number): 'weak' | 'medium' | 'strong' {
  if (entropy < 2.5) {
    return 'weak';
  }

  if (entropy < 3.5) {
    return 'medium';
  }

  return 'strong';
}
