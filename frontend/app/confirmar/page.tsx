"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API_URL = "http://localhost:8080/api/auth";

export default function ConfirmarPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailFromUrl);
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // OTP digits (6 chars - sem a hashtag)
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 🔥 Formata o código com a hashtag automaticamente
  useEffect(() => {
    const codigoSemHash = digits.join("");
    if (codigoSemHash.length === 6) {
      setCodigo(`#${codigoSemHash}`);
    } else {
      setCodigo("");
    }
  }, [digits]);

  // Contagem regressiva
  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  function handleDigit(i: number, val: string) {
    // Aceita apenas letras e números
    const v = val.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(-1);
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if (v && i < 5) inputRefs.current[i + 1]?.focus();
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && i > 0) inputRefs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < 5) inputRefs.current[i + 1]?.focus();
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    let text = e.clipboardData.getData("text");
    // Remove a hashtag se existir e pega só os 6 caracteres
    text = text.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 6);
    const next = [...digits];
    [...text].forEach((c, i) => { next[i] = c; });
    setDigits(next);
    inputRefs.current[Math.min(text.length, 5)]?.focus();
  }

  async function handleResend() {
    if (countdown > 0) return;
    if (!email) {
      setErro("Digite seu email primeiro");
      return;
    }
    
    setCountdown(60);
    setErro("");
    
    try {
      const res = await fetch(`${API_URL}/reenviar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      
      const data = await res.text();
      if (!res.ok) throw new Error(data);
      
      alert("Código reenviado! Verifique seu email.");
      
    } catch (err: any) {
      setErro(err.message);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      if (!email) {
        throw new Error("Preencha o email");
      }
      
      if (!codigo || codigo.length < 7) {
        throw new Error("Digite o código de 6 dígitos");
      }

      console.log("📤 Enviando requisição para:", `${API_URL}/confirmar`);
      console.log("📧 Email:", email);
      console.log("🔑 Código enviado:", codigo);

      const res = await fetch(
        `${API_URL}/confirmar?email=${encodeURIComponent(email)}&codigo=${encodeURIComponent(codigo)}`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      );

      const data = await res.text();
      console.log("📥 Resposta:", res.status, data);

      if (!res.ok) throw new Error(data);

      setSucesso(data || "Conta confirmada com sucesso!");
      
      setTimeout(() => {
        router.push("/login");
      }, 2500);
      
    } catch (err: any) {
      console.error("❌ Erro:", err);
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  const isComplete = digits.every(d => d !== "");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes success-pop {
          0%   { transform: scale(0.6); opacity: 0; }
          60%  { transform: scale(1.1); }
          100% { transform: scale(1);   opacity: 1; }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%,60% { transform: translateX(-6px); }
          40%,80% { transform: translateX(6px); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes progress {
          from { width: 100%; }
          to   { width: 0%; }
        }
        @keyframes rotateBlob {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.2); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1); opacity: 0.6; }
          50%  { transform: scale(1.08); opacity: 0.3; }
          100% { transform: scale(1); opacity: 0.6; }
        }

        .confirm-root {
          display: flex;
          height: 100vh;
          font-family: 'DM Sans', sans-serif;
          background: #FFFFFF;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }

        .bg-blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(80px);
        }
        .bg-blob-1 {
          width: 600px; height: 600px;
          top: -200px; left: -150px;
          background: radial-gradient(circle, rgba(108,71,232,0.15) 0%, transparent 70%);
          animation: rotateBlob 25s ease-in-out infinite;
        }
        .bg-blob-2 {
          width: 500px; height: 500px;
          bottom: -150px; right: -120px;
          background: radial-gradient(circle, rgba(155,126,255,0.12) 0%, transparent 70%);
          animation: rotateBlob 18s ease-in-out infinite reverse;
        }

        .card {
          position: relative;
          width: 100%;
          max-width: 460px;
          background: #FFFFFF;
          border: 1px solid #E0E0E0;
          border-radius: 32px;
          padding: 2.5rem 2rem;
          z-index: 1;
          opacity: 0;
          animation: fadeUp 0.5s ease forwards;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
        }
        .card.shake { animation: shake 0.4s ease; }

        .icon-wrap {
          position: relative;
          width: 80px; height: 80px;
          margin: 0 auto 1.5rem;
          display: flex; align-items: center; justify-content: center;
        }
        .icon-ring {
          position: absolute; inset: 0;
          border-radius: 50%;
          border: 2px solid rgba(108,71,232,0.2);
          animation: pulse-ring 2.5s ease-in-out infinite;
        }
        .icon-ring-2 {
          position: absolute; inset: -8px;
          border-radius: 50%;
          border: 1px solid rgba(108,71,232,0.1);
          animation: pulse-ring 2.5s ease-in-out infinite 0.4s;
        }
        .icon-circle {
          width: 70px; height: 70px;
          border-radius: 50%;
          background: rgba(108,71,232,0.08);
          border: 2px solid rgba(108,71,232,0.3);
          display: flex; align-items: center; justify-content: center;
        }
        .success-icon {
          animation: success-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }

        .card-title {
          font-family: 'Sora', sans-serif;
          font-size: 24px; font-weight: 700; color: #1a1a2e;
          text-align: center; margin-bottom: 8px;
        }
        .card-sub {
          font-size: 13px; color: #666;
          text-align: center; line-height: 1.6; margin-bottom: 1.75rem;
        }
        .card-sub span { color: #6C47E8; font-weight: 600; }

        .field { margin-bottom: 1.5rem; }
        .field label {
          display: block; font-size: 11px; font-weight: 600;
          color: #333; margin-bottom: 6px;
          letter-spacing: 0.06em; text-transform: uppercase;
        }
        .field input {
          width: 100%; height: 48px;
          background: #F5F5F5;
          border: 1px solid #E0E0E0;
          border-radius: 12px; padding: 0 16px;
          font-size: 14px; color: #333;
          font-family: 'DM Sans', sans-serif;
          outline: none; transition: all 0.3s ease;
        }
        .field input::placeholder { color: #999; }
        .field input:focus {
          border-color: #6C47E8;
          background: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(108,71,232,0.1);
          transform: translateY(-2px);
        }
        .field input:disabled { opacity: 0.5; cursor: not-allowed; }

        .otp-label {
          font-size: 11px; font-weight: 600;
          color: #333;
          letter-spacing: 0.06em; text-transform: uppercase;
          margin-bottom: 10px;
        }
        .otp-row {
          display: flex; gap: 12px; justify-content: center;
          margin-bottom: 12px;
        }
        .otp-cell {
          width: 56px; height: 60px;
          background: #F5F5F5;
          border: 1px solid #E0E0E0;
          border-radius: 16px;
          font-size: 24px; font-weight: 700;
          color: #1a1a2e; text-align: center;
          font-family: 'Sora', sans-serif;
          outline: none;
          transition: all 0.3s ease;
          caret-color: #6C47E8;
        }
        .otp-cell:focus {
          border-color: #6C47E8;
          background: #FFFFFF;
          transform: scale(1.05);
          box-shadow: 0 0 0 3px rgba(108,71,232,0.1);
        }
        .otp-cell.filled {
          border-color: #6C47E8;
          color: #6C47E8;
          background: rgba(108,71,232,0.05);
        }
        .otp-cell:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

        .resend-row {
          text-align: center; font-size: 12px;
          color: #999; margin-bottom: 1.5rem;
        }
        .resend-btn {
          background: none; border: none; cursor: pointer;
          color: #6C47E8; font-size: 13px; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          padding: 0;
        }
        .resend-btn:hover:not(:disabled) { 
          color: #9B7EFF;
          text-decoration: underline; 
        }
        .resend-btn:disabled { color: #CCC; cursor: not-allowed; }

        .alert {
          border-radius: 12px; padding: 14px 16px;
          font-size: 13px; margin-bottom: 20px;
          animation: slide-down 0.3s ease;
        }
        .alert-err {
          background: #FEE2E2;
          border: 1px solid #FCA5A5;
          color: #DC2626;
        }
        .alert-ok {
          background: #D1FAE5;
          border: 1px solid #6EE7B7;
          color: #065F46;
        }
        .alert-ok p:last-child { font-size: 11px; color: #065F46; opacity: 0.8; margin-top: 4px; }

        .progress-bar-track {
          height: 2px; background: rgba(6, 95, 70, 0.2);
          border-radius: 2px; margin-top: 10px; overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%; background: #065F46;
          border-radius: 2px;
          animation: progress 2.5s linear forwards;
        }

        .btn-primary {
          width: 100%; height: 48px;
          background: linear-gradient(135deg, #6C47E8, #9B7EFF);
          color: #fff; border: none;
          border-radius: 16px; font-size: 15px; font-weight: 600;
          font-family: 'Sora', sans-serif; cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.02em;
          display: flex; align-items: center; justify-content: center; gap: 8px;
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
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(108,71,232,0.3);
        }
        .btn-primary:hover:not(:disabled)::before { left: 100%; }
        .btn-primary:active:not(:disabled) { transform: scale(0.98); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        .back-link {
          text-align: center; font-size: 13px;
          color: #666; margin-top: 20px;
        }
        .back-link a {
          color: #6C47E8; cursor: pointer;
          text-decoration: none; font-weight: 600;
          transition: color 0.3s;
        }
        .back-link a:hover { 
          color: #9B7EFF;
          text-decoration: underline; 
        }

        .logo-badge {
          position: absolute; top: -16px; left: 50%;
          transform: translateX(-50%);
          background: #FFFFFF;
          border: 1px solid #E0E0E0;
          border-radius: 40px;
          padding: 6px 16px;
          display: flex; align-items: center; gap: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        .logo-badge-name {
          font-family: 'Sora', sans-serif;
          font-size: 14px; font-weight: 700; color: #1a1a2e;
        }
      `}</style>

      <div className="confirm-root">
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-2" />

        <div className={`card${erro ? " shake" : ""}`}>

          <div className="logo-badge">
            <img src="/logosg/sacodecompra.png" alt="FinBrain Logo" width="22" height="22" style={{borderRadius: '6px'}} />
            <span className="logo-badge-name">FinBrain</span>
          </div>

          <div className="icon-wrap">
            <div className="icon-ring-2" />
            <div className="icon-ring" />
            <div className="icon-circle">
              {sucesso ? (
                <svg className="success-icon" width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5L19 7" stroke="#065F46" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="#6C47E8" strokeWidth="1.8" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#6C47E8" strokeWidth="1.8" strokeLinecap="round" />
                  <circle cx="12" cy="16" r="1.5" fill="#6C47E8" />
                </svg>
              )}
            </div>
          </div>

          <div className="card-title">
            {sucesso ? "Conta confirmada!" : "Verificar conta"}
          </div>
          <div className="card-sub">
            {sucesso
              ? "Redirecionando para o login..."
              : <>Enviamos um código para <span>{email || "seu email"}</span></>
            }
          </div>

          {erro && <div className="alert alert-err">{erro}</div>}
          {sucesso && (
            <div className="alert alert-ok">
              <p>{sucesso}</p>
              <p>Redirecionando para o login...</p>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" />
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || !!sucesso}
              />
            </div>

            <div>
              <div className="otp-label">Código de verificação (6 dígitos)</div>
              <div className="otp-row" onPaste={handlePaste}>
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    className={`otp-cell${d ? " filled" : ""}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleDigit(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    disabled={loading || !!sucesso}
                  />
                ))}
              </div>
            </div>

            <div className="resend-row">
              {countdown > 0 ? (
                <>Reenviar código em <strong style={{ color: "#6C47E8" }}>{countdown}s</strong></>
              ) : (
                <button type="button" className="resend-btn" onClick={handleResend} disabled={!!sucesso}>
                  Reenviar código
                </button>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !!sucesso || !isComplete}
            >
              {loading ? (
                <><div className="spinner" /> Confirmando...</>
              ) : (
                "Confirmar conta"
              )}
            </button>
          </form>

          <div className="back-link">
            <a onClick={() => router.push("/login")}>← Voltar para o login</a>
          </div>
        </div>
      </div>
    </>
  );
}