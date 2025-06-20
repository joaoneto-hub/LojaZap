import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ImageUpload } from "../components/ui/image-upload";
import { Store, Save, CheckCircle } from "lucide-react";
import { DashboardLayout } from "../components/layout";
import { useStoreSettings } from "../hooks/useStoreSettings";
import {
  storeSettingsSchema,
  type StoreSettingsFormData,
} from "../lib/validations";
import type { StoreImage } from "../types/store";
import toast from "react-hot-toast";

const workingDaysOptions = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
];

export const StoreSettings: React.FC = () => {
  const { storeSettings, loading, error, saveStoreSettings, clearError } =
    useStoreSettings();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [logo, setLogo] = useState<StoreImage | null>(null);
  const [bannerImage, setBannerImage] = useState<StoreImage | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StoreSettingsFormData>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: {
      name: "",
      description: "",
      phone: "",
      email: "",
      address: "",
      openingTime: "09:00",
      closingTime: "18:00",
      workingDays: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
    },
  });

  const watchedWorkingDays = watch("workingDays");

  // Carregar dados existentes quando disponíveis
  useEffect(() => {
    if (storeSettings) {
      console.log("Carregando configurações existentes:", storeSettings);
      setValue("name", storeSettings.name);
      setValue("description", storeSettings.description);
      setValue("phone", storeSettings.phone);
      setValue("email", storeSettings.email);
      setValue("address", storeSettings.address);
      setValue("openingTime", storeSettings.openingTime);
      setValue("closingTime", storeSettings.closingTime);
      setValue("workingDays", storeSettings.workingDays);
      setLogo(storeSettings.logo || null);
      setBannerImage(storeSettings.bannerImage || null);
    }
  }, [storeSettings, setValue]);

  const handleWorkingDayChange = (day: string, checked: boolean) => {
    const currentDays = watchedWorkingDays || [];
    if (checked) {
      setValue("workingDays", [...currentDays, day]);
    } else {
      setValue(
        "workingDays",
        currentDays.filter((d) => d !== day)
      );
    }
  };

  // Handle image uploads
  const handleLogoUpload = (result: { url: string; path: string }) => {
    console.log("✅ Logo enviada:", result);
    const newLogo: StoreImage = {
      url: result.url,
      path: result.path,
      alt: "Logo da loja",
    };
    setLogo(newLogo);
  };

  const handleBannerUpload = (result: { url: string; path: string }) => {
    console.log("✅ Banner enviado:", result);
    const newBanner: StoreImage = {
      url: result.url,
      path: result.path,
      alt: "Banner da loja",
    };
    setBannerImage(newBanner);
  };

  const handleLogoRemove = () => {
    console.log("🗑️ Removendo logo");
    setLogo(null);
  };

  const handleBannerRemove = () => {
    console.log("🗑️ Removendo banner");
    setBannerImage(null);
  };

  const handleFormSubmit = async (data: StoreSettingsFormData) => {
    try {
      console.log("=== SUBMIT DO FORMULÁRIO ===");
      console.log("Dados do formulário:", data);
      console.log("Logo:", logo);
      console.log("Banner:", bannerImage);
      console.log("Erros do formulário:", errors);

      setIsSubmitting(true);
      setShowSuccess(false);

      // Adicionar imagens aos dados
      const formDataWithImages = {
        ...data,
        logo: logo || undefined,
        bannerImage: bannerImage || undefined,
      };

      console.log("Dados completos para salvar:", formDataWithImages);
      console.log("Chamando saveStoreSettings...");
      await saveStoreSettings(formDataWithImages);
      console.log("saveStoreSettings concluído com sucesso");

      setShowSuccess(true);
      toast.success("Configurações salvas com sucesso!", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#f0fdf4",
          color: "#166534",
          border: "1px solid #bbf7d0",
        },
      });
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      console.error("Detalhes do erro:", error);
      toast.error("Erro ao salvar configurações. Por favor, tente novamente.", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#fef2f2",
          color: "#dc2626",
          border: "1px solid #fecaca",
        },
      });
      // Não fechar o formulário em caso de erro
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        title="Configurar Loja"
        description="Configure as informações básicas da sua loja e personalização."
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando configurações...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Configurar Loja"
      description="Configure as informações básicas da sua loja e personalização."
    >
      {/* Success Message */}
      {showSuccess && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-green-800 text-sm">
              Configurações salvas com sucesso!
            </p>
          </div>
        </div>
      )}

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

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Informações da Loja
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Loja *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Digite o nome da sua loja"
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Input
                  id="description"
                  {...register("description")}
                  placeholder="Descreva sua loja"
                  className={errors.description ? "border-destructive" : ""}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="(11) 99999-9999"
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="contato@loja.com"
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço *</Label>
                <Input
                  id="address"
                  {...register("address")}
                  placeholder="Rua das Flores, 123 - Centro"
                  className={errors.address ? "border-destructive" : ""}
                />
                {errors.address && (
                  <p className="text-sm text-destructive">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Configurações de Horário */}
          <Card>
            <CardHeader>
              <CardTitle>Horário de Funcionamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="openingTime">Horário de Abertura *</Label>
                  <Input
                    id="openingTime"
                    type="time"
                    {...register("openingTime")}
                    className={errors.openingTime ? "border-destructive" : ""}
                  />
                  {errors.openingTime && (
                    <p className="text-sm text-destructive">
                      {errors.openingTime.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="closingTime">Horário de Fechamento *</Label>
                  <Input
                    id="closingTime"
                    type="time"
                    {...register("closingTime")}
                    className={errors.closingTime ? "border-destructive" : ""}
                  />
                  {errors.closingTime && (
                    <p className="text-sm text-destructive">
                      {errors.closingTime.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Dias de Funcionamento *</Label>
                <div className="space-y-2">
                  {workingDaysOptions.map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={day}
                        checked={watchedWorkingDays?.includes(day) || false}
                        onChange={(e) =>
                          handleWorkingDayChange(day, e.target.checked)
                        }
                        className="rounded"
                      />
                      <Label htmlFor={day} className="text-sm">
                        {day}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.workingDays && (
                  <p className="text-sm text-destructive">
                    {errors.workingDays.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload de Imagens */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Imagens da Loja</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo */}
              <ImageUpload
                onImageUpload={handleLogoUpload}
                onImageRemove={handleLogoRemove}
                currentImageUrl={logo?.url}
                folder="store"
                label="Logo da Loja"
              />

              {/* Banner */}
              <ImageUpload
                onImageUpload={handleBannerUpload}
                onImageRemove={handleBannerRemove}
                currentImageUrl={bannerImage?.url}
                folder="store"
                label="Banner da Loja"
              />
            </div>
          </CardContent>
        </Card>

        {/* Botão Salvar */}
        <div className="flex justify-end mt-6">
          <Button
            type="submit"
            className="flex items-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Salvar Configurações
              </>
            )}
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
};
