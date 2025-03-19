function findLetterStatus(guessResults: GuessResult[], cols: ColExtended[]) {
  let letterStatus: Partial<Record<ColExtended, Record<string, string>>> = {};
  let newCols = cols.filter(
    (col) =>
      col !== "char" &&
      !COLS_DOUBLE.includes(col as any) &&
      !COLS_AUX.includes(col as any)
  ) as Exclude<
    ColExtended,
    "char" | (typeof COLS_DOUBLE)[number] | (typeof COLS_AUX)[number]
  >[];

  for (const col of newCols) {
    letterStatus[col] = {};
    for (const letterGroup of letterMaps.rows[col]) {
      for (const letter of letterGroup) {
        letterStatus[col][letter] = "-";
      }
    }
  }
  for (const guessResult of guessResults) {
    for (const col of newCols) {
      const result = guessResult[col];
      if (result) {
        [...result.guess].forEach((letter, index) => {
          if (!letterStatus[col]?.[letter]) return;
          switch (result.result[index]) {
            case "o":
              letterStatus[col][letter] = "o";
              break;
            case "?":
              if (letterStatus[col][letter] === "o") return;
              letterStatus[col][letter] = "?";
              break;
            case "x":
              if (letterStatus[col][letter] !== "-") return;
              letterStatus[col][letter] = "x";
              break;
          }
        });
      }
    }
  }
  return letterStatus;
}

function _useSolver() {
  const { guessResults, cols, isDoubleColSelected } = useGame();
  const letterStatus = computed(() =>
    findLetterStatus(guessResults.value, [
      ...cols.value,
      ...(isDoubleColSelected.value ? ["double"] : []),
    ] as ColExtended[])
  );
  return { letterStatus };
}

export const useSolver = createSharedComposable(_useSolver);
