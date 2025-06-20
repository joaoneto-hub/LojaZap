# Configuração do Firebase para LojaZap

Este documento contém as instruções para configurar o Firebase no projeto LojaZap.

## 🔧 Troubleshooting - Problemas Comuns

### Problema: "Não está salvando"

Se as configurações não estão sendo salvas, verifique:

1. **Variáveis de Ambiente**: Certifique-se de que o arquivo `.env.local` existe na raiz do projeto com todas as configurações do Firebase
2. **Regras do Firestore**: Use as regras permissivas para desenvolvimento (veja seção 2.2)
3. **Console do Navegador**: Verifique se há erros no console do navegador
4. **Componente Debug**: Use o componente de debug na página StoreSettings para testar a conexão

### Criar arquivo .env.local

Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

Substitua os valores pelas suas configurações reais do Firebase Console.

## 1. Configuração do Firebase

### 1.1 Criar Projeto no Firebase Console

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Clique em "Criar projeto"
3. Digite o nome do projeto (ex: "lojazap-app")
4. Siga os passos de configuração

### 1.2 Configurar Authentication

1. No console do Firebase, vá para "Authentication"
2. Clique em "Get started"
3. Vá para a aba "Sign-in method"
4. Habilite "Email/Password"
5. Clique em "Save"

### 1.3 Configurar Firestore Database

1. No console do Firebase, vá para "Firestore Database"
2. Clique em "Create database"
3. Escolha "Start in test mode" (para desenvolvimento)
4. Escolha a localização mais próxima (ex: us-central1)

### 1.4 Obter Configuração do Projeto

1. No console do Firebase, clique na engrenagem (⚙️) ao lado de "Project Overview"
2. Selecione "Project settings"
3. Role para baixo até "Your apps"
4. Clique no ícone da web (</>) para adicionar um app web
5. Digite um nome para o app (ex: "lojazap-web")
6. Copie a configuração do Firebase

### 1.5 Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## 2. Regras de Segurança do Firestore

