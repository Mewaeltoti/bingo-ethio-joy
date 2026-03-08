import type { PatternName } from './bingo';

export function checkWin(
  numbers: number[][],
  markedNumbers: Set<number>,
  pattern: PatternName
): boolean {
  const isMarked = (row: number, col: number) => {
    if (row === 2 && col === 2) return true; // free space
    return markedNumbers.has(numbers[row]?.[col] ?? -1);
  };

  switch (pattern) {
    case 'Full House':
      for (let r = 0; r < 5; r++)
        for (let c = 0; c < 5; c++)
          if (!isMarked(r, c)) return false;
      return true;

    case 'L Shape':
      for (let r = 0; r < 5; r++) if (!isMarked(r, 0)) return false;
      for (let c = 0; c < 5; c++) if (!isMarked(4, c)) return false;
      return true;

    case 'T Shape':
      for (let c = 0; c < 5; c++) if (!isMarked(0, c)) return false;
      for (let r = 0; r < 5; r++) if (!isMarked(r, 2)) return false;
      return true;

    case 'U Shape':
      for (let r = 0; r < 5; r++) if (!isMarked(r, 0)) return false;
      for (let r = 0; r < 5; r++) if (!isMarked(r, 4)) return false;
      for (let c = 0; c < 5; c++) if (!isMarked(4, c)) return false;
      return true;

    case 'X Shape':
      for (let i = 0; i < 5; i++) {
        if (!isMarked(i, i)) return false;
        if (!isMarked(i, 4 - i)) return false;
      }
      return true;

    default:
      return false;
  }
}

/** Check horizontal line wins */
export function checkHorizontalWin(numbers: number[][], marked: Set<number>): boolean {
  for (let r = 0; r < 5; r++) {
    let complete = true;
    for (let c = 0; c < 5; c++) {
      if (r === 2 && c === 2) continue;
      if (!marked.has(numbers[r]?.[c] ?? -1)) { complete = false; break; }
    }
    if (complete) return true;
  }
  return false;
}

/** Check vertical line wins */
export function checkVerticalWin(numbers: number[][], marked: Set<number>): boolean {
  for (let c = 0; c < 5; c++) {
    let complete = true;
    for (let r = 0; r < 5; r++) {
      if (r === 2 && c === 2) continue;
      if (!marked.has(numbers[r]?.[c] ?? -1)) { complete = false; break; }
    }
    if (complete) return true;
  }
  return false;
}

/** Check diagonal wins */
export function checkDiagonalWin(numbers: number[][], marked: Set<number>): boolean {
  let d1 = true, d2 = true;
  for (let i = 0; i < 5; i++) {
    if (i === 2) continue; // free space
    if (!marked.has(numbers[i]?.[i] ?? -1)) d1 = false;
    if (!marked.has(numbers[i]?.[4 - i] ?? -1)) d2 = false;
  }
  return d1 || d2;
}

/** Get winning cell coordinates for highlighting */
export function getWinningCells(
  numbers: number[][],
  marked: Set<number>,
  pattern: PatternName
): [number, number][] {
  const cells: [number, number][] = [];
  const isMarked = (r: number, c: number) => {
    if (r === 2 && c === 2) return true;
    return marked.has(numbers[r]?.[c] ?? -1);
  };

  const patternCells: Record<string, () => [number, number][]> = {
    'Full House': () => {
      const all: [number, number][] = [];
      for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) all.push([r, c]);
      return all;
    },
    'L Shape': () => {
      const s: [number, number][] = [];
      for (let r = 0; r < 5; r++) s.push([r, 0]);
      for (let c = 1; c < 5; c++) s.push([4, c]);
      return s;
    },
    'T Shape': () => {
      const s: [number, number][] = [];
      for (let c = 0; c < 5; c++) s.push([0, c]);
      for (let r = 1; r < 5; r++) s.push([r, 2]);
      return s;
    },
    'U Shape': () => {
      const s: [number, number][] = [];
      for (let r = 0; r < 5; r++) { s.push([r, 0]); s.push([r, 4]); }
      for (let c = 1; c < 4; c++) s.push([4, c]);
      return s;
    },
    'X Shape': () => {
      const s: [number, number][] = [];
      for (let i = 0; i < 5; i++) { s.push([i, i]); if (i !== 4 - i) s.push([i, 4 - i]); }
      return s;
    },
  };

  const getCells = patternCells[pattern];
  if (!getCells) return [];
  
  const needed = getCells();
  const allMarked = needed.every(([r, c]) => isMarked(r, c));
  return allMarked ? needed : [];
}
