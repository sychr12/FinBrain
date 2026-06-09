"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#FFFFFF'
      }}>
        <div className="spinner"></div>
        <style>{`
          .spinner {
            width: 50px;
            height: 50px;
            border: 3px solid #F5F5F5;
            border-top-color: #6C47E8;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .dashboard-root {
          min-height: 100vh;
          background: linear-gradient(135deg, #FFFFFF 0%, #F8F9FF 100%);
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Animações */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes floatDelay {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }

        @keyframes rotateBlob {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.2); }
          100% { transform: rotate(360deg) scale(1); }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Blobs de fundo */
        .bg-blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(80px);
        }
        .bg-blob-1 {
          width: 600px;
          height: 600px;
          top: -200px;
          right: -150px;
          background: radial-gradient(circle, rgba(108,71,232,0.12) 0%, transparent 70%);
          animation: rotateBlob 25s ease-in-out infinite;
        }
        .bg-blob-2 {
          width: 500px;
          height: 500px;
          bottom: -150px;
          left: -120px;
          background: radial-gradient(circle, rgba(155,126,255,0.1) 0%, transparent 70%);
          animation: rotateBlob 18s ease-in-out infinite reverse;
        }
        .bg-blob-3 {
          width: 300px;
          height: 300px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(108,71,232,0.08) 0%, transparent 70%);
          animation: pulse 4s ease-in-out infinite;
        }

        /* Header */
        .header {
          background: #FFFFFF;
          border-bottom: 1px solid #E0E0E0;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 10;
          animation: fadeIn 0.5s ease;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: transform 0.3s;
        }
        .logo:hover {
          transform: scale(1.05);
        }
        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #6C47E8, #9B7EFF);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .logo-name {
          font-family: 'Sora', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #1a1a2e;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          padding: 8px 16px;
          border-radius: 10px;
          transition: all 0.3s;
        }
        .logout-btn:hover {
          background: #F5F5F5;
          color: #6C47E8;
        }

        /* Main Content */
        .main-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 73px);
          padding: 3rem 2rem;
          position: relative;
          z-index: 5;
        }

        .content-card {
          max-width: 700px;
          text-align: center;
          animation: slideUp 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        /* Ilustração animada */
        .illustration {
          margin-bottom: 2rem;
          position: relative;
          display: inline-block;
        }

        .gear-icon {
          font-size: 80px;
          display: inline-block;
          animation: float 3s ease-in-out infinite;
        }

        .gear-icon-small {
          position: absolute;
          font-size: 40px;
          bottom: -20px;
          right: -30px;
          animation: floatDelay 2.5s ease-in-out infinite;
        }

        .construction-icon {
          position: absolute;
          font-size: 35px;
          top: -25px;
          left: -30px;
          animation: floatDelay 3.5s ease-in-out infinite;
        }

        .title {
          font-family: 'Sora', sans-serif;
          font-size: 48px;
          font-weight: 800;
          background: linear-gradient(135deg, #1a1a2e, #6C47E8);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          margin-bottom: 1rem;
        }

        .subtitle {
          font-size: 18px;
          color: #666;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .divider {
          width: 80px;
          height: 4px;
          background: linear-gradient(135deg, #6C47E8, #9B7EFF);
          border-radius: 2px;
          margin: 1.5rem auto;
        }

        .features {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin: 2rem 0;
          flex-wrap: wrap;
        }

        .feature-item {
          background: #FFFFFF;
          border: 1px solid #E0E0E0;
          border-radius: 16px;
          padding: 1rem 1.5rem;
          width: 180px;
          transition: all 0.3s;
        }
        .feature-item:hover {
          transform: translateY(-5px);
          border-color: #6C47E8;
          box-shadow: 0 10px 25px rgba(108,71,232,0.1);
        }

        .feature-icon {
          font-size: 32px;
          margin-bottom: 8px;
        }
        .feature-text {
          font-size: 13px;
          color: #666;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #F5F5F5;
          padding: 8px 20px;
          border-radius: 40px;
          margin-top: 1.5rem;
        }
        .status-dot {
          width: 8px;
          height: 8px;
          background: #6C47E8;
          border-radius: 50%;
          animation: pulse 1.5s ease-in-out infinite;
        }
        .status-text {
          font-size: 13px;
          color: #666;
        }

        /* Responsive */
        @media (max-width: 600px) {
          .title { font-size: 32px; }
          .subtitle { font-size: 16px; }
          .features { gap: 1rem; }
          .feature-item { width: 150px; padding: 0.8rem 1rem; }
          .header { padding: 0.8rem 1rem; }
          .logo-name { font-size: 16px; }
        }
      `}</style>

      <div className="dashboard-root">
        {/* Blobs de fundo */}
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-2" />
        <div className="bg-blob bg-blob-3" />

        {/* Header */}
        <div className="header">
          <div className="logo" onClick={() => router.push("/dashboard")}>
            <div className="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2 L12 7 M12 17 L12 22 M4 4 L7 7 M17 17 L20 20 M4 20 L7 17 M17 7 L20 4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="2"/>
              </svg>
            </div>
            <span className="logo-name">FinBrain</span>
          </div>
          <button className="logout-btn" onClick={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sair
          </button>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="content-card">
            <div className="illustration">
              <span className="gear-icon">⚙️</span>
              <span className="gear-icon-small">🔧</span>
              <span className="construction-icon">🚧</span>
            </div>

            <h1 className="title">Em Desenvolvimento</h1>
            <p className="subtitle">
              Estamos trabalhando duro para trazer a melhor experiência<br />
              para você. Esta página será liberada em breve!
            </p>

            <div className="divider"></div>

            <div className="features">
              <div className="feature-item">
                <div className="feature-icon">📊</div>
                <div className="feature-text">Dashboard Financeiro</div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🤖</div>
                <div className="feature-text">IA para Análises</div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">💡</div>
                <div className="feature-text">Dicas Personalizadas</div>
              </div>
            </div>

            <div className="status-badge">
              <div className="status-dot"></div>
              <span className="status-text">Status: Desenvolvimento ativo</span>
            </div>

            <p style={{ fontSize: '12px', color: '#999', marginTop: '2rem' }}>
              Previsão de lançamento: Em breve 🚀
            </p>
          </div>
        </div>
      </div>
    </>
  );
}