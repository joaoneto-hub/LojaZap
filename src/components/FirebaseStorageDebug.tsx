import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useAuth } from "../contexts/AuthContext";
import { storage } from "../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import toast from "react-hot-toast";

export const FirebaseStorageDebug: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const { user } = useAuth();

  const addLog = (message: string) => {
    setTestResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const testFirebaseStorage = async () => {
    if (!user) {
      addLog("❌ Usuário não autenticado");
      return;
    }

    setIsTesting(true);
    addLog("🚀 Iniciando teste do Firebase Storage...");

    try {
      // Teste 1: Verificar configuração
      addLog(`📋 Configuração: ${storage.app.options.storageBucket}`);
      addLog(`👤 Usuário autenticado: ${user.email} (${user.id})`);

      // Teste 2: Criar arquivo de teste
      const testData = "Teste de upload - " + new Date().toISOString();
      const blob = new Blob([testData], { type: "text/plain" });
      const file = new File([blob], "test.txt", { type: "text/plain" });

      addLog("📁 Criando arquivo de teste...");

      // Teste 3: Upload
      const timestamp = Date.now();
      const filePath = `test/${user.id}/test_${timestamp}.txt`;
      const storageRef = ref(storage, filePath);

      addLog(`⬆️ Fazendo upload para: ${filePath}`);

      const snapshot = await uploadBytes(storageRef, file);
      addLog(`✅ Upload concluído: ${snapshot.metadata.size} bytes`);

      // Teste 4: Download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      addLog(`🔗 URL de download: ${downloadURL}`);

      // Teste 5: Teste com imagem pequena
      addLog("🖼️ Testando upload de imagem...");

      const canvas = document.createElement("canvas");
      canvas.width = 50;
      canvas.height = 50;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "blue";
        ctx.fillRect(0, 0, 50, 50);
        ctx.fillStyle = "white";
        ctx.font = "12px Arial";
        ctx.fillText("TEST", 10, 25);
      }

      canvas.toBlob(async (blob) => {
        if (blob) {
          const imageFile = new File([blob], "test-image.png", {
            type: "image/png",
          });
          const imagePath = `products/${user.id}/test_image_${timestamp}.png`;
          const imageRef = ref(storage, imagePath);

          addLog(`🖼️ Upload de imagem para products: ${imagePath}`);

          try {
            const imageSnapshot = await uploadBytes(imageRef, imageFile);
            const imageURL = await getDownloadURL(imageSnapshot.ref);

            addLog(`✅ Imagem enviada com sucesso: ${imageURL}`);

            toast.success("Teste do Firebase Storage concluído com sucesso!", {
              duration: 5000,
              position: "top-right",
            });
          } catch (imageError) {
            addLog(
              `❌ Erro no upload de imagem: ${
                imageError instanceof Error
                  ? imageError.message
                  : "Erro desconhecido"
              }`
            );
            console.error("Erro detalhado:", imageError);
          }
        }
      }, "image/png");
    } catch (error) {
      console.error("❌ Erro no teste:", error);
      addLog(
        `❌ Erro: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );

      // Log detalhado do erro
      if (error instanceof Error) {
        addLog(`📋 Tipo de erro: ${error.name}`);
        addLog(`📋 Stack trace: ${error.stack?.split("\n")[0]}`);
      }

      toast.error("Erro no teste do Firebase Storage", {
        duration: 5000,
        position: "top-right",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const clearLogs = () => {
    setTestResults([]);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Debug - Firebase Storage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Usuário: {user?.email} (ID: {user?.id})
          </p>
          <p className="text-sm text-muted-foreground">
            Storage Bucket: {storage.app.options.storageBucket}
          </p>
          <p className="text-sm text-muted-foreground">
            App ID: {storage.app.options.appId}
          </p>
        </div>

        <div className="space-y-2">
          <Button
            onClick={testFirebaseStorage}
            disabled={isTesting}
            className="w-full"
          >
            {isTesting ? "Testando..." : "Testar Firebase Storage"}
          </Button>

          <Button variant="outline" onClick={clearLogs} className="w-full">
            Limpar Logs
          </Button>
        </div>

        {testResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">Logs do Teste:</h3>
            <div className="space-y-1 max-h-60 overflow-y-auto bg-muted p-3 rounded-md">
              {testResults.map((result, index) => (
                <div key={index} className="text-xs font-mono">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
