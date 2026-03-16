import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

interface AuthUser {
  name: string;
  email: string;
  initials: string;
  id: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  supabaseUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  supabaseUser: null,
  loading: true,
  login: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

function buildUser(supaUser: User): AuthUser {
  const name =
    supaUser.user_metadata?.full_name ||
    supaUser.email?.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) ||
    "Student";
  const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  return { name, email: supaUser.email || "", initials, id: supaUser.id };
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSupabaseUser(session.user);
        setUser(buildUser(session.user));
      }
      setLoading(false);
    });

    // Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        if (session?.user) {
          setSupabaseUser(session.user);
          setUser(buildUser(session.user));
        } else {
          setSupabaseUser(null);
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) return { error: error.message };

    // Also create profile row in our profiles table
    const { data: sessionData } = await supabase.auth.getSession();
    const uid = sessionData.session?.user?.id;
    if (uid) {
      await supabase.from("profiles").upsert({
        id: uid,
        full_name: name,
        readiness_score: 0,
        badges: [],
        skills: [],
      });
    }
    return { error: null };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    // Clear legacy sessionStorage keys if they exist
    sessionStorage.removeItem("pp_auth");
    sessionStorage.removeItem("pp_user");
    sessionStorage.removeItem("pp_booted");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!supabaseUser,
        user,
        supabaseUser,
        loading,
        login,
        signUp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};