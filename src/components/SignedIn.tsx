import React from 'react';
import { useUserStore } from '../hooks/auth.js';
import { useFirebaseContext } from "../hooks/use-firebase-context.js"
import { signOut, type User, type Auth } from 'firebase/auth'; // Import Firebase auth related types


// polyfill for svelte slot props
interface DefaultSlotProps {
  user: User | null;
  auth: Auth;
  signOut: () => Promise<void>;
}

// polyfill for svelte slot props
interface SlotsProps {
  default: (props: DefaultSlotProps) => React.ReactNode;
}

function SignedIn({ slots }: { slots: SlotsProps }) {
  const { default: defaultSlot } = slots;
 
  const auth = useFirebaseContext().auth!;
  const user = useUserStore(auth);
  
  if (user) {
    return defaultSlot({ user, auth, signOut: () => signOut(auth) });
  }

  return null;
}

export default SignedIn;