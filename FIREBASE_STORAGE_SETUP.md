# 🔧 Configuração do Firebase Storage

## Problema Identificado

O erro `net::ERR_FAILED` e `CORS policy` indica que o Firebase Storage não está configurado corretamente ou as regras de segurança estão bloqueando o acesso.

## Passos para Configurar

### 1. Habilitar Firebase Storage

1. Acesse o [Firebase Console](https://console.firebase.google.com)
2. Selecione seu projeto `lojazap-b749e`
3. No menu lateral, clique em **Storage**
4. Se não estiver configurado, clique em **"Get Started"**
5. Escolha **"Start in test mode"** para desenvolvimento
6. Selecione a região mais próxima (ex: `us-central1`)
7. Clique em **"Done"**

### 2. Configurar Regras de Segurança

1. No Firebase Storage, vá para a aba **Rules**
2. Substitua as regras existentes por:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Regras para imagens de produtos
    match /products/{userId}/{allPaths=**} {
      allow read: if true; // Permitir leitura pública para produtos
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Regras para imagens da loja
    match /store/{userId}/{allPaths=**} {
      allow read: if true; // Permitir leitura pública para configurações da loja
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Regras para testes
    match /test/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Regra geral para desenvolvimento (remover em produção)
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Clique em **"Publish"**

### 3. Verificar Configuração do Projeto

1. No Firebase Console, vá para **Project Settings** (ícone de engrenagem)
2. Na aba **General**, verifique se o **Storage bucket** está listado
3. Deve aparecer algo como: `lojazap-b749e.appspot.com`

### 4. Verificar Autenticação

1. Certifique-se de que o usuário está autenticado
2. Verifique se o Firebase Auth está configurado corretamente
3. Teste o login/logout

### 5. Testar Upload

1. Use o componente de debug na página de Produtos
2. Clique em **"Testar Firebase Storage"**
3. Verifique os logs no console

## Troubleshooting

### Erro: "Storage bucket not found"

- Verifique se o Storage está habilitado no Firebase Console
- Confirme que o `VITE_FIREBASE_STORAGE_BUCKET` está correto

### Erro: "Permission denied"

- Verifique se as regras do Storage estão publicadas
- Confirme que o usuário está autenticado
- Teste com regras mais permissivas temporariamente

### Erro: "CORS policy"

- Verifique se o Storage está habilitado
- Confirme que as regras permitem acesso
- Teste com regras de teste temporárias

### Erro: "Network error"

- Verifique a conexão com a internet
- Confirme que o Firebase está acessível
- Teste em modo incógnito

## Regras Temporárias para Teste

Se ainda houver problemas, use estas regras temporárias (APENAS PARA DESENVOLVIMENTO):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ IMPORTANTE:** Nunca use essas regras em produção!

## Logs Úteis

Para debug, verifique:

1. **Console do navegador:** Erros de CORS e rede
2. **Firebase Console > Storage:** Arquivos enviados
3. **Firebase Console > Authentication:** Usuários autenticados
4. **Componente de debug:** Logs detalhados do processo

## Próximos Passos

Após configurar:

1. Teste o upload de imagens pequenas
2. Teste o upload de imagens maiores
3. Verifique se as imagens aparecem na loja pública
4. Configure regras mais restritivas para produção

---

**Nota:** Se o problema persistir, pode ser necessário:

- Verificar se o projeto Firebase tem faturamento habilitado
- Confirmar se não há limites de quota atingidos
- Verificar se o domínio está autorizado no Firebase
