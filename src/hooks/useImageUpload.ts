import { useState } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

export interface UploadResult {
  url: string;
  path: string;
}

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Função para converter arquivo para base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const uploadImage = async (
    file: File,
    folder: string = "products"
  ): Promise<UploadResult> => {
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    if (!file) {
      throw new Error("Nenhum arquivo selecionado");
    }

    // Validar tipo de arquivo
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      throw new Error("Tipo de arquivo não suportado. Use JPG, PNG ou WebP.");
    }

    // Validar tamanho (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error("Arquivo muito grande. Máximo 5MB.");
    }

    setUploading(true);
    setError(null);

    console.log("🚀 Iniciando upload:", {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      folder,
      userId: user.id,
    });

    // Tentar upload para Firebase Storage primeiro
    try {
      // Gerar nome único para o arquivo
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const filePath = `${folder}/${user.id}/${fileName}`;

      console.log("📁 Caminho do arquivo:", filePath);

      // Criar referência no Storage
      const storageRef = ref(storage, filePath);

      // Fazer upload com timeout
      console.log("⬆️ Fazendo upload para Firebase Storage...");

      const uploadPromise = uploadBytes(storageRef, file);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Upload timeout")), 5000)
      );

      const snapshot = await Promise.race([uploadPromise, timeoutPromise]);

      console.log("✅ Upload concluído, obtendo URL...");

      // Obter URL de download
      const downloadURL = await getDownloadURL(snapshot.ref);

      console.log("✅ Imagem enviada com sucesso:", {
        url: downloadURL,
        path: filePath,
        size: snapshot.metadata.size,
      });

      toast.success("Imagem enviada com sucesso!", {
        duration: 2000,
        position: "top-right",
        style: {
          background: "#f0fdf4",
          color: "#166534",
          border: "1px solid #bbf7d0",
        },
      });

      return {
        url: downloadURL,
        path: filePath,
      };
    } catch (firebaseError: unknown) {
      console.warn(
        "⚠️ Erro no Firebase Storage, usando base64:",
        firebaseError
      );

      // Fallback para base64
      console.log("🔄 Iniciando fallback para base64...");
      const result = await uploadAsBase64(file, folder);
      console.log("✅ Fallback para base64 concluído:", result);
      return result;
    } finally {
      setUploading(false);
    }
  };

  // Função auxiliar para upload como base64
  const uploadAsBase64 = async (
    file: File,
    folder: string
  ): Promise<UploadResult> => {
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    console.log("🔄 Convertendo para base64...");
    const base64Url = await fileToBase64(file);

    // Criar um "path" simulado para base64
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const simulatedPath = `base64/${folder}/${user.id}/${fileName}`;

    console.log("✅ Imagem convertida para base64:", {
      url: base64Url.substring(0, 50) + "...",
      path: simulatedPath,
      size: file.size,
    });

    toast.error(
      "Firebase Storage não configurado. Usando armazenamento local.",
      {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#fef3cd",
          color: "#856404",
          border: "1px solid #ffeaa7",
        },
      }
    );

    return {
      url: base64Url,
      path: simulatedPath,
    };
  };

  const deleteImage = async (path: string): Promise<void> => {
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    setUploading(true);
    setError(null);

    try {
      // Se o path começa com "base64/", não precisa deletar do Firebase
      if (path.startsWith("base64/")) {
        console.log("🗑️ Imagem base64 - não precisa deletar do Firebase");
        toast.success("Imagem removida", {
          duration: 2000,
          position: "top-right",
          style: {
            background: "#f0fdf4",
            color: "#166534",
            border: "1px solid #bbf7d0",
          },
        });
        return;
      }

      // Deletar do Firebase Storage
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
      console.log("✅ Imagem deletada com sucesso:", path);

      // Mostrar toast de sucesso
      toast.success("Imagem removida com sucesso", {
        duration: 2000,
        position: "top-right",
        style: {
          background: "#f0fdf4",
          color: "#166534",
          border: "1px solid #bbf7d0",
        },
      });
    } catch (error) {
      console.error("❌ Erro ao deletar imagem:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao deletar imagem";
      setError(errorMessage);

      // Mostrar toast de erro
      toast.error(errorMessage, {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#fef2f2",
          color: "#dc2626",
          border: "1px solid #fecaca",
        },
      });

      throw new Error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    uploadImage,
    deleteImage,
    uploading,
    error,
    clearError,
  };
};
