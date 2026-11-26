import { useContext } from "react";
import MetaDataContext from "./metadata";

export const useMetaDataContext = () => {
  const context = useContext(MetaDataContext);
  if (!context) {
    throw new Error("useQuestionsContext must be used within a QuestionsProvider");
  }
  return context;
};
