import { useContext } from "react";
import QuestionContext from "./questions";

export const useQuestionsContext = () => {
  const context = useContext(QuestionContext);
  if (!context) {
    throw new Error("useQuestionsContext must be used within a QuestionsProvider");
  }
  return context;
};
