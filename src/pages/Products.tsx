import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  Plus,
  Package,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { DashboardLayout } from "../components/layout";
import { ProductModal } from "../components/ProductModal";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";
import { ProductDebug } from "../components/ProductDebug";
import { useProducts } from "../hooks/useProducts";
import type { Product } from "../types/product";
import type { ProductFormData } from "../lib/validations";

export const Products: React.FC = () => {
  const {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    clearError,
    refreshProducts,
  } = useProducts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debug: log produtos quando mudam
  useEffect(() => {
    console.log("Products page: produtos atualizados", products.length);
  }, [products]);

  const categories = [
    "Vestidos",
    "Blusas",
    "Calças",
    "Saias",
    "Casacos",
    "Acessórios",
    "Sapatos",
    "Bolsas",
    "Outros",
  ];
  const statuses = ["active", "inactive", "out_of_stock"];

  // Filtrar produtos
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    const matchesStatus = !selectedStatus || product.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      setIsDeleting(true);
      await deleteProduct(productToDelete.id);
      setDeleteModalOpen(false);
      setProductToDelete(null);
      // Forçar atualização após exclusão
      setTimeout(() => refreshProducts(), 100);
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleSubmitProduct = async (data: ProductFormData) => {
    try {
      if (editingProduct) {
        await updateProduct({
          id: editingProduct.id,
          ...data,
        });
      } else {
        await createProduct(data);
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      // Forçar atualização após criação/edição
      setTimeout(() => refreshProducts(), 100);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  };

  const handleRefresh = () => {
    console.log("Refresh manual solicitado");
    refreshProducts();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "out_of_stock":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "inactive":
        return "Inativo";
      case "out_of_stock":
        return "Sem Estoque";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />;
      case "inactive":
        return <XCircle className="h-4 w-4" />;
      case "out_of_stock":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  if (loading) {
    return (
      <DashboardLayout
        title="Produtos"
        description="Gerencie seu catálogo de produtos, adicione novos itens e controle o estoque."
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando produtos...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Produtos"
      description="Gerencie seu catálogo de produtos, adicione novos itens e controle o estoque."
    >
      {/* Debug Component */}
      <ProductDebug />

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-destructive text-sm">{error}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearError}
            className="mt-2 text-destructive hover:text-destructive"
          >
            Fechar
          </Button>
        </div>
      )}

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-2">
          <Button onClick={handleAddProduct}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Produto
          </Button>
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Atualizar
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredProducts.length} de {products.length} produtos
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Buscar</label>
          <Input
            placeholder="Buscar por nome ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Categoria</label>
          <select
            className="w-full p-2 border border-input rounded-md bg-background"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Todas as categorias</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <select
            className="w-full p-2 border border-input rounded-md bg-background"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">Todos os status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {getStatusText(status)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-2">
                  {product.name}
                </CardTitle>
                <Badge
                  className={`${getStatusColor(
                    product.status
                  )} flex-shrink-0 flex items-center gap-1`}
                >
                  {getStatusIcon(product.status)}
                  {getStatusText(product.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.description}
              </p>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Preço:</span>
                  <span className="font-semibold text-primary">
                    {formatPrice(product.price)}
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
                {product.color && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Cor:</span>
                    <span className="text-sm">{product.color}</span>
                  </div>
                )}
                {product.size && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Tamanho:
                    </span>
                    <span className="text-sm">{product.size}</span>
                  </div>
                )}
                {product.brand && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Marca:
                    </span>
                    <span className="text-sm">{product.brand}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleEditProduct(product)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="mr-2 h-4 w-4" />
                  Ver
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteClick(product)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {products.length === 0
                ? "Nenhum produto cadastrado"
                : "Nenhum produto encontrado"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {products.length === 0
                ? "Comece adicionando seu primeiro produto ao catálogo."
                : "Tente ajustar os filtros de busca."}
            </p>
            {products.length === 0 && (
              <Button onClick={handleAddProduct}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Primeiro Produto
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleSubmitProduct}
        product={editingProduct}
        loading={loading}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Excluir Produto"
        description="Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
        productName={productToDelete?.name}
        loading={isDeleting}
      />
    </DashboardLayout>
  );
};
