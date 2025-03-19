# %%
from functools import reduce
import pandas as pd
import gzip
from collections import defaultdict
import random


# %%

df = pd.read_csv(gzip.open("/data/Projects/urime-plus/public/merged.gz"))
COLS_SHAPE = ["cj", "wubi"]
COLS_PHONETIC = ["bopomofo", "terra"]
COLS_DOUBLE = ["flypy", "ms", "zrm", "sogou", "abc", "ziguang"]
COLS_AUX = ["moqi_aux", "xh_aux", "zrm_aux"]
COLS_OTHERS = ["unicode"]
COLS_ALL = [*COLS_SHAPE, *COLS_PHONETIC, *COLS_DOUBLE, *COLS_AUX, *COLS_OTHERS]
DATA = defaultdict(dict)

# Convert df to DATA dictionary
for _, row in df.iterrows():
    char = row["char"]
    # Add unicode hex representation
    row["unicode"] = "%x" % ord(char)

    # Add all available columns to the character's dictionary
    for col in row.index:
        if pd.notna(row[col]):
            if isinstance(row[col], str):
                DATA[char][col] = row[col].split("|")
            else:
                DATA[char][col] = row[col]
DATA
# %%
# %%
MAX_LEN_PER_COL = {
    col: max(max(len(x) for x in DATA[char].get(col, [""])) for char in DATA)
    for col in COLS_ALL
}


# %%
def compare(guess: str, answer: str, max_len: int) -> str:
    """
    right-pad using space guess and answer to max_len
    return a string of length max_len, where each character is one of:
    - 'o': guess[i] is correct
    - '?': guess[i] is in the answer but in the wrong position
    - 'x': guess[i] is not in the answer
    """
    # Pad the strings to max_len
    guess = guess.ljust(max_len)
    answer = answer.ljust(max_len)

    # Initialize result with all 'x'
    result = ["x"] * max_len

    # Count characters in answer for tracking remaining matches
    answer_chars = {}
    for char in answer:
        if char != " ":
            answer_chars[char] = answer_chars.get(char, 0) + 1

    # First pass: Mark exact matches
    for i in range(max_len):
        if guess[i] == answer[i]:
            result[i] = "o"
            # Decrement count for this character
            if guess[i] != " ":
                answer_chars[guess[i]] -= 1

    # Second pass: Mark partial matches
    for i in range(max_len):
        if result[i] != "o" and guess[i] in answer_chars and answer_chars[guess[i]] > 0:
            result[i] = "?"
            answer_chars[guess[i]] -= 1

    return "".join(result)


# %%
class Game:
    @staticmethod
    def get_available_rows_for_cols(cols: list[str]) -> list:
        """Get characters that have data for all the requested columns"""
        return [char for char, data in DATA.items() if all(col in data for col in cols)]

    @staticmethod
    def get_available_rows_for_lvl(lvl: int | None) -> list:
        """Get characters that are at or below the specified level"""
        if lvl is None:
            return list(DATA.keys())
        return [
            char for char, data in DATA.items() if "lvl" in data and data["lvl"] <= lvl
        ]

    @staticmethod
    def get_available_cols_for_char(char: str) -> list[str]:
        """Get available columns for a specific character"""
        return [col for col in COLS_ALL if col in DATA[char]]

    def __init__(
        self, cols: list[str], lvl: int | None = None, answer: str | None = None
    ) -> None:
        assert sum(col in COLS_DOUBLE for col in cols) <= 1
        assert sum(col in COLS_AUX for col in cols) <= 1
        assert sum(col in COLS_DOUBLE for col in cols) == sum(
            col in COLS_AUX for col in cols
        )

        self.cols = cols
        self.lvl = lvl
        self.available_chars = self.get_available_rows_for_cols(self.cols)
        if lvl is not None:
            self.available_chars = self.get_available_rows_for_lvl(lvl)
        if answer is None:
            self.answer = random.choice(self.available_chars)
        else:
            self.answer = answer
        self.guesses = []

    @property
    def full_answer(self) -> dict[str, str]:
        """Get the full answer for the game"""
        answer_row = DATA[self.answer]
        double_col = [col for col in self.cols if col in COLS_DOUBLE][0]
        aux_col = [col for col in self.cols if col in COLS_AUX][0]
        return {
            **{col: answer_row[col][0] for col in self.cols if col in answer_row},
            "char": self.answer,
            "double": answer_row[double_col][0] + answer_row[aux_col][0],
        }

    def compare_guess(self, guess: dict[str, str]) -> dict[str, str]:
        """Compare a guess to the answer"""
        return {
            col: compare(guess[col], self.full_answer[col], MAX_LEN_PER_COL[col])
            for col in self.cols
        }


# %%
game = Game([*COLS_SHAPE, *COLS_PHONETIC, *COLS_OTHERS, "flypy", "moqi_aux"], lvl=1)
game.get_full_answer()
