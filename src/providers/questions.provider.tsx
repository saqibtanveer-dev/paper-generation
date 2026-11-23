import { useState } from "react";
import QuestionContext, {
  type QuestionContextType,
} from "../context/questions";
1;

const QuestionsProvider = ({ children }: { children: React.ReactNode }) => {
  const [questions, setQuestions] = useState<QuestionContextType[]>([
    {
      type: "MCQ",
      statement: "What is the output of typeof null in JavaScript?",
      options: [
        "Null",
        "'object'",
        "'undefined'",
        "'number'",
      ],
    },
    {
      type: "SHORT",
      statement: "Which symbol is used for single line comments in JavaScript?",
    },
    {
      type: "SHORT",
      statement: "Which symbol is used for single line comments in JavaScript?",
    },
    {
      type: "SHORT",
      statement: "Which symbol is used for single line comments in JavaScript?",
    },
  ]);

  return (
    <QuestionContext.Provider value={{ questions, setQuestions }}>
      {children}
    </QuestionContext.Provider>
  );
};

export default QuestionsProvider;
