import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

import { useAuth } from "../contexts/AuthContext";
import { db } from "../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const ProductDebug: React.FC = () => {
  const { user } = useAuth();
  const [testResult, setTestResult] = useState<string>("");
  const [isTesting, setIsTesting] = useState(false);

  const testFirestoreConnection = async () => {
    if (!user) {
      setTestResult("Usuário não autenticado");
      return;
    }

    setIsTesting(true);
    setTestResult("Testando conexão...");

    try {
      // Teste 1: Tentar criar um documento de teste
      const testDocRef = doc(db, "test", user.id);
      await setDoc(testDocRef, {
        userId: user.id,
        test: true,
        timestamp: new Date(),
        message: "Teste de conexão com Firestore",
      });

      // Teste 2: Tentar ler o documento
      const docSnap = await getDoc(testDocRef);
      if (docSnap.exists()) {
        setTestResult(
          "✅ Conexão com Firestore funcionando! Documento criado e lido com sucesso."
        );
      } else {
        setTestResult("❌ Documento não foi criado corretamente");
      }
    } catch (error) {
      console.error("Erro no teste:", error);
      setTestResult(
        `❌ Erro: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    } finally {
      setIsTesting(false);
    }
  };

  const testStoreSettings = async () => {
    if (!user) {
      setTestResult("Usuário não autenticado");
      return;
    }

    setIsTesting(true);
    setTestResult("Testando storeSettings...");

    try {
      // Teste: Tentar criar configurações de teste
      const settingsRef = doc(db, "storeSettings", user.id);
      await setDoc(settingsRef, {
        userId: user.id,
        name: "Loja Teste",
        description: "Descrição de teste",
        phone: "11999999999",
        email: "teste@teste.com",
        address: "Endereço de teste",
        openingTime: "08:00",
        closingTime: "18:00",
        workingDays: ["segunda", "terça"],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      setTestResult("✅ Configurações de teste criadas com sucesso!");
    } catch (error) {
      console.error("Erro no teste de storeSettings:", error);
      setTestResult(
        `❌ Erro em storeSettings: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    } finally {
      setIsTesting(false);
    }
  };

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Debug - Teste de Conexão</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button
            onClick={testFirestoreConnection}
            disabled={isTesting}
            variant="outline"
          >
            Testar Conexão Firestore
          </Button>

          <Button
            onClick={testStoreSettings}
            disabled={isTesting}
            variant="outline"
          >
            Testar StoreSettings
          </Button>
        </div>

        {testResult && (
          <div className="p-3 bg-gray-100 rounded-md">
            <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}

        <div className="text-sm text-gray-600">
          <p>
            <strong>Usuário:</strong> {user?.email || "Não autenticado"}
          </p>
          <p>
            <strong>ID:</strong> {user?.id || "N/A"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
