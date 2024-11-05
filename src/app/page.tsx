"use client";

import { isSafe, solver } from "@/utils/solver";
import classNames from "classnames";
import { useState } from "react";

export default function Home() {
  const emptyPuzzle = () => {
    return [
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
    ];
  };

  const [puzzle, setPuzzle] = useState<(number | null)[][]>(emptyPuzzle());
  const [inputPuzzle, setInputPuzzle] = useState<(number | null)[][]>(
    emptyPuzzle()
  );
  const [time, setTime] = useState<number>(0);

  const setCell = (row: number, col: number, num: number | null) => {
    setPuzzle((prev) => {
      const newPuzzle = JSON.parse(JSON.stringify(prev));
      newPuzzle[row][col] = num;
      return newPuzzle;
    });
  };

  const handleSolve = () => {
    setInputPuzzle(puzzle);
    const start = new Date().getTime();
    const result = solver(puzzle);
    const end = new Date().getTime();
    setTime(end - start);
    if (!result) {
      alert("No solution");
      return;
    }
    setPuzzle(result);
  };

  return (
    <div className="flex flex-col gap-2 m-10">
      <h1 className="text-3xl text-center font-bold">Sudoku Solver</h1>
      <div className="w-max mx-auto">
        {puzzle.map((row, i) => (
          <div
            key={i}
            className={classNames([
              i % 3 === 0 ? "border-t" : "",
              i === 8 ? "border-b" : "",
              "border-black",
            ])}
          >
            {row.map((col, j) => (
              <input
                key={j}
                type="number"
                min="1"
                max="9"
                data-cell
                data-row={i}
                data-col={j}
                className={classNames([
                  "size-10 border text-center",
                  j % 3 === 0 ? "border-l-black" : "",
                  j === 8 ? "border-r-black" : "",
                  inputPuzzle[i][j] !== null ? "bg-gray-300" : "",
                ])}
                value={col === null ? "" : col}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (Number.isNaN(val) || val < 1 || val > 9) {
                    setCell(i, j, null);
                    return;
                  }
                  if (!isSafe(puzzle, i, j, val)) {
                    alert("Invalid input on this cell. Please try again.");
                    return;
                  }
                  setCell(i, j, val);
                  let nextInput: HTMLElement | null = null;
                  if (j < 8) {
                    nextInput = document.querySelector(
                      `[data-cell][data-row="${i}"][data-col="${j + 1}"]`
                    );
                  } else if (i < 8) {
                    nextInput = document.querySelector(
                      `[data-cell][data-row="${i + 1}"][data-col="0"]`
                    );
                  }
                  if (nextInput) {
                    nextInput.focus();
                  }
                }}
                onKeyDown={(e) => {
                  // handle keydown for arrow up down left right
                  let nextInput: HTMLInputElement | null = null;
                  if (e.key.startsWith("Arrow")) {
                    e.preventDefault();
                  }
                  switch (e.key) {
                    case "ArrowLeft":
                      if (j === 0) return;
                      nextInput = document.querySelector(
                        `[data-cell][data-row="${i}"][data-col="${j - 1}"]`
                      );
                      break;
                    case "ArrowRight":
                      if (j === 8) return;
                      nextInput = document.querySelector(
                        `[data-cell][data-row="${i}"][data-col="${j + 1}"]`
                      );
                      break;
                    case "ArrowDown":
                      if (i === 8) return;
                      nextInput = document.querySelector(
                        `[data-cell][data-row="${i + 1}"][data-col="${j}"]`
                      );
                      break;
                    case "ArrowUp":
                      if (i === 0) return;
                      nextInput = document.querySelector(
                        `[data-cell][data-row="${i - 1}"][data-col="${j}"]`
                      );
                      break;
                  }
                  if (nextInput) {
                    (nextInput as HTMLInputElement).focus();
                  }
                }}
              />
            ))}
          </div>
        ))}
      </div>
      {time !== 0 && <div className="text-center">Solve in {time}ms</div>}
      <div className="flex gap-2 justify-center">
        <button
          className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 transition-all focus:ring-2 ring-blue-200"
          onClick={handleSolve}
        >
          Solve
        </button>
        <button
          className="bg-gray-500 text-white rounded-md px-4 py-2 hover:bg-gray-600 transition-all focus:ring-2 ring-gray-200"
          onClick={() => {
            setPuzzle(emptyPuzzle());
            setInputPuzzle(emptyPuzzle());
            setTime(0);
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
