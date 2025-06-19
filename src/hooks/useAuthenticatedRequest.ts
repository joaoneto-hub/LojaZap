import { useAuth } from "../contexts/AuthContext";
import { auth } from "../lib/firebase";

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

export const useAuthenticatedRequest = () => {
  const { refreshToken } = useAuth();

  const makeRequest = async (url: string, options: RequestOptions = {}) => {
    const { skipAuth = false, ...requestOptions } = options;

    // Se não precisar de autenticação, fazer a requisição normalmente
    if (skipAuth) {
      return fetch(url, requestOptions);
    }

    // Verificar se há um usuário autenticado
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("Usuário não autenticado");
    }

    try {
      // Obter token atual
      let token = await currentUser.getIdToken();

      // Verificar se o token está próximo de expirar
      const tokenResult = await currentUser.getIdTokenResult();
      const expiryTime = tokenResult.expirationTime
        ? new Date(tokenResult.expirationTime).getTime()
        : 0;
      const now = Date.now();
      const timeUntilExpiry = expiryTime - now;

      // Se o token expira em menos de 5 minutos, renovar
      if (timeUntilExpiry < 5 * 60 * 1000) {
        await refreshToken();
        token = await currentUser.getIdToken();
      }

      // Fazer a requisição com o token
      const response = await fetch(url, {
        ...requestOptions,
        headers: {
          ...requestOptions.headers,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Se receber 401 (Unauthorized), tentar renovar o token e refazer a requisição
      if (response.status === 401) {
        await refreshToken();
        const newToken = await currentUser.getIdToken();

        const retryResponse = await fetch(url, {
          ...requestOptions,
          headers: {
            ...requestOptions.headers,
            Authorization: `Bearer ${newToken}`,
            "Content-Type": "application/json",
          },
        });

        return retryResponse;
      }

      return response;
    } catch (error) {
      console.error("Erro na requisição autenticada:", error);
      throw error;
    }
  };

  const get = (url: string, options?: RequestOptions) => {
    return makeRequest(url, { ...options, method: "GET" });
  };

  const post = (
    url: string,
    data?: Record<string, unknown>,
    options?: RequestOptions
  ) => {
    return makeRequest(url, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  };

  const put = (
    url: string,
    data?: Record<string, unknown>,
    options?: RequestOptions
  ) => {
    return makeRequest(url, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  };

  const del = (url: string, options?: RequestOptions) => {
    return makeRequest(url, { ...options, method: "DELETE" });
  };

  return {
    makeRequest,
    get,
    post,
    put,
    delete: del,
  };
};
