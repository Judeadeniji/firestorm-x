import type { CollectionReference, Firestore, Query } from "firebase/firestore";
import { useCollectionStore } from "./firestore.js";
import { useFirebaseContext } from "./use-firebase-context.js";
import { useState, useEffect } from "react"

interface Collection {
  data: any[];
  ref: CollectionReference | Query | null;
  count: number;
  firestore?: Firestore;
  pending: boolean;
}

export default function useCollection(
  ref: string | CollectionReference | Query,
  startWith: any = undefined
): Collection {
  const { firestore } = useFirebaseContext();
  const [store, setStore] = useState<any[]>([])
  const collections = useCollectionStore(firestore, ref, startWith)
  
  useEffect(() => {
    return collections.subscribe(setStore)
  })

  if (store !== undefined) {
    return {
      data: store,
      count: store?.length ?? 0,
      ref: collections.ref,
      firestore,
      pending: false,
    };
  }
  return {
    data: store,
    count: store?.length ?? 0,
    ref: collections.ref,
    firestore,
    pending: true,
  };
}
