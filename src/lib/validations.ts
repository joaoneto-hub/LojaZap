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

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  role: z.enum(["admin", "user"]),
});

export type User = z.infer<typeof userSchema>;

export const productSchema = z.object({
  name: z.string().min(1, "Nome do produto é obrigatório"),
  description: z.string().optional(),
  price: z.number().positive("Preço deve ser positivo"),
  stock: z.number().int().min(0, "Estoque não pode ser negativo"),
  category: z.string().min(1, "Categoria é obrigatória"),
});

export type Product = z.infer<typeof productSchema>;
