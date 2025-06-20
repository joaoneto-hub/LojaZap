import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ImageUpload } from "./ui/image-upload";
import { useImageUpload } from "../hooks/useImageUpload";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

interface UploadResult {
  url?: string;
  path?: string;
  error?: string;
}

export const ProductDebug: React.FC = () => {
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);
  const { user } = useAuth();
  const { uploadImage, uploading, error } = useImageUpload();

  const handleTestUpload = async () => {
    try {
      // Criar um arquivo de teste
      const canvas = document.createElement("canvas");
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, 100, 100);
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText("TEST", 20, 50);
      }

      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], "test-image.png", {
            type: "image/png",
          });
          console.log("🧪 Testando upload com arquivo:", file);

          const result = await uploadImage(file, "test");
          console.log("✅ Resultado do teste:", result);
          setUploadResults((prev) => [...prev, result]);

          toast.success("Teste de upload realizado com sucesso!", {
            duration: 3000,
            position: "top-right",
            style: {
              background: "#f0fdf4",
              color: "#166534",
              border: "1px solid #bbf7d0",
            },
          });
        }
      }, "image/png");
    } catch (error) {
      console.error("❌ Erro no teste:", error);
      setUploadResults((prev) => [
        ...prev,
        { error: error instanceof Error ? error.message : "Erro desconhecido" },
      ]);

      toast.error("Erro no teste de upload", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#fef2f2",
          color: "#dc2626",
          border: "1px solid #fecaca",
        },
      });
    }
  };

  const handleImageUpload = (result: { url: string; path: string }) => {
    console.log("📸 Imagem enviada via componente:", result);
    setUploadResults((prev) => [...prev, result]);

    toast.success("Upload manual realizado com sucesso!", {
      duration: 3000,
      position: "top-right",
      style: {
        background: "#f0fdf4",
        color: "#166534",
        border: "1px solid #bbf7d0",
      },
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Debug - Upload de Imagens</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Usuário: {user?.email} (ID: {user?.id})
          </p>
          <p className="text-sm text-muted-foreground">
            Status: {uploading ? "Fazendo upload..." : "Pronto"}
          </p>
          {error && <p className="text-sm text-destructive">Erro: {error}</p>}
        </div>

        <div className="space-y-4">
          <Button onClick={handleTestUpload} disabled={uploading}>
            Testar Upload Automático
          </Button>

          <ImageUpload
            onImageUpload={handleImageUpload}
            folder="test"
            label="Teste Manual de Upload"
          />
        </div>

        {uploadResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">Resultados dos Testes:</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {uploadResults.map((result, index) => (
                <div key={index} className="p-2 bg-muted rounded text-xs">
                  <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
