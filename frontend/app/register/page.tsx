"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { register } from "@/services/api";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const [animate, setAnimate] = useState(false);

  // ── password strength ──
  const strength = useMemo(() => {
    const p = form.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  }, [form.password]);

  const strengthLabel = ["", "Fraca", "Fraca", "Média", "Boa", "Forte"][strength];
  const strengthColor = ["", "#E24B4A", "#EF9F27", "#EF9F27", "#63C132", "#1D9E75"][strength];

  function validar() {
    if (!form.nome || !form.email || !form.password || !form.confirmPassword)
      return "Preencha todos os campos";
    if (!form.email.includes("@")) return "Email inválido";
    if (form.password.length < 6) return "Senha deve ter pelo menos 6 caracteres";
    if (form.password !== form.confirmPassword) return "Senhas não coincidem";
    return null;
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setErro("");
    const erroValidacao = validar();
    if (erroValidacao) { setErro(erroValidacao); return; }

    try {
      setLoading(true);
      await register({
        nome: form.nome,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      router.push(`/confirmar?email=${form.email}`);
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* Animações Globais */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }

        @keyframes rotateBlob {
          0% {
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(180deg) scale(1.2);
          }
          100% {
            transform: rotate(360deg) scale(1);
          }
        }

        @keyframes shine {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .reg-root {
          display: flex;
          height: 100vh;
          font-family: 'DM Sans', sans-serif;
          background: #FFFFFF;
          overflow: hidden;
        }

        /* Classes de animação */
        .animate-left {
          animation: slideInLeft 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }
        
        .animate-right {
          animation: slideInRight 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }
        
        .animate-up {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
        .delay-5 { animation-delay: 0.5s; }

        /* ── LEFT PANEL ── */
        .reg-left {
          position: relative;
          width: 50%;
          background: linear-gradient(135deg, #6C47E8 0%, #9B7EFF 50%, #6C47E8 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(80px);
        }
        .blob-1 {
          width: 500px;
          height: 500px;
          top: -150px;
          right: -150px;
          background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
          animation: rotateBlob 25s ease-in-out infinite;
        }
        .blob-2 {
          width: 350px;
          height: 350px;
          bottom: -80px;
          left: -80px;
          background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);
          animation: rotateBlob 18s ease-in-out infinite reverse;
        }
        .blob-3 {
          width: 300px;
          height: 300px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
          animation: pulseGlow 5s ease-in-out infinite;
        }

        .illus-ring {
          width: 380px;
          height: 380px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          border: 2px solid rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulseGlow 3s ease-in-out infinite;
        }
        .illus-inner {
          width: 280px;
          height: 280px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transition: transform 0.3s;
        }
        .illus-inner:hover {
          transform: scale(1.05);
        }

        /* logo top-left */
        .logo {
          position: absolute;
          top: 28px;
          left: 28px;
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.3s;
        }
        .logo:hover {
          transform: scale(1.05);
        }
        .logo-icon {
          width: 44px;
          height: 44px;
          background: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transition: all 0.3s;
        }
        .logo-icon:hover {
          transform: rotate(10deg);
        }
        .logo-name {
          font-family: 'Sora', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.5px;
        }

        /* tagline */
        .tagline {
          position: absolute;
          bottom: 40px;
          text-align: center;
          width: 100%;
          padding: 0 2rem;
        }
        .tagline h2 {
          font-family: 'Sora', sans-serif;
          font-size: 18px;
          font-weight: 600;
          color: white;
          margin-bottom: 6px;
        }
        .tagline p {
          font-size: 13px;
          color: rgba(255,255,255,0.8);
          line-height: 1.6;
        }

        /* ── RIGHT PANEL ── */
        .reg-right {
          flex: 1;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          overflow-y: auto;
        }

        .form-box {
          width: 100%;
          max-width: 400px;
          background: #FFFFFF;
          padding: 2rem;
          border-radius: 24px;
          transition: all 0.3s;
        }

        .form-title {
          font-family: 'Sora', sans-serif;
          font-size: 32px;
          font-weight: 700;
          color: #1a1a2e;
          margin-bottom: 8px;
        }

        .form-sub {
          font-size: 14px;
          color: #666;
          margin-bottom: 2rem;
        }

        .field {
          margin-bottom: 18px;
        }

        .field label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        .field-wrap {
          position: relative;
        }

        .field input {
          width: 100%;
          height: 48px;
          background: #F5F5F5;
          border: 1px solid #E0E0E0;
          border-radius: 12px;
          padding: 0 16px;
          font-size: 14px;
          color: #333;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: all 0.3s ease;
        }

        .field input::placeholder {
          color: #999;
        }

        .field input:focus {
          border-color: #6C47E8;
          background: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(108, 71, 232, 0.1);
          transform: translateY(-2px);
        }

        .eye-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #999;
          padding: 0;
          display: flex;
          align-items: center;
          transition: color 0.3s;
        }
        .eye-btn:hover {
          color: #6C47E8;
        }

        /* strength bar */
        .strength-bar-wrap {
          display: flex;
          gap: 6px;
          margin-top: 8px;
        }
        .strength-seg {
          flex: 1;
          height: 4px;
          border-radius: 4px;
          background: #E0E0E0;
          transition: all 0.3s ease;
        }

        .strength-label {
          font-size: 11px;
          text-align: right;
          margin-top: 5px;
          transition: color 0.3s;
          font-weight: 500;
        }

        .erro {
          background: #FEE2E2;
          border: 1px solid #FCA5A5;
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 13px;
          color: #DC2626;
          margin-bottom: 1rem;
          animation: fadeInUp 0.3s ease-out;
        }

        .btn-primary {
          width: 100%;
          height: 48px;
          background: linear-gradient(135deg, #6C47E8, #9B7EFF);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          font-family: 'Sora', sans-serif;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.02em;
          position: relative;
          overflow: hidden;
          margin-top: 8px;
        }
        .btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(108, 71, 232, 0.3);
        }
        .btn-primary:hover::before {
          left: 100%;
        }
        .btn-primary:active {
          transform: scale(0.98);
        }
        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .login-row {
          text-align: center;
          font-size: 13px;
          color: #666;
          margin-top: 20px;
        }
        .login-row a {
          color: #6C47E8;
          cursor: pointer;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s;
        }
        .login-row a:hover {
          color: #9B7EFF;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .reg-left {
            display: none;
          }
          .reg-right {
            background: #FFFFFF;
          }
          .form-box {
            padding: 1.5rem;
          }
        }
      `}</style>

      <div className="reg-root">

        {/* ── LEFT PANEL ── */}
        <div className="reg-left animate-left">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />

          <a className="logo">
            <div className="logo-icon">
              <Image src="/logosg/sacodecompra.png" alt="FinBrain" width={58} height={28} style={{ objectFit: "contain" }} />
            </div>
            <span className="logo-name">FinBrain</span>
          </a>

          <div className="illus-ring">
            <div className="illus-inner">
              <Image
                src="/perfilregistro/perfilrg.png"
                alt="Criar conta"
                width={220}
                height={220}
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>

          <div className="tagline animate-up delay-4">
            <h2>Crie sua conta grátis</h2>
            <p>Comece a economizar com inteligência artificial</p>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="reg-right animate-right">
          <div className="form-box animate-up delay-1">
            <div className="form-title animate-up delay-2">Criar conta</div>
            <div className="form-sub animate-up delay-3">Preencha os dados abaixo</div>

            {erro && <div className="erro">{erro}</div>}

            <form onSubmit={handleSubmit}>

              {/* Nome */}
              <div className="field animate-up delay-3">
                <label htmlFor="nome">Nome completo</label>
                <div className="field-wrap">
                  <input
                    id="nome"
                    type="text"
                    placeholder="Seu nome completo"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="field animate-up delay-3">
                <label htmlFor="email">E-mail</label>
                <div className="field-wrap">
                  <input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Senha + strength */}
              <div className="field animate-up delay-4">
                <label htmlFor="password">
                  Senha
                  <span style={{ color: "#999", fontWeight: 400, textTransform: "none", fontSize: "11px", marginLeft: "6px" }}>
                    (mínimo 6 caracteres)
                  </span>
                </label>
                <div className="field-wrap">
                  <input
                    id="password"
                    type={showPass ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    style={{ paddingRight: "40px" }}
                  />
                  <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}>
                    {showPass ? (
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M17.94 10A10 10 0 0 1 3 3M1 1l18 18M6.53 6.53A5 5 0 0 0 10 15a5 5 0 0 0 3.47-1.47" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M1 10s3-7 9-7 9 7 9 7-3 7-9 7-9-7-9-7z" />
                        <circle cx="10" cy="10" r="3" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* strength bar */}
                {form.password && (
                  <>
                    <div className="strength-bar-wrap">
                      {[1,2,3,4,5].map((i) => (
                        <div
                          key={i}
                          className="strength-seg"
                          style={{ background: i <= strength ? strengthColor : undefined }}
                        />
                      ))}
                    </div>
                    <div className="strength-label" style={{ color: strengthColor }}>
                      {strength === 0 ? "" : `Força: ${strengthLabel}`}
                    </div>
                  </>
                )}
              </div>

              {/* Confirmar senha */}
              <div className="field animate-up delay-5">
                <label htmlFor="confirmPassword">Confirmar senha</label>
                <div className="field-wrap">
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repita a senha"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary animate-up delay-5" disabled={loading}>
                {loading ? "Criando conta..." : "Criar conta"}
              </button>
            </form>

            <div className="login-row">
              Já tem conta?{" "}
              <a onClick={() => router.push("/login")}>Fazer login</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}