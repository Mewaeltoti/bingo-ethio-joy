// Generate a random bingo cartela
export function generateCartela(): number[][] {
  const ranges = [
    [1, 15],   // B
    [16, 30],  // I
    [31, 45],  // N
    [46, 60],  // G
    [61, 75],  // O
  ];

  const cartela: number[][] = [];
  for (let col = 0; col < 5; col++) {
    const [min, max] = ranges[col];
    const nums: number[] = [];
    while (nums.length < 5) {
      const n = Math.floor(Math.random() * (max - min + 1)) + min;
      if (!nums.includes(n)) nums.push(n);
    }
    cartela.push(nums);
  }
  // Free space at center
  cartela[2][2] = 0;
  return cartela;
}

export const BINGO_LETTERS = ['B', 'I', 'N', 'G', 'O'];

export const PATTERNS = {
  'Full House': 'All numbers marked',
  'L Shape': 'First column + last row',
  'T Shape': 'First row + middle column',
  'U Shape': 'First col + last col + last row',
  'X Shape': 'Both diagonals',
};

export type PatternName = keyof typeof PATTERNS;

// Generate a set of cartelas for the store
export function generateCartelaSet(count: number): { id: string; numbers: number[][]; price: number }[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `cartela-${i + 1}`,
    numbers: generateCartela(),
    price: 20,
  }));
}
