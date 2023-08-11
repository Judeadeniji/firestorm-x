import { signOut, type User, type Auth } from "firebase/auth";
import { useUserStore } from "./auth.js"
import { useFirebaseContext } from "./use-firebase-context.js"

// returns a user
export function useUser(): User {
  const auth: Auth = useAuth();
  const user: User = useUserStore(auth)
  
  return user;
}


export function useSignOut() {
  return () => signOut(useAuth())
}

export function useAuth(): Auth {
  return useFirebaseContext().auth;
}