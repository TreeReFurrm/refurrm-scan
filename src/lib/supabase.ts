type SupabaseUser = {
  id: string;
  email?: string;
  user_metadata?: Record<string, any>;
};

type SupabaseSession = { user: SupabaseUser } | null;

const mockUser: SupabaseUser = {
  id: 'local-user',
  email: 'demo@refurrm.test',
  user_metadata: { full_name: 'ReFurrm Tester', role: 'family' },
};

function createQueryResult<T>(data: T) {
  const result: any = {
    data,
    error: null,
    select: () => result,
    eq: () => result,
    order: () => result,
    limit: () => result,
    single: async () => ({ data: Array.isArray(data) ? (data[0] ?? null) : (data as any), error: null }),
    insert: async () => ({ data: null, error: null }),
    update: () => ({
      eq: async () => ({ data: null, error: null }),
    }),
    then: (resolve: any) => resolve({ data, error: null }),
  };
  return result;
}

export const supabase = {
  auth: {
    getSession: async (): Promise<{ data: { session: SupabaseSession }; error: null }> => ({
      data: { session: { user: mockUser } },
      error: null,
    }),
    getUser: async () => ({ data: { user: mockUser }, error: null }),
    signUp: async () => ({ data: { user: mockUser }, error: null }),
    signInWithPassword: async () => ({ data: { session: { user: mockUser } }, error: null }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: (callback: (event: string, session: SupabaseSession) => void) => {
      const subscription = { unsubscribe: () => {} };
      callback('INITIAL', { user: mockUser });
      return { data: { subscription } };
    },
  },
  functions: {
    invoke: async () => ({ data: null, error: null }),
  },
  from: (_table: string) => createQueryResult<any[]>([]),
};
