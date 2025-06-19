# Configuração do Firebase para LojaZap

Este documento explica como configurar o Firebase para o projeto LojaZap, incluindo autenticação, Firestore e regras de segurança.

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

### 1.1 Criar Projeto Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Digite o nome do projeto (ex: "lojazap-app")
4. Siga os passos de configuração

### 1.2 Configurar Autenticação

1. No console do Firebase, vá para "Authentication"
2. Clique em "Get started"
3. Vá para a aba "Sign-in method"
4. Habilite "Email/Password"
5. Configure as opções conforme necessário

### 1.3 Configurar Firestore Database

1. No console do Firebase, vá para "Firestore Database"
2. Clique em "Create database"
3. Escolha "Start in test mode" (para desenvolvimento)
4. Selecione a localização mais próxima (ex: us-central1)

### 1.4 Obter Configuração

1. No console do Firebase, clique na engrenagem (⚙️) ao lado de "Project Overview"
2. Selecione "Project settings"
3. Role para baixo até "Your apps"
4. Clique no ícone da web (</>)
5. Registre o app com um nome (ex: "lojazap-web")
6. Copie a configuração

### 1.5 Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## 2. Regras de Segurança do Firestore

### 2.1 Regras para Autenticação

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Verificar se o usuário está autenticado
    function isAuthenticated() {
      return request.auth != null;
    }

    // Verificar se o documento pertence ao usuário
    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    // Regras para produtos
    match /products/{productId} {
      // Leitura pública apenas para produtos ativos
      allow read: if resource.data.status == "active";
      // Escrita apenas para o proprietário
      allow write: if isAuthenticated() && isOwner(resource.data.userId);
      allow create: if isAuthenticated() && isOwner(request.resource.data.userId);
    }

    // Regras para configurações da loja
    match /storeSettings/{settingsId} {
      // Leitura pública das configurações
      allow read: if true;
      // Escrita apenas para o proprietário
      allow write: if isAuthenticated() && isOwner(resource.data.userId);
      allow create: if isAuthenticated() && isOwner(request.resource.data.userId);
    }

    // Regras para usuários (se necessário)
    match /users/{userId} {
      allow read, write: if isAuthenticated() && isOwner(userId);
    }

    // Regras para documentos de teste
    match /test/{testId} {
      allow read, write: if isAuthenticated() && isOwner(resource.data.userId);
      allow create: if isAuthenticated() && isOwner(request.resource.data.userId);
    }
  }
}
```

### 2.2 Regras Simplificadas para Desenvolvimento

Se estiver tendo problemas, use estas regras mais permissivas para desenvolvimento:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regras permissivas para desenvolvimento
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**⚠️ IMPORTANTE:** Use as regras permissivas apenas em desenvolvimento. Para produção, sempre use as regras restritivas.

## 3. Sistema de Produtos

### 3.1 Estrutura dos Dados

Cada produto no Firestore tem a seguinte estrutura:

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  color?: string;
  size?: string;
  brand?: string;
  images?: string[];
  status: "active" | "inactive" | "out_of_stock";
  createdAt: Date;
  updatedAt: Date;
  userId: string; // ID do usuário proprietário
}
```

### 3.2 Operações CRUD

#### Criar Produto

```typescript
import { useProducts } from "../hooks/useProducts";

const { createProduct } = useProducts();

const newProduct = await createProduct({
  name: "Vestido Floral",
  description: "Vestido elegante com estampa floral",
  price: 89.9,
  stock: 15,
  category: "Vestidos",
  color: "Azul",
  size: "M",
  brand: "Fashion Brand",
  status: "active",
});
```

#### Atualizar Produto

```typescript
const { updateProduct } = useProducts();

await updateProduct({
  id: "product_id",
  name: "Vestido Floral Atualizado",
  price: 99.9,
  stock: 10,
});
```

#### Excluir Produto

```typescript
const { deleteProduct } = useProducts();

await deleteProduct("product_id");
```

#### Buscar Produtos

```typescript
const { products, filterProducts } = useProducts();

// Filtrar produtos
const filteredProducts = filterProducts({
  category: "Vestidos",
  status: "active",
  minPrice: 50,
  maxPrice: 100,
  inStock: true,
  search: "floral",
});
```

### 3.3 Funcionalidades Avançadas

#### Estatísticas de Produtos

