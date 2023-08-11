import React, { useState } from "react";
import { FirebaseContext, type FirebaseSDKs } from "../contexts/firebase.js"

// FirebaseProvider component
export function FirestormX({ children, auth, firestore }: { children: React.ReactNode, auth: FirebaseSDKs["auth"], firestore: FirebaseSDKs["firestore"] }) {
  const [firebaseSdks] = useState<FirebaseSDKs>({ auth, firestore });

  return (
    <FirebaseContext.Provider value={firebaseSdks}>
      {children}
    </FirebaseContext.Provider>
  );
}