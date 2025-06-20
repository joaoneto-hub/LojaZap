import { useState, useEffect } from "react";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import type { CategoryFormData } from "../lib/validations";

export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  isDefault: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Categorias padrão do sistema - Genéricas para qualquer tipo de negócio
export const DEFAULT_CATEGORIES = [
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
  { name: "Promoções", description: "Produtos em promoção", color: "#F59E0B" },
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
];

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Carregar categorias do usuário
  useEffect(() => {
    if (!user) {
      setCategories([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const categoriesQuery = query(
      collection(db, "categories"),
      where("userId", "==", user.id)
      // Removendo orderBy temporariamente para debug
      // orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      categoriesQuery,
      (snapshot) => {
        const categoriesData: Category[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          categoriesData.push({
            id: doc.id,
            name: data.name,
            description: data.description,
            color: data.color,
            isDefault: data.isDefault || false,
            userId: data.userId,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          });
        });

        // Ordenar no frontend
        categoriesData.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );

        setCategories(categoriesData);
        setLoading(false);
      },
      (error) => {
        console.error("Erro ao carregar categorias:", error);
        setError("Erro ao carregar categorias");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Criar nova categoria
  const createCategory = async (data: CategoryFormData): Promise<string> => {
    if (!user) throw new Error("Usuário não autenticado");

    try {
      const categoryData = {
        name: data.name,
        description: data.description || "",
        color: data.color || "#6B7280",
        isDefault: false,
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(collection(db, "categories"), categoryData);
      console.log("Categoria criada com sucesso:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      throw new Error("Erro ao criar categoria");
    }
  };

  // Atualizar categoria
  const updateCategory = async (
    id: string,
    data: CategoryFormData
  ): Promise<void> => {
    if (!user) throw new Error("Usuário não autenticado");

    try {
      const categoryRef = doc(db, "categories", id);
      const category = categories.find((c) => c.id === id);

      if (!category) throw new Error("Categoria não encontrada");
      if (category.userId !== user.id) throw new Error("Acesso negado");

      await updateDoc(categoryRef, {
        name: data.name,
        description: data.description || "",
        color: data.color || "#6B7280",
        updatedAt: new Date(),
      });

      console.log("Categoria atualizada com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      throw new Error("Erro ao atualizar categoria");
    }
  };

  // Deletar categoria
  const deleteCategory = async (id: string): Promise<void> => {
    if (!user) throw new Error("Usuário não autenticado");

    try {
      const category = categories.find((c) => c.id === id);
      if (!category) throw new Error("Categoria não encontrada");
      if (category.userId !== user.id) throw new Error("Acesso negado");
      if (category.isDefault)
        throw new Error("Não é possível deletar categorias padrão");

      await deleteDoc(doc(db, "categories", id));
      console.log("Categoria deletada com sucesso");
    } catch (error) {
      console.error("Erro ao deletar categoria:", error);
      throw new Error("Erro ao deletar categoria");
    }
  };

  // Limpar erro
  const clearError = () => setError(null);

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    clearError,
  };
};
