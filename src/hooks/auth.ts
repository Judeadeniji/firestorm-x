import { useEffect, useState } from "react";
import { onAuthStateChanged, type Auth } from "firebase/auth";

export function useUserStore(auth: Auth, startWith = null) {
  const [user, setUser] = useState(startWith);

  if (!auth) {
    console.warn(
      "Firebase Auth is not initialized. Are you missing FirestormX as a parent component?"
    );

    return {
      subscribe: (cb) =>
        setUser((currentUser) => {
          cb(currentUser);
          return currentUser;
        }),
    };
  }

  useEffect(() => {
    let unsubscribe: () => void;

    if (auth) {
      unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [auth]);

  return user;
}
