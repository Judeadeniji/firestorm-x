import { useEffect, useState } from 'react';
import { doc, collection, onSnapshot } from 'firebase/firestore';
import type {
  Query,
  CollectionReference,
  DocumentReference,
  Firestore,
} from 'firebase/firestore';
import writable from "../writable.js";

interface DocStore<T> {
  subscribe: (cb: (value: T | null) => void) => void | (() => void);
  ref: DocumentReference<T> | null;
  id: string;
}

/**
 * @param  {Firestore} firestore firebase firestore instance
 * @param  {string|DocumentReference} ref document path or reference
 * @param  {T} startWith optional default data
 * @returns a store with realtime updates on document data
 */
export function useDocStore<T = any>(
  firestore: Firestore,
  ref: string | DocumentReference<T>,
  startWith?: T
): DocStore<T> {
  
    // Fallback for missing SDK
    if (!firestore) {
      console.warn(
        "Firestore is not initialized. Are you missing FirestormX as a parent component?"
      );
      
      return {
        subscribe: (cb) => setData((currentData) => {
          cb(currentData);
          return currentData;
        }),
        ref: null,
        id: "",
      }
    }
  const docRef = typeof ref === 'string' ? doc(firestore, ref) as DocumentReference<T> : ref;

  const [_, setData] = useState<any | null>([]);

  useEffect(() => {
    return onSnapshot(docRef, (snapshot) => {
      setData((snapshot.data() as T) ?? null);
    });
  }, [docRef]);

  return {
    subscribe: (cb) => setData((currentData) => {
      cb(currentData);
      return currentData;
    }),
    ref: docRef,
    id: docRef.id,
  };
}

interface CollectionStore<T> {
  subscribe: (cb: (value: T | []) => void) => void | (() => void);
  ref: CollectionReference | Query | null;
}

export function useCollectionStore<T>(
  firestore: Firestore,
  ref: string | Query | CollectionReference,
  startWith: T[] = []
): CollectionStore<T[]> {

  let unsubscribe: () => void;

  // Fallback for SSR
  if (!globalThis.window) {
    const { subscribe } = writable(startWith);
    return {
      subscribe,
      ref: null,
    };
  }

  // Fallback for missing SDK
  if (!firestore) {
    console.warn(
      "Firestore is not initialized. Are you missing FirebaseApp as a parent component?"
    );
    const { subscribe } = writable([]);
    return {
      subscribe,
      ref: null,
    };
  }

  const colRef = typeof ref === "string" ? collection(firestore, ref) : ref;

  const { subscribe } = writable(startWith, (set) => {
    unsubscribe = onSnapshot(colRef, (snapshot) => {
      const data = snapshot.docs.map((s) => {
        return { id: s.id, ref: s.ref, ...s.data() } as T;
      });
      set(data);
    });

    return () => unsubscribe();
  });

  return {
    subscribe,
    ref: colRef,
  };
}

