'use client';

import {
  createContext,
  useContext,
  useMemo,
  type DependencyList,
  type ReactNode,
} from 'react';

type MockUser = { uid: string; email?: string } | null;

type FirebaseContextValue = {
  user: MockUser;
  isUserLoading: boolean;
};

// Minimal, non-Firebase context so the UI can render without a real backend.
const FirebaseContext = createContext<FirebaseContextValue>({
  user: null,
  isUserLoading: false,
});

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  return (
    <FirebaseContext.Provider value={{ user: null, isUserLoading: false }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  return useContext(FirebaseContext);
}

export function useUser() {
  const { user, isUserLoading } = useFirebase();
  return { user, isUserLoading, userError: null as Error | null };
}

export function useAuth() {
  const { user } = useFirebase();
  // Surface just enough shape for the existing screens.
  return {
    currentUser: user,
    signOut: async () => {},
  } as any;
}

export function useFirestore() {
  return null as any;
}

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList) {
  return useMemo(factory, deps);
}

export function useDoc<T>(_ref: any) {
  return { data: null as T | null, isLoading: false, error: null as Error | null };
}

export function useCollection<T>(_query: any) {
  return { data: [] as T[], isLoading: false, error: null as Error | null };
}

export async function addDocumentNonBlocking(..._args: any[]) {
  console.warn('Firestore is disabled in this build; skipping addDocumentNonBlocking.');
  return null as any;
}

export async function updateDocumentNonBlocking(..._args: any[]) {
  console.warn('Firestore is disabled in this build; skipping updateDocumentNonBlocking.');
}

export async function setDocumentNonBlocking(..._args: any[]) {
  console.warn('Firestore is disabled in this build; skipping setDocumentNonBlocking.');
}

export async function initiateEmailSignIn(_auth: any, _email: string, _password: string) {
  console.warn('Auth is disabled in this build; skipping email sign-in.');
  return { user: null };
}

export async function signUpWithEmailPassword(_auth: any, email: string, _password: string) {
  console.warn('Auth is disabled in this build; creating mock user.');
  return { user: { uid: 'local-user', email } };
}
