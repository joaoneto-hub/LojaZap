import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
} from "lucide-react";
import { DashboardLayout } from "../components/layout";

export const Customers: React.FC = () => {
  const mockCustomers = [
    {
      id: 1,
      name: "João Silva",
      email: "joao.silva@email.com",
      phone: "(11) 99999-9999",
      address: "Rua das Flores, 123 - São Paulo, SP",
      totalOrders: 5,
      totalSpent: "R$ 450,00",
      lastOrder: "2024-01-15",
      status: "Ativo",
    },
    {
      id: 2,
      name: "Maria Santos",
      email: "maria.santos@email.com",
      phone: "(11) 88888-8888",
      address: "Av. Paulista, 456 - São Paulo, SP",
      totalOrders: 3,
      totalSpent: "R$ 280,00",
      lastOrder: "2024-01-14",
      status: "Ativo",
    },
    {
      id: 3,
      name: "Pedro Costa",
      email: "pedro.costa@email.com",
      phone: "(11) 77777-7777",
      address: "Rua Augusta, 789 - São Paulo, SP",
      totalOrders: 8,
      totalSpent: "R$ 720,00",
      lastOrder: "2024-01-13",
      status: "Ativo",
    },
    {
      id: 4,
      name: "Ana Oliveira",
      email: "ana.oliveira@email.com",
      phone: "(11) 66666-6666",
      address: "Rua Oscar Freire, 321 - São Paulo, SP",
      totalOrders: 2,
      totalSpent: "R$ 180,00",
      lastOrder: "2024-01-12",
      status: "Inativo",
    },
  ];

  return (
    <DashboardLayout
      title="Clientes"
      description="Gerencie sua base de clientes, visualize histórico de compras e informações de contato."
    >
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Cliente
          </Button>
          <Button variant="outline">
            <Search className="mr-2 h-4 w-4" />
            Buscar
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {mockCustomers.length} clientes cadastrados
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCustomers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={`/avatars/${customer.id}.jpg`}
                    alt={customer.name}
                  />
                  <AvatarFallback className="text-lg">
                    {customer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">
                    {customer.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground truncate">
                    {customer.email}
                  </p>
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs ${
                    customer.status === "Ativo"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {customer.status}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-start space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="line-clamp-2">{customer.address}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div className="text-center">
                  <div className="text-lg font-semibold text-primary">
                    {customer.totalOrders}
                  </div>
                  <div className="text-xs text-muted-foreground">Pedidos</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-primary">
                    {customer.totalSpent}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total Gasto
                  </div>
                </div>
              </div>

              {/* Last Order */}
              <div className="text-sm text-muted-foreground">
                Último pedido: {customer.lastOrder}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Mail className="mr-2 h-4 w-4" />
                  Contatar
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Histórico
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {mockCustomers.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Nenhum cliente cadastrado
            </h3>
            <p className="text-muted-foreground mb-4">
              Comece adicionando seus primeiros clientes.
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Primeiro Cliente
            </Button>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
};
