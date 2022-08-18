import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";

export const FlashContext = createContext();

export default function FlashProvider({ children }) {
  const [flashMessage, setFlashMessage] = useState({});
  const [visible, setVisible] = useState(false);
  const flashTimer = useRef();

  const hideFlash = useCallback(() => {
    setVisible(false);
  }, []);

  const flash = useCallback(
    (message, variant = "info", duration = 7) => {
      clearTimeout(flashTimer.current);
      setFlashMessage({ message, variant });
      setVisible(true);
      if (duration) {
        flashTimer.current = setTimeout(hideFlash, duration * 1000);
      }
    },
    [hideFlash, flashTimer]
  );

  return (
    <FlashContext.Provider value={{ flash, flashMessage, visible, hideFlash }}>
      {children}
    </FlashContext.Provider>
  );
}

export function useFlash() {
  return useContext(FlashContext).flash;
}

export { FlashProvider };
