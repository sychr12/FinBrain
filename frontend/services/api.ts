const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export interface Perfil {
  id: number;
  nome: string;
  email: string;
  fotoPerfil?: string | null;
  fotoValidada?: boolean;
  reconhecimentoFacial?: string | null;
}

export interface PerfilUpdate {
  nome: string;
  email: string;
  fotoPerfil?: string | null;
  fotoValidada?: boolean;
  reconhecimentoFacial?: string | null;
}

// Erro especial para token inválido/expirado
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function setToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
}

function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}

function isJwtError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("jwt") ||
    lower.includes("token") ||
    lower.includes("signature") ||
    lower.includes("expired") ||
    lower.includes("expirad")
  );
}

async function parseResponse(response: Response) {
  const text = await response.text();
  let payload: unknown = text;

  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = text;
  }

  if (!response.ok) {
    let message: string;

    if (payload && typeof payload === "object") {
      const values = Object.values(payload as Record<string, unknown>)
        .filter(Boolean)
        .join(", ");
      message = values || `Erro ${response.status}`;
    } else {
      message = String(payload || `Erro ${response.status}`);
    }

    if ((response.status === 401 || response.status === 403) && isJwtError(message)) {
      removeToken();
      throw new AuthError(message);
    }

    throw new Error(message);
  }

  return payload;
}

async function authFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  if (!token) throw new AuthError("Usuario nao autenticado");

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  return parseResponse(response) as Promise<T>;
}

export async function register(data: {
  nome: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return parseResponse(response) as Promise<string>;
}

export async function login(data: { email: string; senha: string }) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = (await parseResponse(response)) as { token?: string };
  if (result.token) setToken(result.token);
  return result;
}

export async function confirmarEmail(email: string, codigo: string) {
  const codigoFormatado = codigo.startsWith("#") ? codigo : `#${codigo}`;
  const response = await fetch(
    `${API_URL}/api/auth/confirmar?email=${encodeURIComponent(email)}&codigo=${encodeURIComponent(codigoFormatado)}`,
    { method: "POST", headers: { "Content-Type": "application/json" } }
  );

  return parseResponse(response) as Promise<string>;
}

export async function getPerfil() {
  return authFetch<Perfil>("/api/user/perfil");
}

export async function atualizarPerfil(data: PerfilUpdate) {
  return authFetch<Perfil>("/api/user/perfil", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function getCartoes() {
  return authFetch("/api/cartoes");
}

export async function criarCartao(data: {
  nome: string;
  numeroMascarado: string;
  limiteTotal: number;
  diaFechamento: number;
  diaVencimento: number;
}) {
  return authFetch("/api/cartoes", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getTransacoes() {
  return authFetch("/api/transacoes");
}

export async function criarTransacao(data: {
  descricao: string;
  valor: number;
  tipo: "RECEITA" | "DESPESA";
  categoria?: string;
  data: string;
  cartaoId?: number;
}) {
  return authFetch("/api/transacoes", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export interface Resumo {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  totalTransacoes: number;
  totalCartoes: number;
}

export async function getDashboardResumo() {
  return authFetch<Resumo>("/api/dashboard/resumo");
}

export async function testConnection() {
  try {
    const response = await fetch(`${API_URL}/api/auth/health`);
    return response.ok;
  } catch {
    return false;
  }
}

export function logout() {
  removeToken();
}