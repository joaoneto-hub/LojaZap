import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export const TokenInfo: React.FC = () => {
  const { tokenExpiryTime, refreshToken, user } = useAuth();
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState<string>("");

  useEffect(() => {
    const updateTimes = () => {
      if (tokenExpiryTime) {
        const now = Date.now();
        const timeLeft = tokenExpiryTime - now;

        if (timeLeft > 0) {
          const minutes = Math.floor(timeLeft / (1000 * 60));
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
          setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, "0")}`);
        } else {
          setTimeRemaining("Expirado");
        }
      }

      // Calcular tempo restante da sessão (1 hora)
      const sessionExpiry = Date.now() + 60 * 60 * 1000; // 1 hora
      const sessionTimeLeft = sessionExpiry - Date.now();

      if (sessionTimeLeft > 0) {
        const hours = Math.floor(sessionTimeLeft / (1000 * 60 * 60));
        const minutes = Math.floor(
          (sessionTimeLeft % (1000 * 60 * 60)) / (1000 * 60)
        );
        setSessionTimeRemaining(`${hours}h ${minutes}m`);
      } else {
        setSessionTimeRemaining("Expirada");
      }
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);

    return () => clearInterval(interval);
  }, [tokenExpiryTime]);

  const handleRefreshToken = async () => {
    try {
      await refreshToken();
    } catch (error) {
      console.error("Erro ao renovar token:", error);
    }
  };

  const getTokenStatus = () => {
    if (!tokenExpiryTime) return "unknown";

    const timeLeft = tokenExpiryTime - Date.now();
    if (timeLeft > 10 * 60 * 1000) return "valid"; // Mais de 10 minutos
    if (timeLeft > 5 * 60 * 1000) return "warning"; // Entre 5 e 10 minutos
    return "expired"; // Menos de 5 minutos
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "valid":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "expired":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "valid":
        return "Válido";
      case "warning":
        return "Expirando";
      case "expired":
        return "Expirado";
      default:
        return "Desconhecido";
    }
  };

  if (!user) return null;

  const tokenStatus = getTokenStatus();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">Informações da Sessão</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Usuário:</span>
            <span className="text-sm">{user.name}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Email:</span>
            <span className="text-sm">{user.email}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Status do Token:</span>
            <Badge className={`${getStatusColor(tokenStatus)} text-white`}>
              {getStatusText(tokenStatus)}
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Token expira em:</span>
            <span className="text-sm font-mono">{timeRemaining}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Sessão expira em:</span>
            <span className="text-sm">{sessionTimeRemaining}</span>
          </div>
        </div>

        <Button
          onClick={handleRefreshToken}
          variant="outline"
          size="sm"
          className="w-full"
        >
          Renovar Token
        </Button>
      </CardContent>
    </Card>
  );
};
