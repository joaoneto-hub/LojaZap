import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Package,
  AlertTriangle,
  DollarSign,
  CheckCircle,
  XCircle,
  MinusCircle,
} from "lucide-react";
import { useProducts } from "../hooks/useProducts";

export const ProductStats: React.FC = () => {
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

  const stats = [
    {
      title: "Total de Produtos",
      value: counts.total,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Produtos Ativos",
      value: counts.active,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Produtos Inativos",
      value: counts.inactive,
      icon: XCircle,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
    },
    {
      title: "Sem Estoque",
      value: counts.out_of_stock,
      icon: MinusCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Estoque Baixo",
      value: lowStockProducts.length,
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Valor Total",
      value: formatCurrency(totalValue),
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.title === "Estoque Baixo" && lowStockProducts.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Produtos com 5 ou menos unidades
              </p>
            )}
            {stat.title === "Valor Total" && (
              <p className="text-xs text-muted-foreground mt-1">
                Valor total do estoque
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
