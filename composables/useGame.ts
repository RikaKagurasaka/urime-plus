import pako from "pako";
import Papa, { type ParseResult } from "papaparse";
import _ from "lodash";

const { mapValues } = _;
// Types
export type DataDictionary = {
  [char: string]: Record<Col, string[] | null> & {
    char: string;
    lvl: number | null;
  };
};

export type GuessChoices = Record<ColExtended, string[] | null>;
export type Guess = Record<ColExtended, string | null>;

export type GuessResult = Record<
  ColExtended,
  {
    guess: string;
    result: string & { [i: number]: "o" | "x" | "?" | "-" };
  } | null
>;

// Helper functions
const { reverseWubi } = useConfig();

async function loadData() {
  const response = await fetch("/merged.gz");
  const compressedData = await response.arrayBuffer();
  const decompressedData = pako.inflate(compressedData);
  const csvData = new TextDecoder().decode(decompressedData);
  const data = Papa.parse(csvData, {
    header: true,
    dynamicTyping: true,
  }) as ParseResult<any>;

  let dict = Object.fromEntries(
    data.data.map((row) => [
      row.char,
      {
        ...mapValues(row, (v) => (typeof v == "string" ? v.split("|") : v)),
        lvl: row.lvl ? parseInt(row.lvl) : null,
        unicode: [row.char?.codePointAt(0)?.toString(16)],
      },
    ])
  ) as DataDictionary;

  if (reverseWubi.value) {
    dict = mapValues(dict, (v) => {
      return mapValues(v, (code, col) => {
        if (
          col.startsWith("wubi") &&
          code &&
          typeof code === "object" &&
          "reverse" in code
        ) {
          return (code as string[])?.reverse();
        }
        return code;
      });
    }) as unknown as DataDictionary;
  }
  return dict;
}

function isLvlMatch(
  lvl: number | null,
  difficulty: "easy" | "medium" | "hard"
) {
  switch (difficulty) {
    case "easy":
      return lvl === 1;
    case "medium":
      return !!lvl;
    case "hard":
      return true;
  }
}

