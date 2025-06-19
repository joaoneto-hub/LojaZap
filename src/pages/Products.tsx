import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Plus, Search, Filter, Package } from "lucide-react";
import { DashboardLayout } from "../components/layout";

export const Products: React.FC = () => {
  const mockProducts = [
    {
      id: 1,
      name: "Vestido Floral",
      price: "R$ 89,90",
      stock: 15,
      category: "Vestidos",
      status: "Ativo",
    },
    {
      id: 2,
      name: "Blusa Básica",
      price: "R$ 45,00",
      stock: 8,
      category: "Blusas",
      status: "Ativo",
    },
    {
      id: 3,
      name: "Calça Jeans",
      price: "R$ 120,00",
      stock: 0,
      category: "Calças",
      status: "Sem Estoque",
    },
  ];

  return (
    <DashboardLayout
      title="Produtos"
      description="Gerencie seu catálogo de produtos, adicione novos itens e controle o estoque."
    >
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Produto
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
          {mockProducts.length} produtos cadastrados
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    product.status === "Ativo"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Preço:</span>
                  <span className="font-semibold text-primary">
                    {product.price}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Estoque:
                  </span>
                  <span className={product.stock === 0 ? "text-red-600" : ""}>
                    {product.stock} unidades
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Categoria:
                  </span>
                  <span className="text-sm">{product.category}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  Editar
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Ver Detalhes
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State (for demonstration) */}
      {mockProducts.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Nenhum produto cadastrado
            </h3>
            <p className="text-muted-foreground mb-4">
              Comece adicionando seu primeiro produto ao catálogo.
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Primeiro Produto
            </Button>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
};
