import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useApi } from "./ApiProvider";
import { ACCESS_TOKEN_STORAGE_KEY } from "../constants";

const UserContext = createContext();

export default function UserProvider({ children }) {
  const [user, setUser] = useState();
  const api = useApi();

  const isAuthenticated = () => {
    return !!localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  };

  useEffect(() => {
    (async () => {
      if (isAuthenticated()) {
        const response = await api.get("/me");
        setUser(response.ok ? response.body : null);
      } else {
        setUser(null);
      }
    })();
  }, [api]);

  const login = useCallback(
    async (username, password) => {
      const loginResponse = await api.login(username, password);

      if (!loginResponse.ok) {
        throw new Error(loginResponse.body.description);
      }

      const response = await api.get("/me");
      if (!response.ok) {
        setUser(null);
        throw new Error(response.body.description);
      }

      const retrievedUser = response.body;
      setUser(retrievedUser);
      return retrievedUser;
    },
    [api]
  );

  const logout = useCallback(async () => {
    await api.logout();
    setUser(null);
  }, [api]);

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

export { UserProvider };
