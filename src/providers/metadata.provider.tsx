import { useState } from "react";
import type { MetaData } from "../context/metadata";
import MetaDataContext from "../context/metadata";

const MetaDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [metaData, setMetaData] = useState<MetaData | undefined>({
    title: ""
  });

  return (
    <MetaDataContext.Provider value={{ metaData, setMetaData }}>
      {children}
    </MetaDataContext.Provider>
  );
};

export default MetaDataProvider;
