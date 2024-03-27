import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../button";
import { useJapenese, useQuiz } from "../../hooks";

const DictionaryQuizConfig = () => {
  const navigate = useNavigate();
  const { userData, dictionaryCategories, dictionaryData } = useJapenese();
  const { startDictionaryQuiz } = useQuiz();

  const [categoryHasHard, setCategoryHasHard] = useState(false);
  const [checked, setChecked] = useState(false);

  const categoriesSorted = [
    "All",
    ...dictionaryCategories.sort((a, b) => a.localeCompare(b)),
  ];

  useEffect(() => {
    for (const d of dictionaryData) {
      const hasHard = userData.dictionary.hardCardsId.some((id) => id === d.id);

      if (hasHard) {
        setCategoryHasHard(true);
        break;
      }
    }
  }, [dictionaryData, userData.dictionary.hardCardsId]);

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    let hasHard = false;
    setChecked(false);

    for (const d of dictionaryData) {
      if (
        d.categories.includes(event.target.value) ||
        event.target.value.toLowerCase() === "all"
      ) {
        hasHard = userData.dictionary.hardCardsId.some((id) => id === d.id);
        setCategoryHasHard(hasHard);
      }

      if (hasHard) {
        break;
      }
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const logographic = formData.get("logographic") as string;
    const category = formData.get("category") as string;
    const onlyHard = formData.get("only-hard") === "only-hard";
    const showRomaji = formData.get("show-romaji") === "show-romaji";

    startDictionaryQuiz({
      logographic,
      category,
      onlyHard,
      showRomaji,
    });

    setCategoryHasHard(false);
    setChecked(false);
    form.reset();
  };

  return (
    <div className="w-full border-2 rounded-xl border-gray-200 p-4">
      <h1 className="text-2xl font-bold text-gray-800 text-center">
        Dictionary Quiz
      </h1>
      <hr className="my-4" />
      <p className="text-gray-800 text-center">
        Select the correct dictionary flashcard configuration.
      </p>
      <form className="mt-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="syllabary" className="block text-gray-800">
            Syllabary or Ideograms:
          </label>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center">
            <input
              type="radio"
              name="logographic"
              value="hiragana"
              defaultChecked
              id="hiragana"
            />
            <label className="ml-2" htmlFor="hiragana">
              Hiragana
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              name="logographic"
              value="katakana"
              disabled
              id="katakana"
            />
            <label className="ml-2" htmlFor="katakana">
              Katakana
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              name="logographic"
              value="katakana"
              disabled
              id="kanji"
            />
            <label className="ml-2" htmlFor="kanji">
              Kanji
            </label>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-gray-800">Category:</label>
          <select
            name="category"
            className="block w-full"
            onChange={handleCategoryChange}
          >
            {categoriesSorted.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            name="only-hard"
            value="only-hard"
            id="only-hard"
            checked={checked}
            disabled={!categoryHasHard}
            onChange={() => setChecked(!checked)}
          />
          <label
            htmlFor="only-hard"
            className={`ml-2 ${!categoryHasHard ? "text-gray-400" : ""}`}
          >
            Only hards?
          </label>
        </div>
        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            name="show-romaji"
            value="show-romaji"
            id="show-romaji"
          />
          <label htmlFor="show-romaji" className="ml-2">
            Show romaji?
          </label>
        </div>
        <hr className="my-4" />
        <div className="flex justify-end gap-4">
          <Button onClick={() => navigate("/")} color="secondary">
            Menu
          </Button>
          <Button color="primary" type="submit">
            Start
          </Button>
        </div>
      </form>
    </div>
  );
};

const MemoizedDictionaryQuizConfig = memo(DictionaryQuizConfig);

export default MemoizedDictionaryQuizConfig;
