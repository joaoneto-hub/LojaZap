import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Search,
  Filter,
  Eye,
  Package,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { DashboardLayout } from "../components/layout";

export const Orders: React.FC = () => {
  const mockOrders = [
    {
      id: "1234",
      customer: "João Silva",
      phone: "(11) 99999-9999",
      items: [
        { name: "Vestido Floral", quantity: 1, price: "R$ 89,90" },
        { name: "Blusa Básica", quantity: 2, price: "R$ 45,00" },
      ],
      total: "R$ 179,90",
      status: "Pendente",
      date: "2024-01-15",
      time: "14:30",
      paymentMethod: "PIX",
      deliveryMethod: "Entrega em Casa",
    },
    {
      id: "1233",
      customer: "Maria Santos",
      phone: "(11) 88888-8888",
      items: [{ name: "Calça Jeans", quantity: 1, price: "R$ 120,00" }],
      total: "R$ 120,00",
      status: "Confirmado",
      date: "2024-01-15",
      time: "13:15",
      paymentMethod: "Cartão de Crédito",
      deliveryMethod: "Retirada na Loja",
    },
    {
      id: "1232",
      customer: "Pedro Costa",
      phone: "(11) 77777-7777",
      items: [
        { name: "Vestido Floral", quantity: 1, price: "R$ 89,90" },
        { name: "Blusa Básica", quantity: 1, price: "R$ 45,00" },
      ],
      total: "R$ 134,90",
      status: "Entregue",
      date: "2024-01-14",
      time: "16:45",
      paymentMethod: "Dinheiro",
      deliveryMethod: "Entrega em Casa",
    },
    {
      id: "1231",
      customer: "Ana Oliveira",
      phone: "(11) 66666-6666",
      items: [{ name: "Calça Jeans", quantity: 1, price: "R$ 120,00" }],
      total: "R$ 120,00",
      status: "Cancelado",
      date: "2024-01-14",
      time: "10:20",
      paymentMethod: "PIX",
      deliveryMethod: "Entrega em Casa",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendente":
        return "bg-yellow-100 text-yellow-800";
      case "Confirmado":
        return "bg-blue-100 text-blue-800";
      case "Entregue":
        return "bg-green-100 text-green-800";
      case "Cancelado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pendente":
        return <Clock className="h-4 w-4" />;
      case "Confirmado":
        return <Package className="h-4 w-4" />;
      case "Entregue":
        return <CheckCircle className="h-4 w-4" />;
      case "Cancelado":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout
      title="Pedidos"
      description="Gerencie todos os pedidos recebidos, acompanhe o status e atualize as informações."
    >
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-2">
          <Button variant="outline">
            <Search className="mr-2 h-4 w-4" />
            Buscar Pedido
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {mockOrders.length} pedidos encontrados
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {mockOrders.map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Pedido #{order.id}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {order.date} às {order.time}
                  </p>
                </div>
                <Badge
                  className={`${getStatusColor(
                    order.status
                  )} flex items-center gap-1`}
                >
                  {getStatusIcon(order.status)}
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Cliente</h4>
                  <p className="text-sm">{order.customer}</p>
                  <p className="text-sm text-muted-foreground">{order.phone}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Pagamento & Entrega</h4>
                  <p className="text-sm">{order.paymentMethod}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.deliveryMethod}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-medium mb-2">Itens do Pedido</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-sm"
                    >
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-medium">{item.price}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total</span>
                    <span className="text-primary">{order.total}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Detalhes
                </Button>
                {order.status === "Pendente" && (
                  <>
                    <Button size="sm" className="flex-1">
                      Confirmar
                    </Button>
                    <Button size="sm" variant="destructive" className="flex-1">
                      Cancelar
                    </Button>
                  </>
                )}
                {order.status === "Confirmado" && (
                  <Button size="sm" className="flex-1">
                    Marcar como Entregue
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {mockOrders.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Nenhum pedido encontrado
            </h3>
            <p className="text-muted-foreground">
              Quando receber pedidos, eles aparecerão aqui.
            </p>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
};
