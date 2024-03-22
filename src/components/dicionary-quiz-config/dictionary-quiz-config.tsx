import { forwardRef } from "react";
import { Modal } from "../modal";
import { ModalMethods } from "../../types";
import { useDictionary } from "../../hooks";
import { Button } from "../button";

const DictionaryQuizConfig = forwardRef<ModalMethods>((_, ref) => {
  const { dictionaryCategories, startDictionaryQuiz } = useDictionary();

  const categoriesSorted = [
    "All",
    ...dictionaryCategories.sort((a, b) => a.localeCompare(b)),
  ];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const logographic = formData.get("logographic") as string;
    const category = formData.get("category") as string;

    startDictionaryQuiz({
      logographic,
      category,
    });

    if (ref && "current" in ref && ref.current) {
      ref.current.close();
    }

    form.reset();
  };

  return (
    <Modal ref={ref}>
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
          <select name="category" className="block w-full">
            {categoriesSorted.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <hr className="my-4" />
        <div className="mt-4 text-right">
          <Button color="primary" type="submit">
            Start Quiz
          </Button>
        </div>
      </form>
    </Modal>
  );
});

export default DictionaryQuizConfig;