### 2.1 Regras para Produtos

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regras para produtos
    match /products/{productId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }

    // Regras para categorias
    match /categories/{categoryId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 2.2 Explicação das Regras

- **Produtos**: Cada usuário só pode acessar, criar, editar e deletar seus próprios produtos
- **Categorias**: Cada usuário só pode acessar, criar, editar e deletar suas próprias categorias
- **Autenticação**: Todas as operações requerem autenticação

## 3. Gerenciamento de Token e Sessão

### 3.1 Configurações de Token

- **Renovação automática**: 5 minutos antes da expiração
- **Timeout de sessão**: 1 hora de inatividade
- **Detecção de atividade**: Mouse, teclado, scroll e touch

### 3.2 Armazenamento

- Tokens são armazenados no localStorage
- Renovação automática em background
- Logout automático na expiração

## 4. Sistema de Categorias Dinâmicas

### 4.1 Configuração por Tipo de Negócio

O sistema agora permite que o usuário escolha o tipo do seu negócio e receba categorias específicas automaticamente. Os tipos disponíveis são:

#### **Moda e Vestuário**

- Roupas, Calçados, Acessórios, Bolsas, Promoções, Novidades, Outros

#### **Beleza e Cosméticos**

- Maquiagem, Skincare, Perfumes, Cabelo, Corpo, Promoções, Outros

#### **Eletrônicos**

- Smartphones, Computadores, Acessórios, Gaming, Áudio, Promoções, Outros

#### **Casa e Decoração**

- Decoração, Cozinha, Jardinagem, Organização, Iluminação, Promoções, Outros

#### **Alimentos e Bebidas**

- Alimentos, Bebidas, Doces, Orgânicos, Promoções, Novidades, Outros

#### **Esportes e Fitness**

- Roupas Esportivas, Calçados Esportivos, Equipamentos, Suplementos, Fitness, Promoções, Outros

#### **Livros e Educação**

- Livros, Educação, Revistas, Papelaria, Promoções, Novidades, Outros

#### **Negócio Genérico**

- Produtos Principais, Acessórios, Promoções, Novidades, Mais Vendidos, Categoria 1-4, Outros

### 4.2 Categorias Padrão (Legado)

Para usuários existentes, as categorias padrão genéricas incluem:

- **Produtos Principais**: Produtos principais do seu negócio
- **Acessórios**: Acessórios e complementos
- **Promoções**: Produtos em promoção
- **Novidades**: Produtos novos e lançamentos
- **Mais Vendidos**: Produtos mais populares
- **Categoria 1**: Primeira categoria personalizada
- **Categoria 2**: Segunda categoria personalizada
- **Categoria 3**: Terceira categoria personalizada
- **Categoria 4**: Quarta categoria personalizada
- **Outros**: Outros produtos

### 4.3 Funcionalidades

- **Configuração por tipo de negócio**: Usuários podem escolher seu tipo de negócio e receber categorias específicas
- **Reconfiguração**: Possibilidade de reconfigurar categorias baseado no tipo de negócio
- **Categorias personalizadas**: Usuários podem criar suas próprias categorias
- **Cores personalizadas**: Cada categoria pode ter uma cor única
- **Descrições**: Categorias podem ter descrições opcionais
- **Proteção**: Categorias padrão não podem ser editadas ou deletadas
- **Filtros**: Categorias são usadas para filtrar produtos

### 4.4 Estrutura de Dados

```typescript
interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  isDefault: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 5. Operações CRUD de Produtos

### 5.1 Criar Produto

```typescript
const newProduct = {
  name: "Nome do Produto",
  description: "Descrição detalhada",
  price: 99.99,
  stock: 10,
  category: "Nome da Categoria",
  color: "Azul", // opcional
  size: "M", // opcional
  brand: "Marca", // opcional
  status: "active",
};

await addProduct(newProduct);
```

### 5.2 Atualizar Produto

```typescript
const updatedProduct = {
  id: "product_id",
  name: "Novo Nome",
  price: 89.99,
  stock: 5,
};

await updateProduct(updatedProduct);
```

### 5.3 Deletar Produto

```typescript
await deleteProduct("product_id");
```

### 5.4 Listar Produtos

```typescript
const { products, loading, error } = useProducts();

// Produtos são carregados automaticamente
// Filtros por categoria são aplicados automaticamente
```

## 6. Campos Dinâmicos por Tipo de Negócio

### 6.1 Detecção Automática

O sistema detecta automaticamente o tipo de negócio baseado nas categorias do usuário e adapta os campos do formulário de produtos:

```typescript
const businessType = useMemo(() => {
  if (categories.length === 0) return "generic";

  const categoryNames = categories.map((c) => c.name.toLowerCase());

  if (
    categoryNames.some((name) =>
      ["roupas", "calçados", "acessórios"].includes(name)
    )
  ) {
    return "fashion";
  }
  if (
    categoryNames.some((name) =>
      ["maquiagem", "skincare", "perfumes"].includes(name)
    )
  ) {
    return "beauty";
  }
  // ... outras detecções
}, [categories]);
```

### 6.2 Configurações de Campos por Tipo

#### **Moda e Vestuário (fashion)**

- **Cor**: Select com cores de roupas (Preto, Branco, Azul, etc.)
- **Tamanho**: Select com tamanhos (PP, P, M, G, GG, XG, Único)
- **Marca**: Input para marca da roupa

#### **Beleza e Cosméticos (beauty)**

- **Cor/Tom**: Select com tons de maquiagem (Transparente, Bege, Rosa, etc.)
- **Volume/Tamanho**: Select com volumes (30ml, 50ml, 100ml, 200ml, 500ml, 1L, Outro)
- **Marca**: Input para marca de cosméticos

#### **Eletrônicos (electronics)**

- **Cor**: Select com cores de dispositivos (Preto, Branco, Azul, etc.)
- **Capacidade/Modelo**: Input para especificações técnicas (128GB, iPhone 14, etc.)
- **Marca**: Input para marca de eletrônicos (Apple, Samsung, etc.)

#### **Casa e Decoração (home)**

- **Cor**: Select com cores de decoração
- **Dimensões**: Input para tamanhos de produtos (30x40cm, Grande, etc.)
- **Marca**: Input para marca de produtos para casa

#### **Alimentos e Bebidas (food)**

- **Sabor**: Input para sabores (Chocolate, Baunilha, etc.)
- **Peso/Volume**: Input para quantidades (500g, 1L, etc.)
- **Marca**: Input para marca de alimentos

#### **Esportes e Fitness (sports)**

- **Cor**: Select com cores esportivas
- **Tamanho**: Select com tamanhos esportivos (PP, P, M, G, GG, XG, Único)
- **Marca**: Input para marca esportiva

#### **Livros e Educação (books)**

- **Edição**: Input para informações de edição (1ª Edição, Capa Dura, etc.)
- **Formato**: Select com formatos (Pocket, Brochura, Capa Dura, Digital, Outro)
- **Editora/Autor**: Input para editora ou autor

#### **Negócio Genérico (generic)**

- **Característica 1**: Input genérico (Cor, Material, etc.)
- **Característica 2**: Input genérico (Tamanho, Peso, etc.)
- **Marca/Fabricante**: Input para marca

### 6.3 Renderização Dinâmica

Os campos são renderizados dinamicamente baseado na configuração:

```typescript
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
```

### 6.4 Benefícios

- **Experiência Personalizada**: Campos relevantes para cada tipo de negócio
- **Flexibilidade**: Suporte a diferentes tipos de produtos
- **Usabilidade**: Interface adaptada ao contexto do usuário
- **Escalabilidade**: Fácil adição de novos tipos de negócio
- **Consistência**: Campos padronizados por categoria

## 7. Onboarding e Configuração Inicial

### 7.1 Fluxo de Onboarding

1. **Primeiro Acesso**: Modal de onboarding com 3 etapas explicando as funcionalidades
2. **Seleção de Tipo de Negócio**: Modal para escolher o tipo de negócio
3. **Configuração de Categorias**: Categorias criadas automaticamente baseado no tipo
4. **Pronto para Usar**: Sistema configurado e funcional

### 7.2 Componentes de Onboarding

- **OnboardingModal**: Guia inicial para novos usuários
- **BusinessTypeModal**: Seleção do tipo de negócio
- **CategoryModal**: Gerenciamento de categorias

### 7.3 Uso Automático

O sistema automaticamente mostra os modais necessários quando:

- Usuário não tem categorias configuradas
- Primeiro acesso ao dashboard
- Tentativa de adicionar produtos sem categorias

## 8. Estrutura de Dados Completa

### 8.1 Coleções do Firestore

```
/users/{userId}
  - email: string
  - displayName: string
  - createdAt: timestamp

/products/{productId}
  - name: string
  - description: string
  - price: number
  - stock: number
  - category: string
  - color: string (opcional)
  - size: string (opcional)
  - brand: string (opcional)
  - status: string
  - userId: string
  - createdAt: timestamp
  - updatedAt: timestamp

/categories/{categoryId}
  - name: string
  - color: string
  - userId: string
  - createdAt: timestamp

/storeSettings/{settingId}
  - businessType: string
  - storeName: string
  - description: string
  - userId: string
  - createdAt: timestamp
  - updatedAt: timestamp
```

## 9. Funcionalidades Implementadas

✅ **Autenticação Firebase** - Login/registro com email/senha  
✅ **Gerenciamento de Sessão** - Token refresh e timeout automático  
✅ **Produtos Dinâmicos** - CRUD com campos adaptáveis por tipo de negócio  
✅ **Categorias Inteligentes** - Configuração automática por tipo de negócio  
✅ **Onboarding Guiado** - Fluxo completo para novos usuários  
✅ **Campos Dinâmicos** - Formulários adaptáveis automaticamente  
✅ **Segurança** - Regras do Firestore configuradas  
✅ **Validação** - Schemas Zod para todos os formulários  
✅ **UI Responsiva** - Componentes shadcn/ui integrados

O sistema agora está completamente funcional com campos dinâmicos que se adaptam automaticamente ao tipo de negócio do usuário!
