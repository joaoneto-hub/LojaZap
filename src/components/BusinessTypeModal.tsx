import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useCategories } from "../hooks/useCategories";
import { useAuth } from "../contexts/AuthContext";

interface BusinessTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Tipos de negócio disponíveis
const BUSINESS_TYPES = [
  {
    id: "fashion",
    name: "Moda e Vestuário",
    description: "Roupas, calçados, acessórios e bolsas",
    categories: [
      { name: "Roupas", description: "Vestuário em geral", color: "#3B82F6" },
      { name: "Calçados", description: "Sapatos e tênis", color: "#10B981" },
      {
        name: "Acessórios",
        description: "Acessórios diversos",
        color: "#F59E0B",
      },
      { name: "Bolsas", description: "Bolsas e mochilas", color: "#8B5CF6" },
      {
        name: "Promoções",
        description: "Produtos em promoção",
        color: "#EC4899",
      },
      { name: "Novidades", description: "Lançamentos", color: "#6B7280" },
      { name: "Outros", description: "Outros produtos", color: "#9CA3AF" },
    ],
  },
  {
    id: "beauty",
    name: "Beleza e Cosméticos",
    description: "Produtos de beleza, perfumes e cuidados pessoais",
    categories: [
      {
        name: "Maquiagem",
        description: "Produtos de maquiagem",
        color: "#EC4899",
      },
      {
        name: "Skincare",
        description: "Cuidados com a pele",
        color: "#10B981",
      },
      {
        name: "Perfumes",
        description: "Perfumes e fragrâncias",
        color: "#8B5CF6",
      },
      { name: "Cabelo", description: "Produtos para cabelo", color: "#F59E0B" },
      { name: "Corpo", description: "Produtos para o corpo", color: "#3B82F6" },
      {
        name: "Promoções",
        description: "Produtos em promoção",
        color: "#DC2626",
      },
      { name: "Outros", description: "Outros produtos", color: "#9CA3AF" },
    ],
  },
  {
    id: "electronics",
    name: "Eletrônicos",
    description: "Produtos eletrônicos e tecnologia",
    categories: [
      {
        name: "Smartphones",
        description: "Celulares e smartphones",
        color: "#3B82F6",
      },
      {
        name: "Computadores",
        description: "Notebooks e desktops",
        color: "#10B981",
      },
      {
        name: "Acessórios",
        description: "Acessórios eletrônicos",
        color: "#F59E0B",
      },
      { name: "Gaming", description: "Produtos para games", color: "#8B5CF6" },
      { name: "Áudio", description: "Fones e caixas de som", color: "#EC4899" },
      {
        name: "Promoções",
        description: "Produtos em promoção",
        color: "#DC2626",
      },
      { name: "Outros", description: "Outros produtos", color: "#9CA3AF" },
    ],
  },
  {
    id: "home",
    name: "Casa e Decoração",
    description: "Produtos para casa, decoração e jardinagem",
    categories: [
      { name: "Decoração", description: "Itens decorativos", color: "#3B82F6" },
      {
        name: "Cozinha",
        description: "Utensílios de cozinha",
        color: "#10B981",
      },
      {
        name: "Jardinagem",
        description: "Produtos para jardim",
        color: "#F59E0B",
      },
      {
        name: "Organização",
        description: "Produtos organizacionais",
        color: "#8B5CF6",
      },
      {
        name: "Iluminação",
        description: "Lâmpadas e luminárias",
        color: "#EC4899",
      },
      {
        name: "Promoções",
        description: "Produtos em promoção",
        color: "#DC2626",
      },
      { name: "Outros", description: "Outros produtos", color: "#9CA3AF" },
    ],
  },
  {
    id: "food",
    name: "Alimentos e Bebidas",
    description: "Comidas, bebidas e produtos alimentícios",
    categories: [
      {
        name: "Alimentos",
        description: "Produtos alimentícios",
        color: "#3B82F6",
      },
      { name: "Bebidas", description: "Bebidas diversas", color: "#10B981" },
      { name: "Doces", description: "Doces e sobremesas", color: "#F59E0B" },
      {
        name: "Orgânicos",
        description: "Produtos orgânicos",
        color: "#8B5CF6",
      },
      {
        name: "Promoções",
        description: "Produtos em promoção",
        color: "#EC4899",
      },
      { name: "Novidades", description: "Novos produtos", color: "#6B7280" },
      { name: "Outros", description: "Outros produtos", color: "#9CA3AF" },
    ],
  },
  {
    id: "sports",
    name: "Esportes e Fitness",
    description: "Produtos esportivos e para atividades físicas",
    categories: [
      {
        name: "Roupas Esportivas",
        description: "Vestuário para esportes",
        color: "#3B82F6",
      },
      {
        name: "Calçados Esportivos",
        description: "Tênis e sapatos esportivos",
        color: "#10B981",
      },
      {
        name: "Equipamentos",
        description: "Equipamentos esportivos",
        color: "#F59E0B",
      },
      {
        name: "Suplementos",
        description: "Suplementos alimentares",
        color: "#8B5CF6",
      },
      {
        name: "Fitness",
        description: "Produtos para fitness",
        color: "#EC4899",
      },
      {
        name: "Promoções",
        description: "Produtos em promoção",
        color: "#DC2626",
      },
      { name: "Outros", description: "Outros produtos", color: "#9CA3AF" },
    ],
  },
  {
    id: "books",
    name: "Livros e Educação",
    description: "Livros, materiais educativos e publicações",
    categories: [
      { name: "Livros", description: "Livros diversos", color: "#3B82F6" },
      {
        name: "Educação",
        description: "Materiais educativos",
        color: "#10B981",
      },
      {
        name: "Revistas",
        description: "Revistas e publicações",
        color: "#F59E0B",
      },
      {
        name: "Papelaria",
        description: "Produtos de papelaria",
        color: "#8B5CF6",
      },
      {
        name: "Promoções",
        description: "Produtos em promoção",
        color: "#EC4899",
      },
      { name: "Novidades", description: "Novos lançamentos", color: "#6B7280" },
      { name: "Outros", description: "Outros produtos", color: "#9CA3AF" },
    ],
  },
  {
    id: "generic",
    name: "Negócio Genérico",
    description: "Categorias genéricas para qualquer tipo de negócio",
    categories: [
      {
        name: "Produtos Principais",
        description: "Produtos principais do seu negócio",
        color: "#3B82F6",
      },
      {
        name: "Acessórios",
        description: "Acessórios e complementos",
        color: "#10B981",
      },
      {
        name: "Promoções",
        description: "Produtos em promoção",
        color: "#F59E0B",
      },
      {
        name: "Novidades",
        description: "Produtos novos e lançamentos",
        color: "#8B5CF6",
      },
      {
        name: "Mais Vendidos",
        description: "Produtos mais populares",
        color: "#EC4899",
      },
      {
        name: "Categoria 1",
        description: "Primeira categoria personalizada",
        color: "#6B7280",
      },
      {
        name: "Categoria 2",
        description: "Segunda categoria personalizada",
        color: "#059669",
      },
      {
        name: "Categoria 3",
        description: "Terceira categoria personalizada",
        color: "#DC2626",
      },
      {
        name: "Categoria 4",
        description: "Quarta categoria personalizada",
        color: "#7C3AED",
      },
      { name: "Outros", description: "Outros produtos", color: "#9CA3AF" },
    ],
  },
];

