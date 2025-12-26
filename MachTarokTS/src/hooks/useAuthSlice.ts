import { useEffect, useRef, useState } from "react";
import { authController } from "../engine/AuthEngine";

export function useAuthSlice<T>(selector: (account: typeof authController.account) => T): T {
  const selectorRef = useRef(selector);
  selectorRef.current = selector;

  const [slice, setSlice] = useState(() => selector(authController.account));

  useEffect(() => {
    const handler = () => {
      const newSlice = selectorRef.current(authController.account);
      setSlice(prev => (Object.is(prev, newSlice) ? prev : newSlice));
    };

    return authController.subscribe(handler);
  }, []);

  return slice;
}
