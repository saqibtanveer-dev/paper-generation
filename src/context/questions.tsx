import { createContext, useContext } from "react";
import { QUESTION_TYPES } from "../lib/globalContants";

export interface MCQQuestionContextType {
  type: "MCQ";
  statement: string;
  options: string[];
}

interface OtherQuestionContextType {
  type: typeof QUESTION_TYPES.shortQuestion | typeof QUESTION_TYPES.longQuestion;
  statement: string;
}

export type QuestionContextType = MCQQuestionContextType | OtherQuestionContextType;

export interface QuestionsContextType {
    questions: QuestionContextType[];
    setQuestions: React.Dispatch<React.SetStateAction<QuestionContextType[]>>;
}


const QuestionContext = createContext<QuestionsContextType | null>(null);

export const useQuestionsContext = () => {
    const context = useContext(QuestionContext);
    if (!context) {
        throw new Error("useQuestionsContext must be used within a QuestionsProvider");
    }
    return context;
}

export default QuestionContext;