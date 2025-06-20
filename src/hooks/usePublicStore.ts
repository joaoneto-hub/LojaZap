import { useState, useEffect } from "react";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Product } from "../types/product";
import type { StoreSettings } from "../types/store";

export const usePublicStore = (userId: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listener para produtos públicos (apenas ativos)
  useEffect(() => {
    console.log("🔍 usePublicStore: Iniciando com userId:", userId);
    console.log("🔍 usePublicStore: Environment:", import.meta.env.MODE);

    if (!userId) {
      console.log("❌ usePublicStore: userId vazio, parando");
      setProducts([]);
      setLoading(false);
      return;
    }

    console.log("=== INICIANDO LISTENER PÚBLICO ===");
    console.log("Usuário:", userId);

    setLoading(true);
    setError(null);

    try {
      const productsRef = collection(db, "products");
      const q = query(
        productsRef,
        where("userId", "==", userId),
        where("status", "==", "active")
      );

      const unsubscribeProducts = onSnapshot(
        q,
        (snapshot) => {
          console.log("=== PRODUTOS PÚBLICOS RECEBIDOS ===");
          console.log("Documentos encontrados:", snapshot.docs.length);

          const productsData: Product[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name,
              description: data.description,
              price: data.price,
              stock: data.stock,
              categories: data.categories || [data.category || ""],
              color: data.color,
              size: data.size,
              brand: data.brand,
              images: data.images || [],
              mainImage: data.mainImage,
              status: data.status,
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
              userId: data.userId,
            };
          });

          console.log("Produtos processados:", productsData);
          setProducts(productsData);
        },
        (error) => {
          console.error("❌ Erro no listener de produtos públicos:", error);
          setError(error.message);
        }
      );

      // Listener para configurações da loja
      const settingsRef = doc(db, "storeSettings", userId);

      const unsubscribeSettings = onSnapshot(
        settingsRef,
        (doc) => {
          console.log("=== CONFIGURAÇÕES PÚBLICAS RECEBIDAS ===");
          console.log("Documento existe:", doc.exists());

          if (doc.exists()) {
            const data = doc.data();
            console.log("Dados das configurações:", data);

            const settings: StoreSettings = {
              id: doc.id,
              userId: data.userId,
              name: data.name,
              description: data.description,
              phone: data.phone,
              email: data.email,
              address: data.address,
              openingTime: data.openingTime,
              closingTime: data.closingTime,
              workingDays: data.workingDays,
              logo: data.logo || null,
              bannerImage: data.bannerImage || null,
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
            };

            console.log("Configurações processadas:", settings);
            setStoreSettings(settings);
          } else {
            console.log("Configurações não encontradas");
            setStoreSettings(null);
          }

          setLoading(false);
        },
        (error) => {
          console.error(
            "❌ Erro no listener de configurações públicas:",
            error
          );
          setError(error.message);
          setLoading(false);
        }
      );

      return () => {
        console.log("=== LIMPANDO LISTENERS PÚBLICOS ===");
        unsubscribeProducts();
        unsubscribeSettings();
      };
    } catch (error) {
      console.error("❌ Erro ao configurar listeners públicos:", error);
      setError(error instanceof Error ? error.message : "Erro desconhecido");
      setLoading(false);
    }
  }, [userId]);

  return {
    products,
    storeSettings,
    loading,
    error,
  };
};
