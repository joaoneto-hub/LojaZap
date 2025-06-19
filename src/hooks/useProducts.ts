import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import type {
  Product,
  CreateProductData,
  UpdateProductData,
  ProductFilters,
} from "../types/product";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Função para forçar atualização da lista
  const refreshProducts = () => {
    console.log("Forçando atualização da lista de produtos");
    setLoading(true);
  };

  // Buscar produtos do usuário
  useEffect(() => {
    if (!user) {
      setProducts([]);
      setLoading(false);
      return;
    }

    console.log("Iniciando listener de produtos para usuário:", user.id);
    setLoading(true);

    const productsRef = collection(db, "products");

    // Query simples para testar
    const q = query(productsRef, where("userId", "==", user.id));

    console.log("Query criada:", q);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log("=== SNAPSHOT RECEBIDO ===");
        console.log("Documentos no snapshot:", snapshot.docs.length);
        console.log("Mudanças:", snapshot.docChanges().length);

        snapshot.docChanges().forEach((change) => {
          console.log(`Mudança: ${change.type} - ${change.doc.id}`);
        });

        const productsData: Product[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          console.log("Processando documento:", doc.id, data);
          productsData.push({
            id: doc.id,
            name: data.name,
            description: data.description,
            price: data.price,
            stock: data.stock,
            category: data.category,
            color: data.color,
            size: data.size,
            brand: data.brand,
            images: data.images || [],
            status: data.status,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            userId: data.userId,
          });
        });

        // Ordenar por createdAt no frontend
        productsData.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );

        console.log("Produtos processados:", productsData.length);
        console.log(
          "Produtos:",
          productsData.map((p) => ({ id: p.id, name: p.name }))
        );
        console.log("=== FIM SNAPSHOT ===");

        setProducts(productsData);
        setLoading(false);
      },
      (error) => {
        console.error("Erro ao buscar produtos:", error);
        console.error("Detalhes do erro:", error.code, error.message);
        setError("Erro ao carregar produtos");
        setLoading(false);
      }
    );

    return () => {
      console.log("Desconectando listener de produtos");
      unsubscribe();
    };
  }, [user]);

  // Criar produto
  const createProduct = async (
    productData: CreateProductData
  ): Promise<string> => {
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    try {
      console.log("Criando produto:", productData);
      setError(null);
      const productsRef = collection(db, "products");

      const productToCreate = {
        ...productData,
        userId: user.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      console.log("Dados para criação:", productToCreate);
      const docRef = await addDoc(productsRef, productToCreate);

      console.log("Produto criado com ID:", docRef.id);

      // Aguardar um pouco para o listener processar
      setTimeout(() => {
        console.log("Verificando se o produto foi adicionado à lista...");
        console.log("Produtos atuais:", products.length);
      }, 1000);

      return docRef.id;
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao criar produto";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Atualizar produto
  const updateProduct = async (
    productData: UpdateProductData
  ): Promise<void> => {
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    try {
      console.log("Atualizando produto:", productData);
      setError(null);
      const productRef = doc(db, "products", productData.id);

      // Verificar se o produto pertence ao usuário
      const productDoc = await getDoc(productRef);
      if (!productDoc.exists()) {
        throw new Error("Produto não encontrado");
      }

      const existingProductData = productDoc.data();
      if (existingProductData.userId !== user.id) {
        throw new Error("Produto não autorizado");
      }

      // Criar objeto de atualização apenas com os campos fornecidos
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: any = {
        updatedAt: serverTimestamp(),
      };

      // Adicionar apenas os campos que foram fornecidos
      if (productData.name !== undefined) updateData.name = productData.name;
      if (productData.description !== undefined)
        updateData.description = productData.description;
      if (productData.price !== undefined) updateData.price = productData.price;
      if (productData.stock !== undefined) updateData.stock = productData.stock;
      if (productData.category !== undefined)
        updateData.category = productData.category;
      if (productData.color !== undefined) updateData.color = productData.color;
      if (productData.size !== undefined) updateData.size = productData.size;
      if (productData.brand !== undefined) updateData.brand = productData.brand;
      if (productData.status !== undefined)
        updateData.status = productData.status;
      if (productData.images !== undefined)
        updateData.images = productData.images;

      console.log("Dados para atualização:", updateData);
      await updateDoc(productRef, updateData);
      console.log("Produto atualizado com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao atualizar produto";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Deletar produto
  const deleteProduct = async (productId: string): Promise<void> => {
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    try {
      console.log("Deletando produto:", productId);
      setError(null);
      const productRef = doc(db, "products", productId);

      // Verificar se o produto pertence ao usuário
      const productDoc = await getDoc(productRef);
      if (!productDoc.exists()) {
        throw new Error("Produto não encontrado");
      }

      const productData = productDoc.data();
      if (productData.userId !== user.id) {
        throw new Error("Produto não autorizado");
      }

      await deleteDoc(productRef);
      console.log("Produto deletado com sucesso");
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao deletar produto";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Filtrar produtos
  const filterProducts = (filters: ProductFilters): Product[] => {
    return products.filter((product) => {
      // Filtro por categoria
      if (filters.category && product.category !== filters.category) {
        return false;
      }

      // Filtro por status
      if (filters.status && product.status !== filters.status) {
        return false;
      }

      // Filtro por preço mínimo
      if (filters.minPrice && product.price < filters.minPrice) {
        return false;
      }

      // Filtro por preço máximo
      if (filters.maxPrice && product.price > filters.maxPrice) {
        return false;
      }

      // Filtro por estoque
      if (filters.inStock && product.stock === 0) {
        return false;
      }

      // Filtro por busca (nome ou descrição)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const nameMatch = product.name.toLowerCase().includes(searchLower);
        const descriptionMatch = product.description
          .toLowerCase()
          .includes(searchLower);
        if (!nameMatch && !descriptionMatch) {
          return false;
        }
      }

      return true;
    });
  };

  // Buscar produto por ID
  const getProductById = (productId: string): Product | undefined => {
    return products.find((product) => product.id === productId);
  };

  // Atualizar estoque
  const updateStock = async (
    productId: string,
    newStock: number
  ): Promise<void> => {
    await updateProduct({ id: productId, stock: newStock });
  };

  // Atualizar status
  const updateStatus = async (
    productId: string,
    status: "active" | "inactive" | "out_of_stock"
  ): Promise<void> => {
    await updateProduct({ id: productId, status });
  };

  // Buscar produtos por categoria
  const getProductsByCategory = (category: string): Product[] => {
    return products.filter((product) => product.category === category);
  };

  // Buscar produtos com estoque baixo
  const getLowStockProducts = (threshold: number = 5): Product[] => {
    return products.filter((product) => product.stock <= threshold);
  };

  // Buscar produtos ativos
  const getActiveProducts = (): Product[] => {
    return products.filter((product) => product.status === "active");
  };

  // Contar produtos por status
  const getProductCountByStatus = () => {
    return {
      active: products.filter((p) => p.status === "active").length,
      inactive: products.filter((p) => p.status === "inactive").length,
      out_of_stock: products.filter((p) => p.status === "out_of_stock").length,
      total: products.length,
    };
  };

  // Calcular valor total do estoque
  const getTotalStockValue = (): number => {
    return products.reduce((total, product) => {
      return total + product.price * product.stock;
    }, 0);
  };

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    filterProducts,
    getProductById,
    updateStock,
    updateStatus,
    getProductsByCategory,
    getLowStockProducts,
    getActiveProducts,
    getProductCountByStatus,
    getTotalStockValue,
    clearError: () => setError(null),
    refreshProducts,
  };
};
