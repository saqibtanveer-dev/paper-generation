import QuestionContext, {
  type QuestionContextType,
} from "../context/questions";
import { useLocalStorage } from "../hooks/useLocalStorage";

function isQuestion(value: unknown): value is QuestionContextType {
  if (
    typeof value !== "object" ||
    value === null ||
    !("type" in value) ||
    !("statement" in value) ||
    typeof value.statement !== "string"
  ) {
    return false;
  }

  if (value.type === "MCQ") {
    return (
      "options" in value &&
      Array.isArray(value.options) &&
      value.options.every((option: unknown) => typeof option === "string")
    );
  }

  return value.type === "SHORT" || value.type === "LONG";
}

function isQuestionList(value: unknown): value is QuestionContextType[] {
  return Array.isArray(value) && value.every(isQuestion);
}

const QuestionsProvider = ({ children }: { children: React.ReactNode }) => {
  const [questions, setQuestions] = useLocalStorage<QuestionContextType[]>({
    key: "question-paper:questions:v1",
    initialValue: [],
    validate: isQuestionList,
  });

  return (
    <QuestionContext.Provider value={{ questions, setQuestions }}>
      {children}
    </QuestionContext.Provider>
  );
};

export default QuestionsProvider;
