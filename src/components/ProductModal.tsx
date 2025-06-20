import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { ImageUpload } from "./ui/image-upload";
import { productSchema, type ProductFormData } from "../lib/validations";
import type { Product, ProductImage } from "../types/product";
import { useCategories } from "../hooks/useCategories";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Package,
  Image,
  Settings,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
  product?: Product | null;
  loading?: boolean;
}

// Configurações de campos por tipo de negócio
interface FieldConfig {
  label: string;
  type: "select" | "input";
  options?: string[];
  placeholder: string;
}

interface BusinessFieldConfig {
  name: string;
  fields: {
    color: FieldConfig;
    size: FieldConfig;
    brand: FieldConfig;
  };
}

const BUSINESS_FIELD_CONFIGS: Record<string, BusinessFieldConfig> = {
  fashion: {
    name: "Moda e Vestuário",
    fields: {
      color: {
        label: "Cor",
        type: "select",
        options: [
          "Preto",
          "Branco",
          "Azul",
          "Vermelho",
          "Verde",
          "Amarelo",
          "Rosa",
          "Roxo",
          "Laranja",
          "Cinza",
          "Marrom",
          "Bege",
          "Outro",
        ],
        placeholder: "Selecione uma cor",
      },
      size: {
        label: "Tamanho",
        type: "select",
        options: ["PP", "P", "M", "G", "GG", "XG", "Único"],
        placeholder: "Selecione um tamanho",
      },
      brand: {
        label: "Marca",
        type: "input",
        placeholder: "Ex: Fashion Brand",
      },
    },
  },
  beauty: {
    name: "Beleza e Cosméticos",
    fields: {
      color: {
        label: "Cor/Tom",
        type: "select",
        options: [
          "Transparente",
          "Bege",
          "Rosa",
          "Vermelho",
          "Roxo",
          "Azul",
          "Verde",
          "Dourado",
          "Prateado",
          "Bronze",
          "Outro",
        ],
        placeholder: "Selecione uma cor/tom",
      },
      size: {
        label: "Volume/Tamanho",
        type: "select",
        options: ["30ml", "50ml", "100ml", "200ml", "500ml", "1L", "Outro"],
        placeholder: "Selecione o volume",
      },
      brand: {
        label: "Marca",
        type: "input",
        placeholder: "Ex: Beauty Brand",
      },
    },
  },
  electronics: {
    name: "Eletrônicos",
    fields: {
      color: {
        label: "Cor",
        type: "select",
        options: [
          "Preto",
          "Branco",
          "Azul",
          "Vermelho",
          "Verde",
          "Cinza",
          "Dourado",
          "Prateado",
          "Rosa",
          "Outro",
        ],
        placeholder: "Selecione uma cor",
      },
      size: {
        label: "Capacidade/Modelo",
        type: "input",
        placeholder: "Ex: 128GB, iPhone 14, etc.",
      },
      brand: {
        label: "Marca",
        type: "input",
        placeholder: "Ex: Apple, Samsung, etc.",
      },
    },
  },
  home: {
    name: "Casa e Decoração",
    fields: {
      color: {
        label: "Cor",
        type: "select",
        options: [
          "Preto",
          "Branco",
          "Azul",
          "Vermelho",
          "Verde",
          "Amarelo",
          "Rosa",
          "Roxo",
          "Laranja",
          "Cinza",
          "Marrom",
          "Bege",
          "Outro",
        ],
        placeholder: "Selecione uma cor",
      },
      size: {
        label: "Dimensões",
        type: "input",
        placeholder: "Ex: 30x40cm, Grande, etc.",
      },
      brand: {
        label: "Marca",
        type: "input",
        placeholder: "Ex: Home Brand",
      },
    },
  },
  food: {
    name: "Alimentos e Bebidas",
    fields: {
      color: {
        label: "Sabor",
        type: "input",
        placeholder: "Ex: Chocolate, Baunilha, etc.",
      },
      size: {
        label: "Peso/Volume",
        type: "select",
        options: ["100g", "200g", "500g", "1kg", "2kg", "5kg", "Outro"],
        placeholder: "Selecione o peso/volume",
      },
      brand: {
        label: "Marca",
        type: "input",
        placeholder: "Ex: Food Brand",
      },
    },
  },
  sports: {
    name: "Esportes",
    fields: {
      color: {
        label: "Cor",
        type: "select",
        options: [
          "Preto",
          "Branco",
          "Azul",
          "Vermelho",
          "Verde",
          "Amarelo",
          "Rosa",
          "Roxo",
          "Laranja",
          "Cinza",
          "Marrom",
          "Outro",
        ],
        placeholder: "Selecione uma cor",
      },
      size: {
        label: "Tamanho",
        type: "select",
        options: ["P", "M", "G", "GG", "XG", "Único"],
        placeholder: "Selecione um tamanho",
      },
      brand: {
        label: "Marca",
        type: "input",
        placeholder: "Ex: Sports Brand",
      },
    },
  },
  books: {
    name: "Livros e Educação",
    fields: {
      color: {
        label: "Tipo",
        type: "select",
        options: [
          "Ficção",
          "Não-ficção",
          "Educacional",
          "Infantil",
          "Técnico",
          "Outro",
        ],
        placeholder: "Selecione o tipo",
      },
      size: {
        label: "Formato",
        type: "select",
        options: ["Pocket", "Brochura", "Capa dura", "Digital", "Outro"],
        placeholder: "Selecione o formato",
      },
      brand: {
        label: "Editora",
        type: "input",
        placeholder: "Ex: Editora ABC",
      },
    },
  },
  other: {
    name: "Outros",
    fields: {
      color: {
        label: "Característica 1",
        type: "input",
        placeholder: "Ex: Cor, tipo, etc.",
      },
      size: {
        label: "Característica 2",
        type: "input",
        placeholder: "Ex: Tamanho, modelo, etc.",
      },
      brand: {
        label: "Marca/Fabricante",
        type: "input",
        placeholder: "Ex: Nome da marca",
      },
    },
  },
};