```typescript
const {
  getProductCountByStatus,
  getTotalStockValue,
  getLowStockProducts,
  getActiveProducts,
} = useProducts();

// Contar produtos por status
const counts = getProductCountByStatus();
console.log(counts); // { active: 10, inactive: 2, out_of_stock: 1, total: 13 }

// Valor total do estoque
const totalValue = getTotalStockValue();

// Produtos com estoque baixo
const lowStock = getLowStockProducts(5);
```

#### Atualizações Específicas

```typescript
const { updateStock, updateStatus } = useProducts();

// Atualizar apenas o estoque
await updateStock("product_id", 25);

// Atualizar apenas o status
await updateStatus("product_id", "out_of_stock");
```

## 4. Autenticação e Sessão

### 4.1 Login/Logout

```typescript
import { useAuth } from "../contexts/AuthContext";

const { login, logout, user, isAuthenticated } = useAuth();

// Login
await login("usuario@email.com", "senha123");

// Logout
await logout();
```

### 4.2 Gerenciamento de Token

```typescript
const { tokenExpiryTime, refreshToken } = useAuth();

// Verificar expiração do token
if (tokenExpiryTime) {
  const timeUntilExpiry = tokenExpiryTime - Date.now();
  console.log(`Token expira em ${timeUntilExpiry}ms`);
}

// Renovar token manualmente
await refreshToken();
```

### 4.3 Requisições Autenticadas

```typescript
import { useAuthenticatedRequest } from "../hooks/useAuthenticatedRequest";

const { get, post, put, delete: del } = useAuthenticatedRequest();

// Requisição autenticada automática
const response = await get("/api/produtos");
const newProduct = await post("/api/produtos", { name: "Produto", price: 100 });
```

## 5. Segurança e Boas Práticas

### 5.1 Isolamento de Dados

- Cada usuário só acessa seus próprios produtos
- O campo `userId` garante isolamento
- Regras do Firestore validam acesso

### 5.2 Validação de Dados

```typescript
import { productSchema } from "../lib/validations";

// Validar dados antes de salvar
const validatedData = productSchema.parse(productData);
```

### 5.3 Tratamento de Erros

```typescript
try {
  await createProduct(productData);
} catch (error) {
  if (error.message.includes("não autorizado")) {
    // Produto não pertence ao usuário
  } else if (error.message.includes("não encontrado")) {
    // Produto não existe
  }
}
```

## 6. Deploy e Produção

### 6.1 Configurar Regras de Produção

```javascript
// Regras mais restritivas para produção
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read, write: if isAuthenticated() &&
        request.auth.uid == resource.data.userId &&
        request.auth.token.email_verified == true;
    }
  }
}
```

### 6.2 Variáveis de Ambiente de Produção

```env
VITE_FIREBASE_API_KEY=prod_api_key
VITE_FIREBASE_AUTH_DOMAIN=prod_project.firebaseapp.com
# ... outras configurações de produção
```

## 7. Monitoramento e Logs

### 7.1 Firebase Analytics

- Configure Firebase Analytics para monitorar uso
- Acompanhe eventos de criação/edição de produtos
- Monitore erros de autenticação

### 7.2 Logs de Segurança

- Monitore tentativas de acesso não autorizado
- Configure alertas para atividades suspeitas
- Revise logs regularmente

## 8. Backup e Recuperação

### 8.1 Backup Automático

- Configure backup automático do Firestore
- Teste restauração de dados regularmente
- Mantenha cópias de segurança

### 8.2 Migração de Dados

```typescript
// Script para migrar dados entre ambientes
const migrateProducts = async (sourceDb, targetDb) => {
  const products = await sourceDb.collection("products").get();

  for (const doc of products.docs) {
    await targetDb.collection("products").add(doc.data());
  }
};
```

## 9. Troubleshooting

### 9.1 Problemas Comuns

**Erro: "Produto não autorizado"**

- Verifique se o usuário está logado
- Confirme se o produto pertence ao usuário
- Verifique as regras do Firestore

**Erro: "Token expirado"**

- O sistema renova automaticamente
- Se persistir, faça logout e login novamente

**Erro: "Usuário não autenticado"**

- Verifique se o Firebase está configurado corretamente
- Confirme se as variáveis de ambiente estão definidas

### 9.2 Debug

```typescript
// Habilitar logs detalhados
import { connectFirestoreEmulator } from "firebase/firestore";

if (import.meta.env.DEV) {
  connectFirestoreEmulator(db, "localhost", 8080);
}
```

## 10. Recursos Adicionais

- [Documentação Firebase](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [React Firebase Hooks](https://github.com/CSFrequency/react-firebase-hooks)
