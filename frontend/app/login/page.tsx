"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { login } from "@/services/api"; // 🔥 DESCOMENTADO

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    // Verificar se já está logado
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (!form.email || !form.password) {
      setErro("Preencha todos os campos");
      return;
    }

    try {
      setLoading(true);
      // 🔥 DESCOMENTADO - Chamada real da API
      const data = await login(form);
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
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

        .login-root {
          display: flex;
          height: 100vh;
          font-family: 'DM Sans', sans-serif;
          background: #FFFFFF;
          overflow: hidden;
          position: relative;
        }

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
        .login-left {
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

        /* círculo externo */
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

        /* círculo interno */
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
        .login-right {
          flex: 1;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
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

        .forgot-row {
          text-align: right;
          margin-bottom: 1.5rem;
        }
        .forgot-row a {
          font-size: 12px;
          color: #6C47E8;
          cursor: pointer;
          text-decoration: none;
          transition: color 0.3s;
        }
        .forgot-row a:hover { 
          color: #9B7EFF;
          text-decoration: underline;
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

        .divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 20px 0;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #E0E0E0;
        }
        .divider span {
          font-size: 12px;
          color: #999;
        }

        .btn-google {
          width: 100%;
          height: 48px;
          background: #F5F5F5;
          border: 1px solid #E0E0E0;
          border-radius: 12px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #333;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s ease;
        }
        .btn-google:hover { 
          background: #FFFFFF;
          transform: translateY(-2px);
          border-color: #6C47E8;
          box-shadow: 0 8px 25px rgba(108, 71, 232, 0.1);
        }

        .signup-row {
          text-align: center;
          font-size: 13px;
          color: #666;
          margin-top: 20px;
        }
        .signup-row a {
          color: #6C47E8;
          cursor: pointer;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s;
        }
        .signup-row a:hover { 
          color: #9B7EFF;
          text-decoration: underline;
        }

        .theme-btn {
          position: absolute;
          top: 24px;
          right: 24px;
          background: #F5F5F5;
          border: 1px solid #E0E0E0;
          border-radius: 12px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #999;
          transition: all 0.3s;
        }
        .theme-btn:hover {
          background: #6C47E8;
          transform: rotate(45deg);
          color: white;
        }

        @media (max-width: 768px) {
          .login-left { display: none; }
          .login-right { background: #FFFFFF; }
          .form-box { padding: 1.5rem; }
        }
      `}</style>

      <div className="login-root">

        {/* ── LEFT PANEL ── */}
        <div className="login-left animate-left">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />

          {/* Logo */}
          <a className="logo">
            <div className="logo-icon">
              <Image
                src="/logosg/sacodecompra.png"
                alt="FinBrain logo"
                width={30}
                height={30}
                style={{ objectFit: "contain" }}
              />
            </div>
            <span className="logo-name">FinBrain</span>
          </a>

          {/* Ilustração */}
          <div className="illus-ring">
            <div className="illus-inner">
              <Image
                src="/logo/FinBrainlogo.png"
                alt="FinBrain hero"
                width={320}
                height={320}
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>

          {/* Tagline */}
          <div className="tagline animate-up delay-4">
            <h2>Sua vida financeira mais inteligente com IA</h2>
            <p>Gerencie promoções e economias em um só lugar</p>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="login-right animate-right">
          <button className="theme-btn" type="button">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          </button>

          <div className="form-box animate-up delay-1">
            <div className="form-title animate-up delay-2">Bem-vindo!</div>
            <div className="form-sub animate-up delay-3">Faça login para continuar</div>

            {erro && <div className="erro">{erro}</div>}

            <form onSubmit={handleSubmit}>
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

              <div className="field animate-up delay-4">
                <label htmlFor="password">Senha</label>
                <div className="field-wrap">
                  <input
                    id="password"
                    type={showPass ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    style={{ paddingRight: "40px" }}
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPass(!showPass)}
                  >
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
              </div>

              <div className="forgot-row animate-up delay-5">
                <a>Esqueceu a senha?</a>
              </div>

              <button type="submit" className="btn-primary animate-up delay-5" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </button>

              <div className="divider animate-up delay-5"><span>ou</span></div>

              <button type="button" className="btn-google animate-up delay-5">
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908C16.658 14.233 17.64 11.925 17.64 9.2z" fill="#4285F4" />
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
                  <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                </svg>
                Entrar com Google
              </button>
            </form>

            <div className="signup-row">
              Não tem conta?{" "}
              <a onClick={() => router.push("/register")}>Criar conta</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}