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

export type ResponseMessage = {
  show: boolean;
  type: "error" | "success";
  message: string;
};

export type QuizState = {
  started: boolean;
  ended: boolean;
};

export type FlashcardMarked = {
  syllabary: {
    hiragana: {
      easy: number[];
      hard: number[];
    };
    katakana: {
      easy: number[];
      hard: number[];
    };
  };
  dictionary: {
    easy: number[];
    hard: number[];
  };
};
