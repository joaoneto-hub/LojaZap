# 🚀 Guia de Deployment na Vercel

## Problemas Comuns e Soluções

### 1. **Variáveis de Ambiente**

Certifique-se de que todas as variáveis do Firebase estão configuradas na Vercel:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 2. **Regras de Segurança do Firestore**

Verifique se as regras permitem leitura pública:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura pública de produtos ativos
    match /products/{productId} {
      allow read: if resource.data.status == "active";
    }

    // Permitir leitura pública das configurações da loja
    match /storeSettings/{userId} {
      allow read: if true;
    }

    // Regras para usuários autenticados
    match /{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### 3. **Regras de Storage do Firebase**

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 4. **Configuração da Vercel**

O arquivo `vercel.json` já está configurado para SPA routing.

### 5. **Debug na Vercel**

Para debugar problemas:

1. **Verificar logs**: Acesse o dashboard da Vercel > Deployments > View Function Logs
2. **Console do navegador**: Abra as ferramentas de desenvolvedor na URL da Vercel
3. **Network tab**: Verifique se as requisições para o Firebase estão funcionando

### 6. **Problemas Específicos**

#### **Loja não carrega**

- Verifique se o userId na URL está correto
- Confirme se existem configurações de loja para esse usuário
- Verifique se há produtos ativos

#### **Imagens não aparecem**

- Confirme se as regras do Storage permitem leitura pública
- Verifique se os URLs das imagens estão corretos

#### **Erro de CORS**

- Verifique se o domínio da Vercel está autorizado no Firebase Console
- Adicione `*.vercel.app` e seu domínio customizado nas configurações do Firebase

### 7. **Teste Local vs Vercel**

Para testar se o problema é específico da Vercel:

```bash
# Build local
npm run build

# Preview local
npm run preview
```

### 8. **Configurações Adicionais**

#### **Firebase Console**

1. Vá para Authentication > Settings > Authorized domains
2. Adicione: `your-app.vercel.app`
3. Se usar domínio customizado, adicione também

#### **Vercel Dashboard**

1. Vá para Settings > Environment Variables
2. Adicione todas as variáveis do Firebase
3. Redeploy após adicionar variáveis

### 9. **Comandos Úteis**

```bash
# Verificar build local
npm run build

# Testar preview
npm run preview

# Verificar tipos
npx tsc --noEmit

# Lint
npm run lint
```

### 10. **Contato**

Se os problemas persistirem:

1. Verifique os logs da Vercel
2. Teste localmente com `npm run preview`
3. Compare com o ambiente de desenvolvimento
