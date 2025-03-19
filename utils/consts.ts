export const COLS_SHAPE = ["cj", "wubi98", "wubi86"] as const;
export const COLS_PHONETIC = ["terra", "bopomofo"] as const;
export const COLS_DOUBLE = [
  "flypy",
  "ms",
  "zrm",
  "sogou",
  "abc",
  "ziguang",
] as const;
export const COLS_AUX = ["xh_aux", "moqi_aux", "zrm_aux"] as const;
export const COLS_OTHERS = ["unicode"] as const;
export const COLS_ALL = [
  ...COLS_SHAPE,
  ...COLS_DOUBLE,
  ...COLS_AUX,
  ...COLS_PHONETIC,
  ...COLS_OTHERS,
] as const;
export const DEFAULT_COLS = [
  "cj",
  "wubi98",
  "flypy",
  "moqi_aux",
  ...COLS_PHONETIC,
  ...COLS_OTHERS,
] as const;
export type Col = (typeof COLS_ALL)[number];
export type ColExtended = (typeof COLS_ALL)[number] | "double" | "char";

export const difficultyOptions = [
  { label: "简单", value: "easy" },
  { label: "中等", value: "medium" },
  { label: "困难", value: "hard" },
] as const;

export const colLabels: Record<ColExtended, string> = {
  char: "字",

  // Shape methods
  cj: "仓颉",
  wubi98: "98五笔",
  wubi86: "86五笔",

  // Phonetic methods
  bopomofo: "注音",
  terra: "地球拼音",

  // Double methods
  flypy: "小鹤双拼",
  ms: "微软双拼",
  zrm: "自然码",
  sogou: "搜狗双拼",
  abc: "智能ABC",
  ziguang: "紫光双拼",

  // Auxiliary methods
  moqi_aux: "墨奇辅助码",
  xh_aux: "小鹤辅助码",
  zrm_aux: "自然辅助码",

  double: "双拼",

  // Others
  unicode: "Unicode",
};

export const cellSizeLabels: Record<string, string> = {
  xs: "超小",
  sm: "小",
  md: "中",
  lg: "大",
};

export const letterMaps = {
  rows: {
    cj: ["手田水口廿卜山戈人心", "日尸木火土竹十大中", "重難金女月弓一"],
    wubi98: ["qwertyuiop", "asdfghjkl", " xcvbnm"],
    wubi86: ["qwertyuiop", "asdfghjkl", " xcvbnm"],
    double: ["qwertyuiop", "asdfghjkl;", "zxcvbnm"],
    terra: ["12345", "qwertyuiop", "asdfghjkl", "zxcvbnm"],
    bopomofo: [
      "ㄅㄉˇˋㄓˊ˙ㄚㄞㄢㄦ",
      "ㄆㄊㄍㄐㄔㄗㄧㄛㄟㄣ",
      "ㄇㄋㄎㄑㄕㄘㄨㄜㄠㄤ",
      "ㄈㄌㄏㄒㄖㄙㄩㄝㄡㄥ",
    ],
    unicode: ["0123", "4567", "89ab", "cdef"],
  },
} as const;
