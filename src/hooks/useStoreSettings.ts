import { useState, useEffect } from "react";
import { doc, onSnapshot, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import type {
  StoreSettings,
  CreateStoreSettingsData,
  UpdateStoreSettingsData,
} from "../types/store";

export const useStoreSettings = () => {
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Listener para configurações da loja em tempo real
  useEffect(() => {
    if (!user) {
      setStoreSettings(null);
      setLoading(false);
      return;
    }

    console.log("=== INICIANDO LISTENER ===");
    console.log("Usuário:", user.id);

    setLoading(true);
    setError(null);

    try {
      const settingsRef = doc(db, "storeSettings", user.id);

      const unsubscribe = onSnapshot(
        settingsRef,
        (doc) => {
          console.log("=== DADOS RECEBIDOS DO LISTENER ===");
          console.log("Documento existe:", doc.exists());

          if (doc.exists()) {
            const data = doc.data();
            console.log("Dados do documento:", data);

            const settings: StoreSettings = {
              id: doc.id,
              userId: data.userId,
              name: data.name,
              description: data.description,
              phone: data.phone,
              email: data.email,
              address: data.address,
              openingTime: data.openingTime,
              closingTime: data.closingTime,
              workingDays: data.workingDays,
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
            };

            console.log("Configurações processadas:", settings);
            setStoreSettings(settings);
          } else {
            console.log("Documento não existe, definindo como null");
            setStoreSettings(null);
          }

          setLoading(false);
        },
        (error) => {
          console.error("❌ Erro no listener:", error);
          setError(error.message);
          setLoading(false);
        }
      );

      return () => {
        console.log("=== LIMPANDO LISTENER ===");
        unsubscribe();
      };
    } catch (error) {
      console.error("❌ Erro ao configurar listener:", error);
      setError(error instanceof Error ? error.message : "Erro desconhecido");
      setLoading(false);
    }
  }, [user]);

  // Criar configurações da loja
  const createStoreSettings = async (
    data: CreateStoreSettingsData
  ): Promise<void> => {
    console.log("=== CRIANDO CONFIGURAÇÕES ===");
    console.log("Dados para criar:", data);
    console.log("Usuário atual:", user?.id);

    if (!user) {
      console.error("Usuário não autenticado");
      throw new Error("Usuário não autenticado");
    }

    try {
      const settingsData: StoreSettings = {
        id: user.id,
        userId: user.id,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log("Dados completos para salvar:", settingsData);

      const docRef = doc(db, "storeSettings", user.id);
      await setDoc(docRef, settingsData);

      console.log("✅ Configurações criadas com sucesso");
    } catch (error) {
      console.error("❌ Erro ao criar configurações:", error);
      throw error;
    }
  };

  // Atualizar configurações da loja
  const updateStoreSettings = async (
    data: UpdateStoreSettingsData
  ): Promise<void> => {
    console.log("=== ATUALIZANDO CONFIGURAÇÕES ===");
    console.log("Dados para atualizar:", data);
    console.log("Usuário atual:", user?.id);

    if (!user) {
      console.error("Usuário não autenticado");
      throw new Error("Usuário não autenticado");
    }

    try {
      const settingsToUpdate = {
        ...data,
        updatedAt: new Date(),
      };

      console.log("Dados para atualização:", settingsToUpdate);

      const docRef = doc(db, "storeSettings", user.id);
      await updateDoc(docRef, settingsToUpdate);

      console.log("✅ Configurações atualizadas com sucesso");
    } catch (error) {
      console.error("❌ Erro ao atualizar configurações:", error);
      throw error;
    }
  };

  // Salvar configurações (criar ou atualizar)
  const saveStoreSettings = async (
    settingsData: CreateStoreSettingsData
  ): Promise<void> => {
    console.log("=== SALVANDO CONFIGURAÇÕES ===");
    console.log("Dados recebidos:", settingsData);
    console.log("Configurações existentes:", storeSettings);

    if (storeSettings) {
      console.log("Atualizando configurações existentes...");
      // Atualizar configurações existentes
      await updateStoreSettings({
        id: storeSettings.id,
        ...settingsData,
      });
    } else {
      console.log("Criando novas configurações...");
      // Criar novas configurações
      await createStoreSettings(settingsData);
    }

    console.log("=== FIM SALVAMENTO ===");
  };

  return {
    storeSettings,
    loading,
    error,
    createStoreSettings,
    updateStoreSettings,
    saveStoreSettings,
    clearError: () => setError(null),
  };
};
