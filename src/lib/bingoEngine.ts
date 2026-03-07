const numbers = Array.from({ length: 75 }, (_, i) => i + 1);

export function shuffleNumbers() {
  return [...numbers].sort(() => Math.random() - 0.5);
}

export function getBingoLetter(num: number) {
  if (num <= 15) return 'B';
  if (num <= 30) return 'I';
  if (num <= 45) return 'N';
  if (num <= 60) return 'G';
  return 'O';
}