export const BusinessTypeModal: React.FC<BusinessTypeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createCategory } = useCategories();
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!selectedBusinessType || !user) return;

    try {
      setIsSubmitting(true);
      const businessType = BUSINESS_TYPES.find(
        (bt) => bt.id === selectedBusinessType
      );

      if (businessType) {
        // Criar todas as categorias do tipo de negócio selecionado
        const batch = [];
        for (const category of businessType.categories) {
          const categoryData = {
            name: category.name,
            description: category.description,
            color: category.color,
            isDefault: true,
            userId: user.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          batch.push(createCategory(categoryData));
        }

        await Promise.all(batch);
        onClose();
      }
    } catch (error) {
      console.error("Erro ao configurar categorias:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedBusiness = BUSINESS_TYPES.find(
    (bt) => bt.id === selectedBusinessType
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configurar Categorias do Negócio</DialogTitle>
          <DialogDescription>
            Escolha o tipo do seu negócio para configurar categorias específicas
            automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="business-type">Tipo de Negócio</Label>
            <Select
              value={selectedBusinessType}
              onValueChange={setSelectedBusinessType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo do seu negócio" />
              </SelectTrigger>
              <SelectContent>
                {BUSINESS_TYPES.map((businessType) => (
                  <SelectItem key={businessType.id} value={businessType.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{businessType.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {businessType.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedBusiness && (
            <div className="space-y-3">
              <Label>Categorias que serão criadas:</Label>
              <div className="grid grid-cols-2 gap-2">
                {selectedBusiness.categories.map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 border rounded-md"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm">{category.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedBusinessType || isSubmitting}
            >
              {isSubmitting ? "Configurando..." : "Configurar Categorias"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
