import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import type { User } from "../lib/validations";

// Função para converter FirebaseUser para User
const convertFirebaseUser = (firebaseUser: FirebaseUser): User => {
  return {
    id: firebaseUser.uid,
    name:
      firebaseUser.displayName ||
      firebaseUser.email?.split("@")[0] ||
      "Usuário",
    email: firebaseUser.email || "",
    role: "admin",
  };
};

export const useFirebaseAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setError(null);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // Atualizar o perfil do usuário com o nome
      await updateProfile(firebaseUser, {
        displayName: name,
      });

      return convertFirebaseUser(firebaseUser);
    } catch (error: unknown) {
      console.error("Erro no registro:", error);

      let errorMessage = "Erro ao criar conta";

      if (error && typeof error === "object" && "code" in error) {
        const firebaseError = error as { code: string; message?: string };

        switch (firebaseError.code) {
          case "auth/email-already-in-use":
            errorMessage = "Este email já está em uso";
            break;
          case "auth/invalid-email":
            errorMessage = "Email inválido";
            break;
          case "auth/weak-password":
            errorMessage = "A senha deve ter pelo menos 6 caracteres";
            break;
          default:
            errorMessage = firebaseError.message || "Erro desconhecido";
        }
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);

      await sendPasswordResetEmail(auth, email);
    } catch (error: unknown) {
      console.error("Erro ao enviar email de reset:", error);

      let errorMessage = "Erro ao enviar email de reset";

      if (error && typeof error === "object" && "code" in error) {
        const firebaseError = error as { code: string; message?: string };

        switch (firebaseError.code) {
          case "auth/user-not-found":
            errorMessage = "Usuário não encontrado";
            break;
          case "auth/invalid-email":
            errorMessage = "Email inválido";
            break;
          default:
            errorMessage = firebaseError.message || "Erro desconhecido";
        }
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    resetPassword,
    loading,
    error,
    clearError: () => setError(null),
  };
};
