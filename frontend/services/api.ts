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

// ========================
// 🔐 REGISTER
// ========================
export async function register(data: {
  nome: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  try {
    console.log("🚀 Enviando requisição para:", `${API_URL}/api/auth/register`);
    console.log("📦 Dados:", { ...data, password: "***", confirmPassword: "***" });
    
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log("📡 Status:", response.status);
    console.log("📡 Status Text:", response.statusText);

    // Tenta ler a resposta como texto
    const responseText = await response.text();
    console.log("📥 Resposta bruta:", responseText);

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${responseText || "Sem mensagem"}`);
    }

    // Tenta fazer parse como JSON, se falhar retorna texto
    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      result = responseText;
    }
    
    console.log("✅ Sucesso:", result);
    return result;
    
  } catch (error) {
    console.error("❌ Exception no registro:", error);
    throw error;
  }
}

// ========================
// 🔐 LOGIN
// ========================
export async function login(data: {
  email: string;
  password: string;
}) {
  try {
    console.log("🚀 Enviando login para:", `${API_URL}/api/auth/login`);
    console.log("📦 Email:", data.email);
    
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log("📡 Status:", response.status);

    const responseText = await response.text();
    console.log("📥 Resposta:", responseText);

    if (!response.ok) {
      throw new Error(responseText || `Erro ${response.status}`);
    }

    const result = JSON.parse(responseText);
    
    if (result.token) {
      setToken(result.token);
      console.log("✅ Token salvo com sucesso!");
      console.log("🔐 Token:", result.token.substring(0, 50) + "...");
    }

    return result;
    
  } catch (error) {
    console.error("❌ Login error:", error);
    throw error;
  }
}

// ========================
// 🔐 CONFIRMAR EMAIL (melhorado)
// ========================
export async function confirmarEmail(email: string, codigo: string) {
  try {
    // 🔥 Garante que o código tenha a hashtag
    const codigoFormatado = codigo.startsWith('#') ? codigo : `#${codigo}`;
    
    console.log("🚀 Confirmando email:", email);
    console.log("🔑 Código original:", codigo);
    console.log("🔑 Código formatado:", codigoFormatado);
    
    const response = await fetch(`${API_URL}/api/auth/confirmar?email=${encodeURIComponent(email)}&codigo=${encodeURIComponent(codigoFormatado)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseText = await response.text();
    console.log("📥 Resposta:", response.status, responseText);

    if (!response.ok) {
      throw new Error(responseText || `Erro ${response.status}`);
    }

    return responseText;
    
  } catch (error) {
    console.error("❌ Erro na confirmação:", error);
    throw error;
  }
}

// ========================
// 👤 PERFIL
// ========================
export async function getPerfil() {
  const token = getToken();

  if (!token) {
    throw new Error("Usuário não autenticado");
  }

  try {
    console.log("🚀 Buscando perfil...");
    
    const response = await fetch(`${API_URL}/api/user/perfil`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Erro ${response.status}`);
    }

    const result = await response.json();
    console.log("✅ Perfil:", result);
    return result;
    
  } catch (error) {
    console.error("❌ Erro no perfil:", error);
    throw error;
  }
}

// ========================
// 🧪 TESTE DE CONEXÃO
// ========================
export async function testConnection() {
  try {
    console.log("🏥 Testando conexão com backend...");
    const response = await fetch(`${API_URL}/api/auth/health`);
    const text = await response.text();
    console.log("✅ Health check:", response.status, text);
    return response.ok;
  } catch (error) {
    console.error("❌ Connection failed:", error);
    return false;
  }
}

// ========================
// 🚪 LOGOUT
// ========================
export function logout() {
  removeToken();
  console.log("🔓 Usuário deslogado");
}

function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}