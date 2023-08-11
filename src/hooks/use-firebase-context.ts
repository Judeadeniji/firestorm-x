import { FirebaseContext } from "../contexts/firebase.js"
import { useContext } from "react";

// Custom hook to access Firebase context
export function useFirebaseContext() {
  return useContext(FirebaseContext);
}