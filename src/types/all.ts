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
  category: string;
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
