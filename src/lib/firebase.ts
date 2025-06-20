import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuração do Firebase
// Substitua essas configurações pelas suas próprias do console do Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Log da configuração para debug
console.log("🔥 Firebase Config:", {
  apiKey: firebaseConfig.apiKey ? "✅ Configurado" : "❌ Não configurado",
  authDomain: firebaseConfig.authDomain
    ? "✅ Configurado"
    : "❌ Não configurado",
  projectId: firebaseConfig.projectId ? "✅ Configurado" : "❌ Não configurado",
  storageBucket: firebaseConfig.storageBucket
    ? "✅ Configurado"
    : "❌ Não configurado",
  messagingSenderId: firebaseConfig.messagingSenderId
    ? "✅ Configurado"
    : "❌ Não configurado",
  appId: firebaseConfig.appId ? "✅ Configurado" : "❌ Não configurado",
});

// Validar se todas as variáveis de ambiente estão configuradas
const requiredEnvVars = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
];

const missingVars = requiredEnvVars.filter(
  (varName) => !import.meta.env[varName]
);

if (missingVars.length > 0) {
  console.error(
    "❌ Variáveis de ambiente do Firebase não configuradas:",
    missingVars
  );
  console.error(
    "📝 Crie um arquivo .env.local na raiz do projeto com as configurações do Firebase"
  );
  console.error(
    "📖 Consulte o arquivo FIREBASE_SETUP.md para instruções detalhadas"
  );
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar serviços
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Log da inicialização
console.log("🔥 Firebase inicializado:", {
  auth: auth ? "✅ OK" : "❌ Erro",
  db: db ? "✅ OK" : "❌ Erro",
  storage: storage ? "✅ OK" : "❌ Erro",
  storageBucket: storage.app.options.storageBucket,
});

export default app;
