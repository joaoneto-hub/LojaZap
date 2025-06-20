import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useAuth } from "../contexts/AuthContext";
import { storage } from "../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import toast from "react-hot-toast";

export const SimpleStorageTest: React.FC = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [result, setResult] = useState<string>("");
  const { user } = useAuth();

  const testStorage = async () => {
    if (!user) {
      setResult("❌ Usuário não autenticado");
      return;
    }

    setIsTesting(true);
    setResult("🚀 Testando...");

    try {
      // Criar um arquivo de teste muito pequeno
      const testData = "test";
      const blob = new Blob([testData], { type: "text/plain" });
      const file = new File([blob], "test.txt", { type: "text/plain" });

      // Tentar upload
      const storageRef = ref(storage, `test/${user.id}/simple_test.txt`);
      const snapshot = await uploadBytes(storageRef, file);

      // Tentar obter URL
      const url = await getDownloadURL(snapshot.ref);

      setResult(`✅ SUCESSO! URL: ${url}`);
      toast.success("Firebase Storage funcionando!");
    } catch (error) {
      console.error("Erro no teste:", error);
      setResult(
        `❌ ERRO: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
      toast.error("Erro no Firebase Storage");
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Teste Simples - Firebase Storage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p>Usuário: {user?.email}</p>
          <p>Storage Bucket: {storage.app.options.storageBucket}</p>
        </div>

        <Button onClick={testStorage} disabled={isTesting} className="w-full">
          {isTesting ? "Testando..." : "Teste Simples"}
        </Button>

        {result && (
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm font-mono">{result}</p>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p>Se der erro, o Firebase Storage não está configurado.</p>
          <p>Consulte o arquivo FIREBASE_STORAGE_URGENT_SETUP.md</p>
        </div>
      </CardContent>
    </Card>
  );
};
