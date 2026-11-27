import type { MetaData } from "../context/metadata";
import MetaDataContext from "../context/metadata";
import { useLocalStorage } from "../hooks/useLocalStorage";

function isMetaData(value: unknown): value is MetaData | undefined {
  if (value === undefined) return true;
  if (typeof value !== "object" || value === null) return false;

  const data = value as Record<string, unknown>;
  return ["title", "time", "marks"].every(
    (field) => data[field] === undefined || typeof data[field] === "string",
  );
}

const MetaDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [metaData, setMetaData] = useLocalStorage<MetaData | undefined>({
    key: "question-paper:metadata:v1",
    initialValue: { title: "" },
    validate: isMetaData,
  });

  return (
    <MetaDataContext.Provider value={{ metaData, setMetaData }}>
      {children}
    </MetaDataContext.Provider>
  );
};

export default MetaDataProvider;
