import React, { createContext } from "react";

export interface MetaData {
  title: string
}

export interface MetaDataContext {
  metaData: MetaData | undefined,
  setMetaData: React.Dispatch<React.SetStateAction<MetaData | undefined>>
}

const MetaDataContext = createContext<MetaDataContext | null>(null);

export default MetaDataContext;