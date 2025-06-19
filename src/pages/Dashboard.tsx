import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Package, BarChart3, MessageCircle, Users, Plus } from "lucide-react";
import { DashboardLayout } from "../components/layout";
import { TokenInfo } from "../components/TokenInfo";
import { ProductStats } from "../components/ProductStats";
import { useProducts } from "../hooks/useProducts";
import { useNavigate } from "react-router-dom";

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { getProductCountByStatus, getTotalStockValue, getLowStockProducts } =
    useProducts();

  const counts = getProductCountByStatus();
  const totalValue = getTotalStockValue();
  const lowStockProducts = getLowStockProducts(5);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleAddProduct = () => {
    navigate("/products");
  };

  const handleViewProducts = () => {
    navigate("/products");
  };

  const handleViewOrders = () => {
    navigate("/orders");
  };

  const handleViewCustomers = () => {
    navigate("/customers");
  };

  const handleWhatsAppSettings = () => {
    navigate("/whatsapp-settings");
  };

  return (
    <DashboardLayout
      title="Dashboard"
      description="Bem-vindo de volta! Aqui está um resumo das suas vendas e atividades."
    >
      {/* Product Stats */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">
          Estatísticas dos Produtos
        </h2>
        <ProductStats />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Valor do Estoque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(totalValue)}
            </div>
            <p className="text-xs text-muted-foreground">Total em produtos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Produtos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {counts.active}
            </div>
            <p className="text-xs text-muted-foreground">
              Disponíveis para venda
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {lowStockProducts.length}
            </div>
            <p className="text-xs text-muted-foreground">Precisa repor</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Produtos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {counts.total}
            </div>
            <p className="text-xs text-muted-foreground">No catálogo</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Produtos com Estoque Baixo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.slice(0, 5).map((product) => (
                <div
                  key={product.id}
                  className="flex justify-between items-center p-3 bg-orange-50 rounded-md"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {product.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Estoque: {product.stock} unidades
                    </p>
                  </div>
                  <span className="text-orange-600 font-semibold">
                    {formatCurrency(product.price)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">
                  Nenhum produto com estoque baixo
                </p>
              </div>
            )}
            {lowStockProducts.length > 5 && (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleViewProducts}
              >
                Ver todos os produtos
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" onClick={handleAddProduct}>
              <Plus className="mr-3 h-4 w-4" />
              Adicionar Novo Produto
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-start"
              onClick={handleViewProducts}
            >
              <Package className="mr-3 h-4 w-4" />
              Gerenciar Produtos
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-start"
              onClick={handleViewOrders}
            >
              <BarChart3 className="mr-3 h-4 w-4" />
              Ver Pedidos
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-start"
              onClick={handleViewCustomers}
            >
              <Users className="mr-3 h-4 w-4" />
              Gerenciar Clientes
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-start"
              onClick={handleWhatsAppSettings}
            >
              <MessageCircle className="mr-3 h-4 w-4" />
              Configurar WhatsApp
            </Button>
          </CardContent>
        </Card>

        {/* Token Info */}
        <div className="lg:col-span-1">
          <TokenInfo />
        </div>
      </div>
    </DashboardLayout>
  );
};
