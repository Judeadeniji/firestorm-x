import { createContext } from "react";
import type { Firestore } from "firebase/firestore";
import type { Auth } from "firebase/auth";


export type FirebaseSDKs = {
  auth?: Auth;
  firestore?: Firestore;
};


export const FirebaseContext = createContext<FirebaseSDKs | null>(null);