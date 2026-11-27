import { useState } from "react";
import { useQuestionsContext } from "../context/use-questions-context";
import { useMetaDataContext } from "../context/use-metadata-context";
import { FaRegEdit } from "react-icons/fa";

function MetaDataForm() {
  const { metaData, setMetaData } = useMetaDataContext();

  return (
    <form
      className="mt-22 mx-auto w-full max-w-2xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8"
      action=""
    >
      <div className="space-y-2">
        <label
          className="block text-sm font-semibold text-slate-700"
          htmlFor="docTitle"
        >
          Paper title
        </label>
        <input
          value={metaData?.title ?? ""}
          onChange={(e) => {
            const title = e.currentTarget.value;
            setMetaData((prev) => ({ ...prev, title }));
          }}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          type="text"
          name="docTitle"
          id="docTitle"
          placeholder="Enter a title for your question paper"
        />
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <label
          className="block text-sm font-semibold text-slate-700"
          htmlFor="paperTime"
        >
          Paper Time
        </label>
        <input
          value={metaData?.time ?? ""}
          onChange={(e) => {
            const time = e.currentTarget.value;
            setMetaData((prev) => ({ ...prev, time }));
          }}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          type="text"
          name="paperTime"
          id="paperTime"
          placeholder="Enter time for your question paper"
        />
        </div>
        <div className="col-span-6">
          <label
          className="block text-sm font-semibold text-slate-700"
          htmlFor="paperMarks"
        >
          Paper Marks
        </label>
        <input
          value={metaData?.marks ?? ""}
          onChange={(e) => {
            const marks = e.currentTarget.value;
            setMetaData((prev) => ({ ...prev, marks }));
          }}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          type="text"
          name="paperMarks"
          id="paperMarks"
          placeholder="Enter marks for your question paper"
        />
        </div>
      </div>
    </form>
  );
}

function InsertedQuestionList({
  onEdit,
}: {
  onEdit?: (index: number) => void;
}) {
  const { questions } = useQuestionsContext();
  return (
    <section
      aria-labelledby="inserted-questions-heading"
      className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-lg"
    >
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-5 sm:px-8">
        <div>
          <h2
            id="inserted-questions-heading"
            className="text-xl font-bold tracking-tight text-slate-900"
          >
            Added questions
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Your question paper content
          </p>
        </div>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
          {questions.length} {questions.length === 1 ? "question" : "questions"}
        </span>
      </header>

      {questions.length === 0 ? (
        <p className="px-6 py-10 text-center text-sm text-slate-500 sm:px-8">
          No questions added yet. Your questions will appear here.
        </p>
      ) : (
        <ol className="divide-y divide-slate-100">
          {questions.map((q, idx) => (
            <li
              className="flex gap-4 px-6 py-5 transition-colors hover:bg-slate-50 sm:px-8"
              key={idx}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-700">
                {idx + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {q.type === "MCQ"
                      ? "Multiple choice"
                      : q.type === "LONG"
                        ? "Long answer"
                        : "Short answer"}
                  </span>
                </div>
                <p className="break-words text-sm font-medium leading-6 text-slate-800">
                  {q.statement}
                </p>
                {q.type === "MCQ" && q.options.length > 0 && (
                  <ol className="mt-3 grid gap-2 sm:grid-cols-2">
                    {q.options.map((option, optionIdx) => (
                      <li
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600"
                        key={optionIdx}
                      >
                        <span className="mr-2 font-semibold text-slate-400">
                          {String.fromCharCode(65 + optionIdx)}.
                        </span>
                        {option}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
              <span
                aria-label={`Edit question ${idx + 1}`}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400"
                role="img"
                title="Edit question"
              >
                <FaRegEdit onClick={() => onEdit?.(idx)} aria-hidden="true" size={18} />
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}


function QuestionsForm() {
  const [questionType, setQuestionType] = useState(0);
  const { questions, setQuestions } = useQuestionsContext();

  const [editingIndex, setEditingIndex] = useState<number|null>(null)

  const [question, setQuestion] = useState<{
    statement: string;
    options: string[];
  }>({
    statement: "",
    options: [],
  });

  function changeType(choice: number) {
    setQuestionType(choice);
  }

  function handleInsertQuestion() {
    const updatedQuestion = {
      type: questionType === 1 ? ("MCQ" as const) : ("SHORT" as const),
      statement: question.statement,
      options: question.options,
    };

    setQuestions((questions) =>
      editingIndex === null
        ? [...questions, updatedQuestion]
        : questions.map((existingQuestion, idx) =>
            idx === editingIndex ? updatedQuestion : existingQuestion,
          ),
    );
    setQuestion({ statement: "", options: ["", "", "", ""] });
    setEditingIndex(null)
  }

  function onEdit(idx: number) {
    setEditingIndex(idx)
    const selectedQuestion = questions[idx];

    setQuestion({
      statement: selectedQuestion.statement,
      options: selectedQuestion.type === "MCQ" ? [...selectedQuestion.options] : [],
    })
    setQuestionType(selectedQuestion.type === "MCQ" ? 1 : 0);
  }
  return (
    <>
      <MetaDataForm />
      <form className="mx-auto w-full max-w-2xl space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
        <div className="space-y-2">
          <label
            className="block text-sm font-semibold text-slate-700"
            htmlFor="question-title"
          >
            Question
          </label>
          <input
            value={question.statement}
            onChange={(e) => {
              setQuestion({
                statement: e.currentTarget.value,
                options: [...question.options],
              });
            }}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            placeholder="Enter question statement here"
            type="text"
            name="question-title"
            id="question-title"
          />
        </div>
        <label
          htmlFor="isMultipleChoice"
          className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:border-indigo-300 hover:bg-indigo-50"
        >
          <input
            onChange={(event) => changeType(event.target.checked ? 1 : 0)}
            className="h-5 w-5 rounded border-slate-300 accent-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            type="checkbox"
            name="isMultipleChoice"
            id="isMultipleChoice"
          />
          <span className="text-sm font-medium text-slate-700">
            Multiple-choice question
          </span>
        </label>
        <div className="space-y-3">
          {questionType === 1 ? (
            Array.from({ length: 4 }).map((_, index) => (
              <input
                value={question.options[index]}
                onChange={(e) => {
                  const options = [...question.options];
                  options[index] = e.currentTarget.value;
                  setQuestion({ ...question, options });
                }}
                key={index}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                placeholder={`Enter option ${index + 1}`}
              />
            ))
          ) : (
            <></>
          )}
        </div>
        <button
          className="w-full rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 sm:w-auto"
          onClick={(e) => {
            e.preventDefault();
            handleInsertQuestion();
          }}
        >
          {editingIndex === null ? 'Insert Question' : 'Save Changes'}
        </button>
      </form>
      <InsertedQuestionList onEdit={onEdit} />
    </>
  );
}

export default QuestionsForm;
