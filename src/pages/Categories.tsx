import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Plus, Edit, Trash2, Tag, Settings } from "lucide-react";
import { DashboardLayout } from "../components/layout";
import { CategoryModal } from "../components/CategoryModal";
import { BusinessTypeModal } from "../components/BusinessTypeModal";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";
import { useCategories, type Category } from "../hooks/useCategories";
import type { CategoryFormData } from "../lib/validations";

export const Categories: React.FC = () => {
  const {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    clearError,
  } = useCategories();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBusinessTypeModalOpen, setIsBusinessTypeModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // Mostrar modal de configuração automaticamente se não há categorias
  useEffect(() => {
    if (!loading && categories.length === 0) {
      setIsBusinessTypeModalOpen(true);
    }
  }, [loading, categories.length]);

  // Filtrar categorias
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description &&
        category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    try {
      setIsDeleting(true);
      await deleteCategory(categoryToDelete.id);
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Erro ao deletar categoria:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  const handleSubmitCategory = async (data: CategoryFormData) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, data);
      } else {
        await createCategory(data);
      }
      setIsModalOpen(false);
      setEditingCategory(null);
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
    }
  };

  const handleReconfigureCategories = () => {
    setIsBusinessTypeModalOpen(true);
  };

  const handleBusinessTypeModalClose = () => {
    setIsBusinessTypeModalOpen(false);
    // Se ainda não há categorias após fechar o modal, não mostrar novamente
    if (categories.length === 0) {
      // Opcional: redirecionar para outra página ou mostrar mensagem
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        title="Categorias"
        description="Gerencie as categorias dos seus produtos para melhor organização."
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando categorias...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Categorias"
      description="Gerencie as categorias dos seus produtos para melhor organização."
    >
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
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div className="flex gap-2">
          <Button onClick={handleAddCategory}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Categoria
          </Button>
          <Button variant="outline" onClick={handleReconfigureCategories}>
            <Settings className="mr-2 h-4 w-4" />
            Reconfigurar por Tipo de Negócio
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredCategories.length} de {categories.length} categorias
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Buscar categorias</label>
          <Input
            placeholder="Buscar por nome ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Categories Table */}
      {filteredCategories.length > 0 ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Cor</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="w-24">Tipo</TableHead>
                <TableHead className="w-32">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div
                      className="w-6 h-6 rounded-full border border-border"
                      style={{ backgroundColor: category.color }}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {category.description || "—"}
                  </TableCell>
                  <TableCell>
                    {category.isDefault ? (
                      <Badge variant="secondary" className="text-xs">
                        Padrão
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Personalizada
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditCategory(category)}
                        disabled={category.isDefault}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteClick(category)}
                        disabled={category.isDefault}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        /* Empty State */
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Tag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {categories.length === 0
                ? "Configure suas categorias"
                : "Nenhuma categoria encontrada"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {categories.length === 0
                ? "Escolha o tipo do seu negócio para configurar categorias específicas automaticamente."
                : "Tente ajustar o termo de busca."}
            </p>
            {categories.length === 0 && (
              <div className="flex gap-2 justify-center">
                <Button onClick={handleAddCategory}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Categoria Manualmente
                </Button>
                <Button variant="outline" onClick={handleReconfigureCategories}>
                  <Settings className="mr-2 h-4 w-4" />
                  Configurar por Tipo de Negócio
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleSubmitCategory}
        category={editingCategory}
        loading={loading}
      />

      {/* Business Type Modal */}
      <BusinessTypeModal
        isOpen={isBusinessTypeModalOpen}
        onClose={handleBusinessTypeModalClose}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Excluir Categoria"
        description="Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita."
        productName={categoryToDelete?.name}
        loading={isDeleting}
      />
    </DashboardLayout>
  );
};
