const API_URL = "http://localhost:8080";

// ========================
// 🔐 TOKEN
// ========================
function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
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

// Helper autenticado
async function authFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  if (!token) throw new Error("Usuário não autenticado");

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      ...options.headers,
    },
  });

  const text = await response.text();
  if (!response.ok) throw new Error(text || `Erro ${response.status}`);

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// ========================
// 🔐 REGISTER
// ========================
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

  const text = await response.text();
  if (!response.ok) throw new Error(text || `Erro ${response.status}`);
  return text;
}

// ========================
// 🔐 LOGIN
// ========================
export async function login(data: {
  email: string;
  password: string;
}) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const text = await response.text();
  if (!response.ok) throw new Error(text || `Erro ${response.status}`);

  const result = JSON.parse(text);
  if (result.token) setToken(result.token);
  return result;
}

// ========================
// 🔐 CONFIRMAR EMAIL
// ========================
export async function confirmarEmail(email: string, codigo: string) {
  const codigoFormatado = codigo.startsWith("#") ? codigo : `#${codigo}`;

  const response = await fetch(
    `${API_URL}/api/auth/confirmar?email=${encodeURIComponent(email)}&codigo=${encodeURIComponent(codigoFormatado)}`,
    { method: "POST", headers: { "Content-Type": "application/json" } }
  );

  const text = await response.text();
  if (!response.ok) throw new Error(text || `Erro ${response.status}`);
  return text;
}

// ========================
// 👤 PERFIL
// ========================
export async function getPerfil() {
  return authFetch("/api/user/perfil");
}

// ========================
// 💳 CARTÕES
// ========================
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

// ========================
// 💰 TRANSAÇÕES
// ========================
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

// ========================
// 📊 DASHBOARD
// ========================
export async function getDashboardResumo() {
  return authFetch("/api/dashboard/resumo");
}

// ========================
// 🧪 TESTE DE CONEXÃO
// ========================
export async function testConnection() {
  try {
    const response = await fetch(`${API_URL}/api/auth/health`);
    return response.ok;
  } catch {
    return false;
  }
}

// ========================
// 🚪 LOGOUT
// ========================
export function logout() {
  removeToken();
}