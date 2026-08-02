import axios from 'axios';
import api from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthenticatedUser {
  id?: string;
  userId?: string;
  organizationId?: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface LoginResult {
  token: string;
  user: AuthenticatedUser | null;
}

interface LoginResponseData {
  token?: string;
  accessToken?: string;
  jwtToken?: string;

  user?: AuthenticatedUser;

  userId?: string;
  organizationId?: string;
  name?: string;
  email?: string;
  role?: string;
}

interface ApiEnvelope<T> {
  success?: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordRecoveryResult {
  message: string;
}

interface EmptyResponse {
  success?: boolean;
  message?: string;
  data?: unknown;
  errors?: string[];
}


const TOKEN_KEY = 'cuidarplus_token';
const USER_KEY = 'cuidarplus_user';

function extractResponseData(
  responseBody: ApiEnvelope<LoginResponseData> | LoginResponseData,
): LoginResponseData {
  if (
    'data' in responseBody &&
    responseBody.data &&
    typeof responseBody.data === 'object'
  ) {
    return responseBody.data;
  }

  return responseBody as LoginResponseData;
}

function extractToken(data: LoginResponseData): string {
  const token =
    data.token ??
    data.accessToken ??
    data.jwtToken;

  if (!token || typeof token !== 'string') {
    throw new Error(
      'A API confirmou o login, mas não retornou um token de acesso reconhecido.',
    );
  }

  return token;
}

function extractUser(data: LoginResponseData): AuthenticatedUser | null {
  if (data.user) {
    return data.user;
  }

  const hasUserData =
    data.userId ||
    data.organizationId ||
    data.name ||
    data.email ||
    data.role;

  if (!hasUserData) {
    return null;
  }

  return {
    id: data.userId,
    userId: data.userId,
    organizationId: data.organizationId,
    name: data.name,
    email: data.email,
    role: data.role,
  };
}

function saveSession(result: LoginResult): void {
  localStorage.setItem(TOKEN_KEY, result.token);

  if (result.user) {
    localStorage.setItem(
      USER_KEY,
      JSON.stringify(result.user),
    );
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

function getApiErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error
      ? error.message
      : 'Não foi possível realizar o login.';
  }

  if (!error.response) {
    return 'Não foi possível conectar à API. Verifique se o backend está rodando.';
  }

  const responseData = error.response.data as
    | ApiEnvelope<unknown>
    | undefined;

  if (
    responseData?.message &&
    typeof responseData.message === 'string'
  ) {
    return responseData.message;
  }

  if (
    Array.isArray(responseData?.errors) &&
    responseData.errors.length > 0
  ) {
    return responseData.errors.join(' ');
  }

  switch (error.response.status) {
    case 400:
      return 'Os dados informados são inválidos.';

    case 401:
      return 'E-mail ou senha inválidos.';

    case 403:
      return 'Seu usuário não possui permissão para acessar o sistema.';

    case 500:
      return 'Ocorreu um erro interno na API.';

    default:
      return `Não foi possível realizar o login. Código ${error.response.status}.`;
  }
}

export const authService = {
  async login(request: LoginRequest): Promise<LoginResult> {
    try {
      const response = await api.post<
        ApiEnvelope<LoginResponseData> | LoginResponseData
      >('/api/auth/login', request);

      /*
       * Deixe este console.log apenas durante o diagnóstico.
       * Depois que o login funcionar, poderá removê-lo.
       */
      
      /*console.log('Resposta do login:', response.data);*/

      const responseData = extractResponseData(response.data);
      const token = extractToken(responseData);
      const user = extractUser(responseData);

      const result: LoginResult = {
        token,
        user,
      };

      saveSession(result);

      return result;
    } catch (error) {
      console.error('Erro no processo de login:', error);

      throw new Error(getApiErrorMessage(error));
    }
  },

    async forgotPassword(
    request: ForgotPasswordRequest,
  ): Promise<string> {
    try {
      const response = await api.post<EmptyResponse>(
        '/api/auth/forgot-password',
        request,
      );

      return (
        response.data.message ??
        'Se o e-mail estiver cadastrado, você receberá as instruções para redefinir a senha.'
      );
    } catch (error) {
      console.error(
        'Erro ao solicitar recuperação de senha:',
        error,
      );

      throw new Error(getApiErrorMessage(error));
    }
  },

  async resetPassword(
    request: ResetPasswordRequest,
  ): Promise<string> {
    try {
      const response = await api.post<EmptyResponse>(
        '/api/auth/reset-password',
        request,
      );

      return (
        response.data.message ??
        'Senha redefinida com sucesso.'
      );
    } catch (error) {
      console.error(
        'Erro ao redefinir senha:',
        error,
      );

      throw new Error(getApiErrorMessage(error));
    }
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser(): AuthenticatedUser | null {
    const storedUser = localStorage.getItem(USER_KEY);

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as AuthenticatedUser;
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  },

  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  },
};

export default authService;