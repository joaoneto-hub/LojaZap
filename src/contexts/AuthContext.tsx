import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import type { ReactNode } from "react";
import type { User } from "../lib/validations";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth } from "../lib/firebase";

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  tokenExpiryTime: number | null;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Configurações de token
const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutos antes da expiração
const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hora de sessão

// Função para converter FirebaseUser para User
const convertFirebaseUser = (firebaseUser: FirebaseUser): User => {
  return {
    id: firebaseUser.uid,
    name:
      firebaseUser.displayName ||
      firebaseUser.email?.split("@")[0] ||
      "Usuário",
    email: firebaseUser.email || "",
    role: "admin", // Você pode implementar roles baseado em claims do Firebase
  };
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tokenExpiryTime, setTokenExpiryTime] = useState<number | null>(null);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Função para obter o token atual e sua expiração
  const getTokenInfo = async (firebaseUser: FirebaseUser) => {
    try {
      const token = await firebaseUser.getIdTokenResult();
      const expiryTime = token.expirationTime
        ? new Date(token.expirationTime).getTime()
        : null;
      return { token: token.token, expiryTime };
    } catch (error) {
      console.error("Erro ao obter token:", error);
      return { token: null, expiryTime: null };
    }
  };

  // Função para renovar o token
  const refreshToken = async () => {
    if (!auth.currentUser) return;

    try {
      const token = await auth.currentUser.getIdToken(true); // force refresh
      const tokenResult = await auth.currentUser.getIdTokenResult();
      const expiryTime = tokenResult.expirationTime
        ? new Date(tokenResult.expirationTime).getTime()
        : null;

      setTokenExpiryTime(expiryTime);

      // Salvar token no localStorage para uso em requisições
      localStorage.setItem("authToken", token);
      localStorage.setItem("tokenExpiry", expiryTime?.toString() || "");

      console.log("Token renovado com sucesso");
    } catch (error) {
      console.error("Erro ao renovar token:", error);
      // Se não conseguir renovar, fazer logout
      await logout();
    }
  };

  // Função para configurar timers de renovação e expiração
  const setupTokenTimers = (expiryTime: number | null) => {
    // Limpar timers existentes
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }
    if (sessionTimerRef.current) {
      clearTimeout(sessionTimerRef.current);
    }

    if (!expiryTime) return;

    const now = Date.now();
    const timeUntilExpiry = expiryTime - now;
    const timeUntilRefresh = Math.max(
      timeUntilExpiry - TOKEN_REFRESH_THRESHOLD,
      0
    );

    // Timer para renovar token antes da expiração
    if (timeUntilRefresh > 0) {
      refreshTimerRef.current = setTimeout(() => {
        refreshToken();
      }, timeUntilRefresh);
    }

    // Timer para expirar sessão
    sessionTimerRef.current = setTimeout(() => {
      console.log("Sessão expirada por inatividade");
      logout();
    }, SESSION_TIMEOUT);
  };

  // Função para resetar o timer de sessão
  const resetSessionTimer = () => {
    if (sessionTimerRef.current) {
      clearTimeout(sessionTimerRef.current);
    }

    sessionTimerRef.current = setTimeout(() => {
      console.log("Sessão expirada por inatividade");
      logout();
    }, SESSION_TIMEOUT);
  };

  useEffect(() => {
    // Listener para mudanças no estado de autenticação
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const convertedUser = convertFirebaseUser(firebaseUser);
        setUser(convertedUser);

        // Obter informações do token
        const { token, expiryTime } = await getTokenInfo(firebaseUser);
        setTokenExpiryTime(expiryTime);

        // Salvar token no localStorage
        if (token) {
          localStorage.setItem("authToken", token);
          localStorage.setItem("tokenExpiry", expiryTime?.toString() || "");
        }

        // Configurar timers
        setupTokenTimers(expiryTime);

        // Configurar listeners para resetar timer de sessão
        const events = [
          "mousedown",
          "mousemove",
          "keypress",
          "scroll",
          "touchstart",
        ];
        events.forEach((event) => {
          document.addEventListener(event, resetSessionTimer, true);
        });
      } else {
        setUser(null);
        setTokenExpiryTime(null);

        // Limpar localStorage
        localStorage.removeItem("authToken");
        localStorage.removeItem("tokenExpiry");

        // Limpar timers
        if (refreshTimerRef.current) {
          clearTimeout(refreshTimerRef.current);
        }
        if (sessionTimerRef.current) {
          clearTimeout(sessionTimerRef.current);
        }

        // Remover listeners
        const events = [
          "mousedown",
          "mousemove",
          "keypress",
          "scroll",
          "touchstart",
        ];
        events.forEach((event) => {
          document.removeEventListener(event, resetSessionTimer, true);
        });
      }
      setLoading(false);
    });

    // Cleanup do listener
    return () => {
      unsubscribe();
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
      if (sessionTimerRef.current) {
        clearTimeout(sessionTimerRef.current);
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);

      // Autenticação com Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // Converter para o formato User da aplicação
      const convertedUser = convertFirebaseUser(firebaseUser);
      setUser(convertedUser);
    } catch (error: unknown) {
      console.error("Erro no login:", error);

      // Tratar erros específicos do Firebase
      let errorMessage = "Erro ao fazer login";

      if (error && typeof error === "object" && "code" in error) {
        const firebaseError = error as { code: string; message?: string };

        switch (firebaseError.code) {
          case "auth/user-not-found":
            errorMessage = "Usuário não encontrado";
            break;
          case "auth/wrong-password":
            errorMessage = "Senha incorreta";
            break;
          case "auth/invalid-email":
            errorMessage = "Email inválido";
            break;
          case "auth/too-many-requests":
            errorMessage = "Muitas tentativas. Tente novamente mais tarde";
            break;
          default:
            errorMessage = firebaseError.message || "Erro desconhecido";
        }
      }

      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setTokenExpiryTime(null);

      // Limpar localStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("tokenExpiry");

      // Limpar timers
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
      if (sessionTimerRef.current) {
        clearTimeout(sessionTimerRef.current);
      }
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
    tokenExpiryTime,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
