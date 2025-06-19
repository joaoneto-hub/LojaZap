import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { MessageCircle, QrCode, Save } from "lucide-react";
import { DashboardLayout } from "../components/layout";

export const WhatsAppSettings: React.FC = () => {
  return (
    <DashboardLayout
      title="Configurar WhatsApp"
      description="Configure a integração com WhatsApp para receber pedidos e mensagens dos clientes."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuração do WhatsApp */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Configuração do WhatsApp
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">Número do WhatsApp</Label>
              <Input
                id="whatsappNumber"
                placeholder="(11) 99999-9999"
                defaultValue="(11) 99999-9999"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessName">Nome do Negócio</Label>
              <Input
                id="businessName"
                placeholder="Nome da sua empresa"
                defaultValue="Boutique Elegance"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="welcomeMessage">Mensagem de Boas-vindas</Label>
              <textarea
                id="welcomeMessage"
                className="w-full min-h-[100px] p-3 border border-input rounded-md resize-none"
                placeholder="Digite a mensagem de boas-vindas que será enviada automaticamente"
                defaultValue="Olá! Bem-vindo(a) à Boutique Elegance! 🛍️

Estamos aqui para ajudar você a encontrar os melhores produtos.

Como posso te ajudar hoje?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="autoReply">Resposta Automática</Label>
              <textarea
                id="autoReply"
                className="w-full min-h-[100px] p-3 border border-input rounded-md resize-none"
                placeholder="Mensagem enviada quando você não estiver online"
                defaultValue="Obrigado pelo contato! 

No momento não estou disponível, mas retornarei sua mensagem assim que possível.

Horário de atendimento: Segunda a Sábado, das 9h às 18h."
              />
            </div>
          </CardContent>
        </Card>

        {/* QR Code e Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Status da Conexão
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg">
              <div className="w-48 h-48 mx-auto bg-muted rounded-lg flex items-center justify-center mb-4">
                <QrCode className="h-16 w-16 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Escaneie o QR Code com seu WhatsApp
              </p>
              <Button variant="outline" size="sm">
                Gerar Novo QR Code
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Conectado</span>
                </div>
                <span className="text-xs text-green-600">Online</span>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>• Última conexão: Hoje às 14:30</p>
                <p>• Mensagens recebidas hoje: 12</p>
                <p>• Pedidos via WhatsApp: 3</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Notificações */}
        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tipos de Notificação</Label>
              <div className="space-y-2">
                {[
                  "Novas mensagens",
                  "Novos pedidos",
                  "Pedidos cancelados",
                  "Pedidos entregues",
                  "Clientes offline",
                ].map((notification) => (
                  <div
                    key={notification}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      id={notification}
                      defaultChecked
                      className="rounded"
                    />
                    <Label htmlFor={notification} className="text-sm">
                      {notification}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notificationEmail">Email para Notificações</Label>
              <Input
                id="notificationEmail"
                type="email"
                placeholder="notificacoes@loja.com"
                defaultValue="contato@boutique.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Horário */}
        <Card>
          <CardHeader>
            <CardTitle>Horário de Atendimento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Início do Atendimento</Label>
                <Input id="startTime" type="time" defaultValue="09:00" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">Fim do Atendimento</Label>
                <Input id="endTime" type="time" defaultValue="18:00" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Dias de Atendimento</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Segunda",
                  "Terça",
                  "Quarta",
                  "Quinta",
                  "Sexta",
                  "Sábado",
                  "Domingo",
                ].map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`whatsapp-${day}`}
                      defaultChecked={day !== "Domingo"}
                      className="rounded"
                    />
                    <Label htmlFor={`whatsapp-${day}`} className="text-sm">
                      {day}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="offlineMessage">Mensagem Fora do Horário</Label>
              <textarea
                id="offlineMessage"
                className="w-full min-h-[80px] p-3 border border-input rounded-md resize-none"
                placeholder="Mensagem enviada fora do horário de atendimento"
                defaultValue="Estamos fora do horário de atendimento.

Nosso horário é de Segunda a Sábado, das 9h às 18h.

Deixe sua mensagem que retornaremos assim que possível!"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botão Salvar */}
      <div className="flex justify-end mt-6">
        <Button className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Salvar Configurações
        </Button>
      </div>
    </DashboardLayout>
  );
};
