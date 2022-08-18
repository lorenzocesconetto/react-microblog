import { createContext, useContext, useMemo, useCallback } from "react";
import ApiClient from "../ApiClient";
import { useFlash } from "./FlashProvider";
const ApiContext = createContext();

export default function ApiProvider({ children }) {
  const flash = useFlash();
  const onError = useCallback(
    () => flash("An unexpected error ocurred", "danger"),
    [flash]
  );
  const api = useMemo(() => new ApiClient(onError), [onError]);
  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}

export function useApi() {
  return useContext(ApiContext);
}

export { ApiProvider };
