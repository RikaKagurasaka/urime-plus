/**
 * Compare guess with answer
 */
export function compare(guess: string, answer: string, maxLen: number): string {
  if (!guess || !answer) {
    return Array(maxLen).fill("-").join("");
  }

  // Pad the strings to maxLen
  const paddedGuess = guess.padEnd(maxLen, " ");
  const paddedAnswer = answer.padEnd(maxLen, " ");

  // Initialize result with all 'x'
  const result: string[] = Array(maxLen).fill("x");

  // Count characters in answer for tracking remaining matches
  const answerChars: { [char: string]: number } = {};
  for (const char of paddedAnswer) {
    if (char !== " ") {
      answerChars[char] = (answerChars[char] || 0) + 1;
    }
  }

  // First pass: Mark exact matches
  for (let i = 0; i < maxLen; i++) {
    if (paddedGuess[i] === paddedAnswer[i]) {
      result[i] = "o";
      // Decrement count for this character
      if (paddedGuess[i] !== " ") {
        answerChars[paddedGuess[i]]--;
      }
    }
  }

  // Second pass: Mark partial matches
  for (let i = 0; i < maxLen; i++) {
    if (
      result[i] !== "o" &&
      paddedGuess[i] in answerChars &&
      answerChars[paddedGuess[i]] > 0
    ) {
      result[i] = "?";
      answerChars[paddedGuess[i]]--;
    }
  }

  return result.join("");
}
