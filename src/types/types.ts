export type Response = {
  languages: Language[];
};

export type Language = {
  japanese: Japanese;
};

export type Japanese = {
  syllabary: Syllabary;
  dictionary: Dictionary[];
};

export type Dictionary = {
  id: number;
  word: string;
  romaji: string;
  translation: string;
  audioName: string;
  categories: string;
  logographic: string;
};

export type Syllabary = {
  hiragana: Syllable[];
  katakana: Syllable[];
};

export type Syllable = {
  id: number;
  kana: string;
  romaji: string;
  audioName: string;
  type: string;
};

export type ModalMethods = {
  open: () => void;
  close: () => void;
};

export type SyllabaryQuizConfig = {
  syllabary: string;
  group: string;
  sort: string;
  writing: boolean;
  onlyHard: boolean;
};

export type DictionaryQuizConfig = {
  logographic: string;
  category: string;
  onlyHard: boolean;
  showRomaji: boolean;
};

export type UserData = {
  syllabary: {
    hiraganaHardCardIds: number[];
    katakanaHardCardIds: number[];
  };
  dictionary: {
    hardCardsId: number[];
  };
  lastPlayed: string;
};

export type DictionaryContextType = {
  dictionaryCategories: string[];
  userData: UserData;
  dictionaryData: Dictionary[];
  syllabaryData: Syllabary;
};

export type Stats = {
  easy: number[];
  hard: number[];
};

export type ResponseMessage = {
  show: boolean;
  type: "error" | "success";
  message: string;
};
