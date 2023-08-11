import type { DocumentReference, Firestore } from "firebase/firestore";
import { useDocStore } from "./firestore.js";
import { useFirebaseContext } from "./use-firebase-context.js";

interface Doc {
  data: any;
  ref: DocumentReference | null;
  firestore?: Firestore;
  pending: boolean;
}

export default function useDoc(
  ref: string | DocumentReference,
  startWith: any | undefined
): Doc {
  const { firestore } = useFirebaseContext();
  let store = useDocStore(firestore!, ref, startWith);
  
  if (store !== undefined) {
    return {
      ref: store.ref,
      data: store,
      firestore,
      pending: false
    }
  }
  return {
    ref: store.ref,
    data: store,
    firestore,
    pending: true
  }
}
