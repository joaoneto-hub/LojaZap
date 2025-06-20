import { z } from "zod";

// Schema para validação do formulário de login
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Digite um email válido"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Schema para validação do formulário de registro
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nome é obrigatório")
      .min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z
      .string()
      .min(1, "Email é obrigatório")
      .email("Digite um email válido"),
    password: z
      .string()
      .min(1, "Senha é obrigatória")
      .min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

// Schema para validação do reset de senha
export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Digite um email válido"),
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// Schema para validação de categorias personalizadas
export const categorySchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(1, "Nome da categoria é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(50, "Nome deve ter no máximo 50 caracteres"),
  description: z.string().optional(),
  color: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

// Schema para validação de produtos
export const productSchema = z.object({
  name: z
    .string()
    .min(1, "Nome do produto é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .min(10, "Descrição deve ter pelo menos 10 caracteres"),
  price: z
    .number()
    .positive("Preço deve ser positivo")
    .min(0.01, "Preço deve ser maior que zero"),
  stock: z
    .number()
    .int("Estoque deve ser um número inteiro")
    .min(0, "Estoque não pode ser negativo"),
  categories: z.array(z.string()).min(1, "Selecione pelo menos uma categoria"),
  status: z.enum(["active", "inactive", "out_of_stock"], {
    errorMap: () => ({
      message: "Status deve ser ativo, inativo ou sem estoque",
    }),
  }),
  color: z.string().optional(),
  size: z.string().optional(),
  brand: z.string().optional(),
  mainImage: z
    .object({
      url: z.string(),
      path: z.string(),
      alt: z.string().optional(),
    })
    .optional(),
  images: z
    .array(
      z.object({
        url: z.string(),
        path: z.string(),
        alt: z.string().optional(),
      })
    )
    .optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

// Schema para validação das configurações da loja
export const storeSettingsSchema = z.object({
  name: z
    .string()
    .min(1, "Nome da loja é obrigatório")
    .min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .min(5, "Descrição deve ter pelo menos 5 caracteres"),
  phone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .min(10, "Telefone deve ter pelo menos 10 caracteres"),
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Digite um email válido"),
  address: z
    .string()
    .min(1, "Endereço é obrigatório")
    .min(10, "Endereço deve ter pelo menos 10 caracteres"),
  openingTime: z.string().min(1, "Horário de abertura é obrigatório"),
  closingTime: z.string().min(1, "Horário de fechamento é obrigatório"),
  workingDays: z
    .array(z.string())
    .min(1, "Selecione pelo menos um dia de funcionamento"),
  logo: z
    .object({
      url: z.string(),
      path: z.string(),
      alt: z.string().optional(),
    })
    .optional(),
  bannerImage: z
    .object({
      url: z.string(),
      path: z.string(),
      alt: z.string().optional(),
    })
    .optional(),
});

export type StoreSettingsFormData = z.infer<typeof storeSettingsSchema>;

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  role: z.enum(["admin", "user"]),
});

export type User = z.infer<typeof userSchema>;
