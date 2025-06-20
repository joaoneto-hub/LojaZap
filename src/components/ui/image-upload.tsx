import React, { useState, useRef, useEffect } from "react";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { useImageUpload } from "../../hooks/useImageUpload";
import toast from "react-hot-toast";

interface ImageUploadProps {
  onImageUpload: (result: { url: string; path: string }) => void;
  onImageRemove?: () => void;
  currentImageUrl?: string;
  folder?: string;
  label?: string;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  onImageRemove,
  currentImageUrl,
  folder = "products",
  label = "Upload de Imagem",
  className = "",
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImageUrl || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, uploading, error, clearError } = useImageUpload();

  // Atualizar preview quando currentImageUrl mudar
  useEffect(() => {
    setPreviewUrl(currentImageUrl || null);
  }, [currentImageUrl]);

  // Mostrar toast de erro quando houver erro
  useEffect(() => {
    if (error) {
      toast.error(error, {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#fef2f2",
          color: "#dc2626",
          border: "1px solid #fecaca",
        },
      });
    }
  }, [error]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    try {
      clearError();

      // Criar preview imediatamente
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Mostrar toast de loading
      const loadingToast = toast.loading("Enviando imagem...", {
        position: "top-right",
      });

      // Fazer upload
      const result = await uploadImage(file, folder);
      console.log("✅ Upload concluído:", result);

      // Fechar toast de loading e mostrar sucesso
      toast.dismiss(loadingToast);
      toast.success("Imagem enviada com sucesso!", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#f0fdf4",
          color: "#166534",
          border: "1px solid #bbf7d0",
        },
      });

      // Chamar callback de forma segura
      if (onImageUpload) {
        onImageUpload(result);
      }
    } catch (error) {
      console.error("❌ Erro ao processar arquivo:", error);
      setPreviewUrl(null);
      // O toast de erro já será mostrado pelo useEffect
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    clearError();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onImageRemove?.();

    toast.success("Imagem removida", {
      duration: 2000,
      position: "top-right",
      style: {
        background: "#f0fdf4",
        color: "#166534",
        border: "1px solid #bbf7d0",
      },
    });
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-3 sm:space-y-4 ${className}`}>
      <label className="text-sm font-medium">{label}</label>

      <Card
        className={`border-2 border-dashed transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        }`}
      >
        <CardContent className="p-4 sm:p-6">
          {previewUrl ? (
            <div className="space-y-3 sm:space-y-4">
              <div className="relative group">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-32 sm:h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemove}
                    className="flex items-center gap-2 text-xs sm:text-sm"
                    disabled={uploading}
                  >
                    <X className="h-3 w-3 sm:h-4 sm:w-4" />
                    Remover
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={openFileDialog}
                  disabled={uploading}
                  className="flex-1 text-xs sm:text-sm"
                >
                  <Upload className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Trocar Imagem
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="text-center space-y-3 sm:space-y-4"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-muted rounded-full flex items-center justify-center">
                {uploading ? (
                  <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-muted-foreground" />
                ) : (
                  <ImageIcon className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                )}
              </div>

              <div className="space-y-2">
                <p className="text-xs sm:text-sm font-medium">
                  {uploading ? "Enviando imagem..." : "Arraste uma imagem aqui"}
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG ou WebP até 5MB
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={openFileDialog}
                disabled={uploading}
                className="flex items-center gap-2 text-xs sm:text-sm"
              >
                <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
                Selecionar Arquivo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        className="hidden"
      />
    </div>
  );
};