// Main composable
const _useGame = () => {
  // State initialization
  const {
    state: df,
    isReady,
    error,
  } = useAsyncState(loadData, {} as DataDictionary);

  watch(error, (newVal) => {
    if (newVal) {
      console.error(newVal);
    }
  });

  const difficulty = useLocalStorage("difficulty", "easy") as Ref<
    "easy" | "medium" | "hard"
  >;

  const cols = useLocalStorage("cols", [
    ...DEFAULT_COLS,
  ] as (typeof COLS_ALL)[number][]);

  const ans = useLocalStorage("ans", "");
  const guesses = useLocalStorage("guesses", [] as Guess[]);

  // Computed properties
  const isDoubleColSelected = computed(() => {
    return (
      cols.value.some((col: any) => COLS_DOUBLE.includes(col)) &&
      cols.value.some((col: any) => COLS_AUX.includes(col))
    );
  });

  const availableChars = computed(() => {
    return Object.keys(toValue(df)).filter((char) => {
      return (
        cols.value.every((col) => toValue(df)[char][col] !== null) &&
        isLvlMatch(toValue(df)[char].lvl, difficulty.value)
      );
    });
  });

  const ansRow = computed(() => getDefaultRowByChar(ans.value));

  const maxCodeLength = computed(() => {
    const result = {
      double: 4,
      char: 1,
    } as Record<ColExtended, number>;

    for (const char of Object.keys(toValue(df))) {
      for (const col of COLS_ALL) {
        if (toValue(df)[char][col]?.length) {
          for (const code of toValue(df)[char][col] as string[]) {
            result[col] = Math.max(result[col] || 0, code?.length || 0);
          }
        }
      }
    }
    return result;
  });

  const guessResults = computed(() => {
    return guesses.value.map((guess) => compareGuess(guess, ansRow.value!));
  });

  // Game functions
  function getRowByChar(char: string) {
    char = [...char][0];
    const result = {} as GuessChoices;
    for (const col of COLS_ALL) {
      result[col] = toValue(df)[char]?.[col] ?? null;
    }
    if (Object.keys(result).length > 0) {
      return {
        ...result,
        char,
      };
    }
    return null;
  }

  function getDefaultRowByChar(char: string) {
    const row = getRowByChar(char);
    if (row) {
      return {
        ...mapValues(row, (val) => val?.[0] ?? null),
        char,
      };
    }
    return null;
  }

  function compareGuess(guess: Guess, ansRow: Guess) {
    let result = {} as GuessResult;

    // First process DOUBLE and AUX columns if both are selected
    if (isDoubleColSelected.value) {
      // Find the selected DOUBLE and AUX columns
      const selectedDoubleCol = cols.value.find((col) =>
        COLS_DOUBLE.includes(col as any)
      ) as Col;
      const selectedAuxCol = cols.value.find((col) =>
        COLS_AUX.includes(col as any)
      ) as Col;

      if (selectedDoubleCol && selectedAuxCol) {
        // Combine the codes for comparison
        const guessDouble = guess[selectedDoubleCol] || "";
        const guessAux = guess[selectedAuxCol] || "";
        const ansDouble = ansRow[selectedDoubleCol] || "";
        const ansAux = ansRow[selectedAuxCol] || "";

        const combinedGuess = guessDouble + guessAux;
        const combinedAns = ansDouble + ansAux;
        const combinedMaxLength =
          maxCodeLength.value[selectedDoubleCol] +
          maxCodeLength.value[selectedAuxCol];

        // Compare the combined values
        const combinedResult = compare(
          combinedGuess,
          combinedAns,
          combinedMaxLength
        ) as string & { [i: number]: "o" | "x" | "?" | "-" };

        // Slice the results back to their respective columns
        const doubleLen = maxCodeLength.value[selectedDoubleCol];

        result[selectedDoubleCol] = {
          guess: combinedGuess.slice(0, doubleLen),
          result: combinedResult.slice(0, doubleLen) as any,
        };

        result[selectedAuxCol] = {
          guess: combinedGuess.slice(doubleLen),
          result: combinedResult.slice(doubleLen) as any,
        };

        // Add 'double' property with the combined result
        result.double = {
          guess: combinedGuess,
          result: combinedResult,
        };
      }
    }

    // Process all other columns normally
    for (const col of cols.value) {
      // Skip if already processed as part of DOUBLE or AUX
      if (
        isDoubleColSelected.value &&
        (COLS_DOUBLE.includes(col as any) || COLS_AUX.includes(col as any))
      ) {
        continue;
      }

      const guessCode = guess[col] || "";
      const ansCode = ansRow[col] || "";
      result[col] = {
        guess: guessCode,
        result: compare(guessCode, ansCode, maxCodeLength.value[col]) as any,
      };
    }

    result = mapValues(result, (val, col) => {
      return {
        ...val,
        guess: val?.guess.padEnd(
          maxCodeLength.value[col as ColExtended] || 0,
          " "
        ),
      };
    }) as unknown as GuessResult;

    result.char = {
      guess: guess.char!,
      result: ansRow.char! === guess.char! ? "o" : "x",
    } as any;

    return result;
  }

  function refresh() {
    ans.value =
      availableChars.value[
        Math.floor(Math.random() * availableChars.value.length)
      ];
  }

  function submitGuess(guess: Guess) {
    guesses.value.push({ ...guess });
  }

  // Initial setup
  watch(isReady, () => {
    if (!ans.value) {
      refresh();
    }
  });

  const solved = computed(() => {
    return guesses.value.some((guess) => {
      return guess.char === ansRow.value?.char;
    });
  });

  // Return public API
  return {
    df,
    difficulty,
    cols,
    availableChars,
    ans,
    refresh,
    maxCodeLength,
    getRowByChar,
    ansRow,
    getDefaultRowByChar,
    isDoubleColSelected,
    guesses,
    compareGuess,
    guessResults,
    submitGuess,
    isReady,
    solved,
  };
};

export const useGame = createSharedComposable(_useGame);
