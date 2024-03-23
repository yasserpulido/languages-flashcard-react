import { forwardRef, useState } from "react";
import { Modal } from "../modal";
import { ModalMethods } from "../../types";
import { useDictionary } from "../../hooks";
import { SYLLABARY_GROUP_OPTIONS } from "../../constants";
import { Button } from "../button";

const SyllabaryQuizConfig = forwardRef<ModalMethods>((_, ref) => {
  const { syllabary, userData, startSyllabaryQuiz } = useDictionary();
  const [groupHasHard, setGroupHasHard] = useState(false);
  const [checked, setChecked] = useState(false);
  const [syllabaryOption, setSyllabaryOption] = useState("hiragana");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const syllabary = formData.get("syllabary") as string;
    const group = formData.get("group") as string;
    const sort = formData.get("sort") as string;
    const writing = formData.get("writing") !== null;
    const onlyHard = formData.get("only-hard") === "only-hard";

    startSyllabaryQuiz({
      syllabary,
      group,
      sort,
      writing,
      onlyHard,
    });

    if (ref && "current" in ref && ref.current) {
      ref.current.close();
    }

    setGroupHasHard(false);
    setChecked(false);
    form.reset();
  };

  const handleGroupChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    let hasHard = false;
    setChecked(false);

    const hardListIds = userData.syllabary.hiraganaHardCardIds;

    const syllabaryList =
      syllabaryOption === "hiragana" ? syllabary.hiragana : syllabary.katakana;

    for (const s of syllabaryList) {
      if (s.type === event.target.value) {
        hasHard = hardListIds.some((id) => id === s.id);
        setGroupHasHard(hasHard);
      }

      if (hasHard) {
        break;
      }
    }
  };

  return (
    <Modal ref={ref}>
      <h1 className="text-2xl font-bold text-gray-800 text-center">
        Syllabary Quiz
      </h1>
      <hr className="my-4" />
      <p className="text-gray-800 text-center">
        Select the correct syllabary flashcard config.
      </p>
      <form className="mt-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="syllabary" className="block text-gray-800">
            Syllabary:
          </label>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center">
            <input
              type="radio"
              name="syllabary"
              value="hiragana"
              defaultChecked
              onChange={() => setSyllabaryOption("hiragana")}
            />
            <label className="ml-2">Hiragana</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              name="syllabary"
              value="katakana"
              disabled
              onChange={() => setSyllabaryOption("katakana")}
            />
            <label className="ml-2">Katakana</label>
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="group" className="block text-gray-800">
            Group:
          </label>
          <select
            name="group"
            className="block w-full"
            onChange={handleGroupChange}
          >
            {SYLLABARY_GROUP_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4">
          <label htmlFor="group" className="block text-gray-800">
            Sort:
          </label>
          <div className="flex items-center">
            <input
              type="radio"
              name="sort"
              value="ordered"
              defaultChecked
              id="ordered"
            />
            <label className="ml-2" htmlFor="ordered">
              Ordered
            </label>
          </div>
          <div className="flex items-center">
            <input type="radio" name="sort" value="random" id="random" />
            <label className="ml-2" htmlFor="random">
              Random
            </label>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="writing"
              value="writing"
              id="writing"
            />
            <label className="ml-2" htmlFor="writing">
              Is writing quiz?
            </label>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="only-hard"
              value="only-hard"
              id="only-hard"
              checked={checked}
              disabled={!groupHasHard}
              onChange={() => setChecked(!checked)}
            />
            <label className="ml-2" htmlFor="only-hard">
              only hard?
            </label>
          </div>
        </div>
        <hr className="my-4" />
        <div className="mt-4 text-right">
          <Button type="submit" color="primary">
            Start Quiz
          </Button>
        </div>
      </form>
    </Modal>
  );
});

export default SyllabaryQuizConfig;