// Etapas do modal
const STEPS = [
  {
    id: 1,
    title: "Informações Básicas",
    description: "Nome, descrição e status do produto",
    icon: Package,
  },
  {
    id: 2,
    title: "Categorias e Preços",
    description: "Categorias, preço e estoque",
    icon: Settings,
  },
  {
    id: 3,
    title: "Características",
    description: "Cor, tamanho, marca e outras especificações",
    icon: Settings,
  },
  {
    id: 4,
    title: "Imagens",
    description: "Imagem principal e fotos adicionais",
    icon: Image,
  },
];

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  product,
  loading = false,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [mainImage, setMainImage] = useState<ProductImage | null>(null);

  const { categories, loading: categoriesLoading } = useCategories();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      status: "active",
      categories: [],
      color: "",
      size: "",
      brand: "",
    },
  });

  const watchedStatus = watch("status");

  // Detectar tipo de negócio baseado nas categorias selecionadas
  const fieldConfig = useMemo(() => {
    const categoryNames = selectedCategories.map((cat) => cat.toLowerCase());

    if (
      categoryNames.some(
        (cat) =>
          cat.includes("roupa") ||
          cat.includes("moda") ||
          cat.includes("vestuário")
      )
    ) {
      return BUSINESS_FIELD_CONFIGS.fashion;
    } else if (
      categoryNames.some(
        (cat) =>
          cat.includes("beleza") ||
          cat.includes("cosmético") ||
          cat.includes("maquiagem")
      )
    ) {
      return BUSINESS_FIELD_CONFIGS.beauty;
    } else if (
      categoryNames.some(
        (cat) =>
          cat.includes("eletrônico") ||
          cat.includes("tecnologia") ||
          cat.includes("celular")
      )
    ) {
      return BUSINESS_FIELD_CONFIGS.electronics;
    } else if (
      categoryNames.some(
        (cat) =>
          cat.includes("casa") ||
          cat.includes("decoração") ||
          cat.includes("móvel")
      )
    ) {
      return BUSINESS_FIELD_CONFIGS.home;
    } else if (
      categoryNames.some(
        (cat) =>
          cat.includes("alimento") ||
          cat.includes("bebida") ||
          cat.includes("comida")
      )
    ) {
      return BUSINESS_FIELD_CONFIGS.food;
    } else if (
      categoryNames.some(
        (cat) =>
          cat.includes("esporte") ||
          cat.includes("fitness") ||
          cat.includes("academia")
      )
    ) {
      return BUSINESS_FIELD_CONFIGS.sports;
    } else if (
      categoryNames.some(
        (cat) =>
          cat.includes("livro") ||
          cat.includes("educação") ||
          cat.includes("papelaria")
      )
    ) {
      return BUSINESS_FIELD_CONFIGS.books;
    } else {
      return BUSINESS_FIELD_CONFIGS.other;
    }
  }, [selectedCategories]);

  // Carregar dados do produto quando estiver editando
  useEffect(() => {
    if (product && isOpen) {
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        status: product.status,
        categories: product.categories,
        color: product.color || "",
        size: product.size || "",
        brand: product.brand || "",
      });
      setSelectedCategories(product.categories);
      setProductImages(product.images || []);
      setMainImage(product.mainImage || null);
    } else if (!product && isOpen) {
      reset();
      setSelectedCategories([]);
      setProductImages([]);
      setMainImage(null);
      setCurrentStep(1);
    }
  }, [product, isOpen, reset]);

  const handleCategoryToggle = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((cat) => cat !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleImageUpload = (result: { url: string; path: string }) => {
    const newImage: ProductImage = {
      url: result.url,
      path: result.path,
      alt: "",
    };
    setProductImages((prev) => [...prev, newImage]);
  };

  const handleMainImageUpload = (result: { url: string; path: string }) => {
    const newImage: ProductImage = {
      url: result.url,
      path: result.path,
      alt: "",
    };
    setMainImage(newImage);
  };

  const handleImageRemove = () => {
    setProductImages([]);
  };

  const handleMainImageRemove = () => {
    setMainImage(null);
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);

      // Preparar dados do formulário
      const formData: ProductFormData = {
        ...data,
        categories: selectedCategories,
        images: productImages,
        mainImage: mainImage || undefined,
      };

      await onSubmit(formData);

      toast.success(
        product
          ? "Produto atualizado com sucesso!"
          : "Produto criado com sucesso!"
      );

      handleClose();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      toast.error("Erro ao salvar produto. Tente novamente.");
      // Não fechar o modal em caso de erro
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      console.log("ProductModal: closing modal");
      reset();
      setSelectedCategories([]);
      setProductImages([]);
      setMainImage(null);
      setCurrentStep(1);
      onClose();
    }
  };

  const handleNextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canGoToNextStep = () => {
    switch (currentStep) {
      case 1:
        return watch("name") && watch("description");
      case 2:
        return selectedCategories.length > 0 && watch("price") > 0;
      case 3:
        return true; // Características são opcionais
      case 4:
        return true; // Imagens são opcionais
      default:
        return false;
    }
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return !!(watch("name") && watch("description"));
      case 2:
        return !!(selectedCategories.length > 0 && watch("price") > 0);
      case 3:
        return true; // Sempre completa
      case 4:
        return true; // Sempre completa
      default:
        return false;
    }
  };

  // Renderizar campo dinâmico
  const renderDynamicField = (fieldKey: string, fieldConfig: FieldConfig) => {
    const value = watch(fieldKey as keyof ProductFormData);

    if (fieldConfig.type === "select") {
      return (
        <Select
          value={value as string}
          onValueChange={(value: string) =>
            setValue(fieldKey as keyof ProductFormData, value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder={fieldConfig.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {fieldConfig.options?.map((option: string) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    } else {
      return (
        <Input
          {...register(fieldKey as keyof ProductFormData)}
          placeholder={fieldConfig.placeholder}
        />
      );
    }
  };

  // Renderizar conteúdo da etapa atual
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nome do Produto *
              </Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Ex: Nome do produto"
                className={`h-10 ${errors.name ? "border-destructive" : ""}`}
              />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Descrição *
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Descreva o produto, suas características, materiais, etc."
                rows={4}
                className={`resize-none ${
                  errors.description ? "border-destructive" : ""
                }`}
              />
              {errors.description && (
                <p className="text-xs text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Status
              </Label>
              <Select
                value={watchedStatus}
                onValueChange={(
                  value: "active" | "inactive" | "out_of_stock"
                ) => setValue("status", value)}
              >
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="out_of_stock">Sem Estoque</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Categorias *</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-3">
                {categoriesLoading ? (
                  <p className="text-sm text-muted-foreground">
                    Carregando categorias...
                  </p>
                ) : (
                  categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={category.id}
                        checked={selectedCategories.includes(category.name)}
                        onCheckedChange={() =>
                          handleCategoryToggle(category.name)
                        }
                      />
                      <Label
                        htmlFor={category.id}
                        className="text-sm font-normal cursor-pointer flex items-center gap-2"
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </Label>
                    </div>
                  ))
                )}
              </div>
              {errors.categories && (
                <p className="text-xs text-destructive">
                  {errors.categories.message}
                </p>
              )}
              {selectedCategories.length > 0 && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Categorias selecionadas: {selectedCategories.join(", ")}
                  </p>
                  <p className="text-xs text-blue-600 font-medium">
                    Tipo detectado: {fieldConfig.name}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium">
                  Preço (R$) *
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("price", { valueAsNumber: true })}
                  placeholder="0,00"
                  className={`h-10 ${errors.price ? "border-destructive" : ""}`}
                />
                {errors.price && (
                  <p className="text-xs text-destructive">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock" className="text-sm font-medium">
                  Estoque *
                </Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  {...register("stock", { valueAsNumber: true })}
                  placeholder="0"
                  className={`h-10 ${errors.stock ? "border-destructive" : ""}`}
                />
                {errors.stock && (
                  <p className="text-xs text-destructive">
                    {errors.stock.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
              Campos específicos para {fieldConfig.name}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color" className="text-sm font-medium">
                  {fieldConfig.fields.color.label}
                </Label>
                {renderDynamicField("color", fieldConfig.fields.color)}
              </div>

              <div className="space-y-2">
                <Label htmlFor="size" className="text-sm font-medium">
                  {fieldConfig.fields.size.label}
                </Label>
                {renderDynamicField("size", fieldConfig.fields.size)}
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand" className="text-sm font-medium">
                  {fieldConfig.fields.brand.label}
                </Label>
                {renderDynamicField("brand", fieldConfig.fields.brand)}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <h3 className="text-base font-medium">Imagens do Produto</h3>

              {/* Imagem Principal */}
              <ImageUpload
                onImageUpload={handleMainImageUpload}
                onImageRemove={handleMainImageRemove}
                currentImageUrl={mainImage?.url}
                folder="products"
                label="Imagem Principal"
                className="border-2 border-primary/20"
              />

              {/* Imagens Adicionais */}
              <ImageUpload
                onImageUpload={handleImageUpload}
                onImageRemove={handleImageRemove}
                folder="products"
                label="Imagens Adicionais"
              />

              {/* Preview das Imagens */}
              {productImages.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Imagens Adicionais ({productImages.length})
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {productImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image.url}
                          alt={`Imagem ${index + 1}`}
                          className="w-full h-16 sm:h-20 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = productImages.filter(
                              (_, i) => i !== index
                            );
                            setProductImages(newImages);
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl sm:text-2xl">
            {product ? "Editar Produto" : "Adicionar Novo Produto"}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            {product
              ? "Atualize as informações do produto"
              : "Preencha as informações para adicionar um novo produto ao seu catálogo"}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      currentStep === step.id
                        ? "bg-primary text-primary-foreground"
                        : isStepComplete(step.id)
                        ? "bg-green-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isStepComplete(step.id) ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <step.icon className="h-4 w-4" />
                    )}
                  </div>
                  <span className="text-xs mt-1 text-center max-w-16">
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`w-8 h-0.5 mx-2 ${
                      currentStep > step.id ? "bg-green-500" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {renderStepContent()}

          {/* Botões de Navegação */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevStep}
              disabled={currentStep === 1 || isSubmitting}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>

            <div className="flex gap-2">
              {currentStep < STEPS.length ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={!canGoToNextStep() || isSubmitting}
                  className="flex items-center gap-2"
                >
                  Próximo
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="flex items-center gap-2"
                >
                  {isSubmitting
                    ? "Salvando..."
                    : product
                    ? "Atualizar"
                    : "Criar"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
