import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Package, BarChart3, MessageCircle, Users } from "lucide-react";
import { DashboardLayout } from "../components/layout";

export const Dashboard: React.FC = () => {
  return (
    <DashboardLayout
      title="Dashboard"
      description="Bem-vindo de volta! Aqui está um resumo das suas vendas e atividades."
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Vendas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">R$ 12.450</div>
            <p className="text-xs text-muted-foreground">+15% este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">156</div>
            <p className="text-xs text-muted-foreground">+8% esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">89</div>
            <p className="text-xs text-muted-foreground">Ativos no catálogo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">1.234</div>
            <p className="text-xs text-muted-foreground">+23 novos hoje</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Recentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-muted rounded-md">
              <div>
                <p className="font-medium text-foreground">Pedido #1234</p>
                <p className="text-sm text-muted-foreground">
                  Cliente: João Silva
                </p>
              </div>
              <span className="text-primary font-semibold">R$ 89,90</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-md">
              <div>
                <p className="font-medium text-foreground">Pedido #1233</p>
                <p className="text-sm text-muted-foreground">
                  Cliente: Maria Santos
                </p>
              </div>
              <span className="text-primary font-semibold">R$ 156,00</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-md">
              <div>
                <p className="font-medium text-foreground">Pedido #1232</p>
                <p className="text-sm text-muted-foreground">
                  Cliente: Pedro Costa
                </p>
              </div>
              <span className="text-primary font-semibold">R$ 67,50</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start">
              <Package className="mr-3 h-4 w-4" />
              Adicionar Novo Produto
            </Button>
            <Button variant="secondary" className="w-full justify-start">
              <BarChart3 className="mr-3 h-4 w-4" />
              Ver Relatórios
            </Button>
            <Button variant="secondary" className="w-full justify-start">
              <MessageCircle className="mr-3 h-4 w-4" />
              Configurar WhatsApp
            </Button>
            <Button variant="secondary" className="w-full justify-start">
              <Users className="mr-3 h-4 w-4" />
              Gerenciar Clientes
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};
