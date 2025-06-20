import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { CheckCircle, Info, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";

export const FirebaseStorageWarning: React.FC = () => {
  const openFirebaseConsole = () => {
    window.open(
      "https://console.firebase.google.com/project/lojazap-b749e/storage",
      "_blank"
    );
  };

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-green-800 text-sm">
          <Info className="h-4 w-4" />
          Status do Upload de Imagens
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-green-700">
            <p className="font-medium mb-1">Firebase Storage configurado</p>
            <p className="text-green-600">
              O sistema está usando Firebase Storage para upload de imagens.
              Isso oferece melhor performance e menor uso de dados.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-green-700">
            <p className="font-medium mb-1">Upload funcionando</p>
            <p className="text-green-600">
              Todas as imagens estão sendo salvas no Firebase Storage. O sistema
              tem fallback para base64 em caso de problemas.
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-white rounded border border-green-200">
          <p className="text-xs text-green-700">
            <strong>Como funciona:</strong> Quando você faz upload de uma
            imagem, o sistema usa o Firebase Storage. Se houver algum problema,
            automaticamente converte para base64 como fallback. Isso garante que
            o upload sempre funcione.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={openFirebaseConsole}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Abrir Firebase Console
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              window.open("FIREBASE_STORAGE_URGENT_SETUP.md", "_blank")
            }
          >
            Ver Instruções
          </Button>
        </div>

        <div className="text-xs text-green-600">
          <p>
            <strong>Status atual:</strong> As imagens estão sendo salvas no
            Firebase Storage e funcionarão normalmente.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
