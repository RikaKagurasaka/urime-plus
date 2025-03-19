const _useBoard = () => {
  const {
    ansRow,
    cols,
    availableChars,
    ans,
    refresh,
    maxCodeLength,
    guesses,
    compareGuess,
    isReady,
    getRowByChar,
    submitGuess,
    guessResults,
  } = useGame();

  const guess = ref<Guess>({} as Guess);
  const inputValue = ref("");

  const mergedCols: ComputedRef<ColExtended[]> = computed(() => {
    const colsValue = toValue(cols) as (Col | "double")[];
    const doubleIndex = colsValue.findIndex((col) =>
      COLS_DOUBLE.includes(col as any)
    );
    const auxIndex = colsValue.findIndex((col) =>
      COLS_AUX.includes(col as any)
    );

    // Check if both DOUBLE and AUX are present
    if (doubleIndex !== -1 && auxIndex !== -1) {
      // Create a new array without DOUBLE and AUX
      const filteredCols = colsValue.filter(
        (col) =>
          !COLS_DOUBLE.includes(col as any) && !COLS_AUX.includes(col as any)
      );

      // Find the position to insert "double" (minimum of the two indices)
      const insertPosition = Math.min(doubleIndex, auxIndex);

      // Insert "double" at the determined position
      filteredCols.splice(insertPosition, 0, "double");

      return ["char", ...filteredCols] as ColExtended[];
    }

    // If not both present, return original array with "char" appended
    return ["char", ...colsValue];
  });
  const gridColCellCount = computed(() => {
    // sum up maxCodeLength for all cols
    return toValue(cols).reduce(
      (acc, col) => acc + (maxCodeLength.value[col as Col] || 0),
      1
    );
  });
  const currentGuessChoices = computed(() => {
    return inputValue.value && getRowByChar(inputValue.value);
  });
  watch(currentGuessChoices, (newVal) => {
    if (newVal) {
      for (const col of [...toValue(cols)]) {
        currentGuess.value[col as ColExtended] =
          newVal[col as ColExtended]?.[0] || "";
      }
      currentGuess.value.char = newVal.char || "";
    } else {
      currentGuess.value = {} as Guess;
    }
  });
  const currentGuess = ref<Guess>({} as Guess);
  watch(inputValue, (newVal) => {
    if ([...newVal].length > 1) {
      inputValue.value = [...newVal][0];
    }
  });
  function submit() {
    if ([...inputValue.value].length === 1 && currentGuess.value) {
      submitGuess(currentGuess.value);
      inputValue.value = "";
    }
  }
  return {
    guess,
    inputValue,
    mergedCols,
    gridColCellCount,
    currentGuess,
    currentGuessChoices,
    submit,
  };
};

export const useBoard = createSharedComposable(_useBoard);
