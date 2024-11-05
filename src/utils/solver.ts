export const isSafe = (puzzle: (number | null)[][], row: number, col: number, num: number) => {
  // check vertical & horizontal
  for (let i = 0; i < puzzle.length; i++) {
    if (puzzle[row][i] === num || puzzle[i][col] === num) {
      return false;
    }
  }

  const rowStart = Math.floor(row / 3) * 3;
  const colStart = Math.floor(col / 3) * 3;
  for (let i = rowStart ; i < rowStart + 3; i++) {
    for (let j = colStart; j < colStart + 3; j++) {
      if (puzzle[i][j] === num) {
        return false;
      }
    }
  }

  return true;
}

export const solver = (puzzle: (number | null)[][], row = 0, col = 0): (number | null)[][] | false => {
  const cPuzzle = JSON.parse(JSON.stringify(puzzle));
  let i = row;
  let j = col;
  while (i < cPuzzle.length && cPuzzle[i][j] !== null) {
    j++;
    if (j === 9) {
      i++;
      j = 0;
    }
    if (i === 9) {
      return cPuzzle;
    }
  }
  for (let k = 1; k <= 9; k++) {
    if (isSafe(cPuzzle, i, j, k)) {
      cPuzzle[i][j] = k;
      const result = solver(cPuzzle, i, j)
      if (result) {
        return result;
      }
      cPuzzle[i][j] = null;
    }
  }
  cPuzzle[i][j] = null;
  return false;
}