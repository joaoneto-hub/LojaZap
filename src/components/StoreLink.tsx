import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Copy, ExternalLink, Check } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export const StoreLink: React.FC = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const storeUrl = `${window.location.origin}/store/${user?.id}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(storeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Erro ao copiar link:", error);
    }
  };

  const openStore = () => {
    window.open(storeUrl, "_blank");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="h-5 w-5" />
          Link da Sua Loja
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="store-link">Link público da sua loja</Label>
          <div className="flex gap-2">
            <Input
              id="store-link"
              value={storeUrl}
              readOnly
              className="font-mono text-sm"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={openStore}
              className="shrink-0"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <p>Compartilhe este link com seus clientes para que eles possam:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Ver todos os seus produtos ativos</li>
            <li>Adicionar produtos ao carrinho</li>
            <li>Fazer pedidos diretamente via WhatsApp</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
