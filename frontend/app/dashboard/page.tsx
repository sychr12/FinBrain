"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  Bot,
  AlertTriangle,
  PieChart,
  Coffee,
  Car,
  Tv,
  ShoppingBag,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import {
  getPerfil,
  getDashboardResumo,
} from "@/services/api";

interface Perfil {
  id: number;
  nome: string;
  email: string;
}

interface Resumo {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  totalTransacoes: number;
  totalCartoes: number;
}

const GASTOS_DATA = [
  { categoria: "Alimentação", valor: 980.3, cor: "#4F2EC0", icone: Coffee },
  { categoria: "Transporte", valor: 430.3, cor: "#6B46FF", icone: Car },
  { categoria: "Assinaturas", valor: 310.0, cor: "#EDE8FF", icone: Tv },
  { categoria: "Outros", valor: 988.3, cor: "#9A99A5", icone: ShoppingBag },
];

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [resumo, setResumo] = useState<Resumo | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    async function carregar() {
      try {
        const [p, r] = await Promise.all([
          getPerfil(),
          getDashboardResumo(),
        ]);
        setPerfil(p);
        setResumo(r);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [router]);

  const fmt = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  const fmtData = (d: string) => new Date(d).toLocaleDateString("pt-BR");
  const primeiroNome = (nome: string) => nome?.split(" ")[0] ?? "";

  const totalGastos = GASTOS_DATA.reduce((s, item) => s + item.valor, 0);
  const pctUsado = 80;
  const saldoPos = (resumo?.saldo ?? 0) >= 0;

  const transacoesRecentes = [
    { id: 1, descricao: "Supermercado Extra", valor: 350.9, tipo: "DESPESA", categoria: "Alimentação", data: "2024-01-15" },
    { id: 2, descricao: "Uber", valor: 45.5, tipo: "DESPESA", categoria: "Transporte", data: "2024-01-14" },
    { id: 3, descricao: "Netflix", valor: 39.9, tipo: "DESPESA", categoria: "Assinaturas", data: "2024-01-14" },
    { id: 4, descricao: "Ifood", valor: 67.8, tipo: "DESPESA", categoria: "Alimentação", data: "2024-01-13" },
  ];

  if (loading) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#F5F5F7",
        gap: 14,
      }}>
        <div style={{
          width: 48,
          height: 48,
          border: "3px solid #EDE8FF",
          borderTopColor: "#4F2EC0",
          borderRadius: "50%",
          animation: "spin 0.75s linear infinite",
        }} />
        <span style={{ fontSize: 13, color: "#9A99A5" }}>Carregando seus dados...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const buildDonutPath = (startAngle: number, endAngle: number) => {
    const radius = 70;
    const center = 90;
    const start = (startAngle * Math.PI) / 180;
    const end = (endAngle * Math.PI) / 180;
    const x1 = center + radius * Math.cos(start);
    const y1 = center + radius * Math.sin(start);
    const x2 = center + radius * Math.cos(end);
    const y2 = center + radius * Math.sin(end);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  let currentAngle = -90;
  const donutSegments = GASTOS_DATA.map((item) => {
    const percent = (item.valor / totalGastos) * 100;
    const angle = (percent / 100) * 360;
    const start = currentAngle;
    const end = currentAngle + angle;
    currentAngle = end;
    return { ...item, percent, path: buildDonutPath(start, end) };
  });

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Sora:wght@600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .app-container {
          display: flex;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          background: #F5F5F7;
        }

        .main-wrapper {
          flex: 1;
          margin-left: 64px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: margin-left 0.24s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Scrollable Content */
        .scrollable-content {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem 2rem;
        }

        .greeting {
          font-family: 'Sora', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #303030;
          margin-bottom: 4px;
        }

        .greeting span {
          color: #4F2EC0;
        }

        .greeting-sub {
          font-size: 13px;
          color: #9A99A5;
          margin-bottom: 1.5rem;
        }

        /* Metrics */
        .metrics {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 1.5rem;
        }

        @media (max-width: 1024px) {
          .metrics { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .metrics { grid-template-columns: 1fr; }
        }

        .metric-card {
          background: #FFFFFF;
          border-radius: 16px;
          border: 1px solid #F5F5F7;
          padding: 1rem 1.25rem;
          transition: all 0.3s;
        }
        .metric-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(79, 46, 192, 0.08);
        }
        .metric-card.highlight {
          background: linear-gradient(135deg, #4F2EC0, #6B46FF);
        }

        .metric-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .metric-label {
          font-size: 11px;
          font-weight: 600;
          color: #9A99A5;
          text-transform: uppercase;
        }
        .metric-label.light { color: rgba(255, 255, 255, 0.7); }
        .metric-icon {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .metric-value {
          font-family: 'Sora', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #303030;
          margin-bottom: 8px;
        }
        .metric-value.light { color: #FFFFFF; }
        .metric-value.green { color: #16A97A; }
        .metric-value.red { color: #E05C38; }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 9px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 20px;
        }
        .badge.positive { background: #E4F7F0; color: #16A97A; }
        .badge.negative { background: #FDEEE9; color: #E05C38; }
        .badge.light { background: rgba(255,255,255,0.18); color: rgba(255,255,255,0.9); }

        /* IA Card */
        .ia-card {
          background: linear-gradient(135deg, #EDE8FF 0%, #F5F5FF 100%);
          border: 1px solid #D8D0FF;
          border-radius: 16px;
          padding: 1rem 1.25rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .ia-icon {
          width: 44px;
          height: 44px;
          min-width: 44px;
          background: linear-gradient(135deg, #4F2EC0, #6B46FF);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ia-title {
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #303030;
          margin-bottom: 4px;
        }
        .ia-text {
          font-size: 12px;
          color: #6B6B7A;
        }
        .ia-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 600;
          color: #4F2EC0;
          cursor: pointer;
          margin-top: 4px;
        }

        /* Two Columns */
        .two-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        @media (max-width: 900px) {
          .two-columns { grid-template-columns: 1fr; }
        }

        .full-card {
          background: #FFFFFF;
          border-radius: 20px;
          border: 1px solid #F5F5F7;
          padding: 1.25rem;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
        }
        .full-card:hover {
          box-shadow: 0 8px 24px rgba(79, 46, 192, 0.08);
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #F5F5F7;
        }
        .card-title {
          font-family: 'Sora', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #303030;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .card-title-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #EDE8FF;
        }
        .card-link {
          font-size: 11px;
          font-weight: 600;
          color: #4F2EC0;
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          padding: 4px 10px;
          border-radius: 16px;
          background: #EDE8FF;
        }

        /* Donut */
        .donut-legend-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .donut-wrapper { position: relative; }
        .donut-center-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }
        .donut-total { font-size: 18px; font-weight: 800; color: #4F2EC0; }
        .legend-grid {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 8px;
          border-radius: 8px;
        }
        .legend-dot { width: 10px; height: 10px; border-radius: 50%; }
        .legend-category { font-size: 11px; font-weight: 600; color: #303030; flex: 1; }
        .legend-value { font-size: 11px; font-weight: 700; color: #4F2EC0; }

        /* Expense List */
        .expense-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .expense-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border-radius: 10px;
          background: #F8F7FF;
          transition: all 0.2s;
        }
        .expense-item:hover {
          transform: translateX(4px);
          background: #EDE8FF;
        }
        .expense-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .expense-details { flex: 1; }
        .expense-category { font-size: 12px; font-weight: 700; color: #303030; }
        .progress-bar {
          margin-top: 4px;
          background: #E8E6F5;
          border-radius: 8px;
          height: 3px;
          overflow: hidden;
        }
        .progress-fill {
          height: 3px;
          border-radius: 8px;
          transition: width 0.6s ease;
        }
        .expense-value { font-size: 13px; font-weight: 700; color: #4F2EC0; }

        /* Critical */
        .critical-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .critical-alert {
          background: linear-gradient(135deg, #FFEBEE, #FFE0E0);
          border: 1px solid #FFCDD2;
          border-radius: 14px;
          padding: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .critical-alert-icon {
          width: 42px;
          height: 42px;
          border-radius: 21px;
          background: #FF4D4D;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }
        .critical-alert-title { font-size: 13px; font-weight: 800; color: #C62828; }
        .critical-alert-message { font-size: 10px; color: #D32F2F; }

        .donut-container-large {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
          padding: 12px;
          background: #F8F7FF;
          border-radius: 16px;
        }

        .stats-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .stat-card {
          background: #F8F7FF;
          border-radius: 12px;
          padding: 12px;
          text-align: center;
        }
        .stat-value { font-size: 22px; font-weight: 800; color: #4F2EC0; }
        .stat-label { font-size: 10px; color: #9A99A5; }

        .transaction-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .transaction-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px;
          border-radius: 10px;
          transition: background 0.14s;
        }
        .transaction-item:hover { background: #F8F7FF; }
        .transaction-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .transaction-description { font-size: 11px; font-weight: 600; color: #303030; }
        .transaction-meta {
          font-size: 9px;
          color: #9A99A5;
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 2px;
        }
        .transaction-category {
          background: #EDE8FF;
          color: #4F2EC0;
          padding: 1px 5px;
          border-radius: 10px;
          font-size: 8px;
        }
        .transaction-value { font-size: 11px; font-weight: 700; color: #E05C38; }
      `}</style>

      <div className="app-container">
        <Sidebar />
        <div className="main-wrapper">
          <Topbar nome={perfil?.nome || ""} email={perfil?.email || ""} />
          <div className="scrollable-content">
            <h1 className="greeting">Olá, <span>{primeiroNome(perfil?.nome ?? "Usuário")}</span> 👋</h1>
            <p className="greeting-sub">Aqui está o resumo das suas finanças</p>

            {/* Metrics */}
            <div className="metrics">
              <div className="metric-card highlight">
                <div className="metric-header">
                  <span className="metric-label light">Saldo atual</span>
                  <div className="metric-icon" style={{ background: "rgba(255,255,255,0.15)" }}>
                    <Wallet size={16} color="white" />
                  </div>
                </div>
                <div className="metric-value light">{fmt(resumo?.saldo ?? 4850.75)}</div>
                <div className="badge light">
                  {saldoPos ? <ArrowUpRight size={8} /> : <ArrowDownLeft size={8} />}
                  {saldoPos ? "Positivo" : "Negativo"}
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-label">Receitas</span>
                  <div className="metric-icon" style={{ background: "#E4F7F0" }}>
                    <TrendingUp size={16} color="#16A97A" />
                  </div>
                </div>
                <div className="metric-value green">{fmt(resumo?.totalReceitas ?? 5240)}</div>
                <div className="badge positive"><ArrowUpRight size={8} /> Entradas</div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-label">Despesas</span>
                  <div className="metric-icon" style={{ background: "#FDEEE9" }}>
                    <TrendingDown size={16} color="#E05C38" />
                  </div>
                </div>
                <div className="metric-value red">{fmt(resumo?.totalDespesas ?? 2780.50)}</div>
                <div className="badge negative"><ArrowDownLeft size={8} /> Saídas</div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-label">Transações</span>
                  <div className="metric-icon" style={{ background: "#EDE8FF" }}>
                    <ArrowRightLeft size={16} color="#4F2EC0" />
                  </div>
                </div>
                <div className="metric-value">{resumo?.totalTransacoes ?? 24}</div>
                <span style={{ fontSize: 10, color: "#9A99A5" }}>Este mês</span>
              </div>
            </div>

            {/* IA Card */}
            <div className="ia-card">
              <div className="ia-icon"><Bot size={22} color="#FFFFFF" /></div>
              <div style={{ flex: 1 }}>
                <div className="ia-title">🤖 IA - Insight do dia</div>
                <div className="ia-text">
                  Sua maior despesa é em <strong>Outros (R$ 988,30)</strong> e <strong>Alimentação (R$ 980,30)</strong>
                </div>
                <span className="ia-link">Ver análise <ChevronRight size={12} /></span>
              </div>
            </div>

            {/* Two Columns */}
            <div className="two-columns">
              {/* Resumo de Gastos */}
              <div className="full-card">
                <div className="card-header">
                  <div className="card-title">
                    <div className="card-title-icon"><PieChart size={16} color="#4F2EC0" /></div>
                    Resumo de Gastos
                  </div>
                  <span className="card-link">Detalhes <ChevronRight size={12} /></span>
                </div>

                <div className="donut-legend-container">
                  <div className="donut-wrapper">
                    <svg width="150" height="150" viewBox="0 0 180 180">
                      <circle cx="90" cy="90" r="70" fill="none" stroke="#F5F5F7" strokeWidth="18" />
                      {donutSegments.map((segment, idx) => (
                        <path key={idx} d={segment.path} fill="none" stroke={segment.cor} strokeWidth="18" strokeLinecap="round" />
                      ))}
                    </svg>
                    <div className="donut-center-text">
                      <div className="donut-total">{fmt(totalGastos)}</div>
                      <div style={{ fontSize: 9, color: "#9A99A5" }}>Total</div>
                    </div>
                  </div>
                  <div className="legend-grid">
                    {donutSegments.map((segment, idx) => (
                      <div className="legend-item" key={idx}>
                        <span className="legend-dot" style={{ background: segment.cor }} />
                        <span className="legend-category">{segment.categoria}</span>
                        <span className="legend-value">{fmt(segment.valor)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="expense-list">
                  {GASTOS_DATA.map((item, index) => {
                    const percent = (item.valor / totalGastos) * 100;
                    const Icon = item.icone;
                    return (
                      <div className="expense-item" key={index}>
                        <div className="expense-icon" style={{ background: `${item.cor}15` }}>
                          <Icon size={16} color={item.cor} />
                        </div>
                        <div className="expense-details">
                          <div className="expense-category">{item.categoria}</div>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${percent}%`, background: item.cor }} />
                          </div>
                        </div>
                        <div className="expense-value">{fmt(item.valor)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Gasto Crítico */}
              <div className="full-card">
                <div className="card-header">
                  <div className="card-title">
                    <div className="card-title-icon"><AlertTriangle size={16} color="#E05C38" /></div>
                    Gasto Crítico
                  </div>
                  <span className="card-link">Ajustar <ChevronRight size={12} /></span>
                </div>

                <div className="critical-content">
                  <div className="critical-alert">
                    <div className="critical-alert-icon"><AlertTriangle size={22} color="#FFFFFF" /></div>
                    <div>
                      <div className="critical-alert-title">{pctUsado}% do limite utilizado!</div>
                      <div className="critical-alert-message">Evite novas compras até o fechamento</div>
                    </div>
                  </div>

                  <div className="donut-container-large">
                    <svg width="100" height="100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#F5F5F7" strokeWidth="12" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#FF4D4D" strokeWidth="12" strokeDasharray={`${(pctUsado / 100) * 251.3} 251.3`} strokeLinecap="round" transform="rotate(-90 50 50)" />
                      <text x="50" y="48" textAnchor="middle" fontSize="16" fontWeight="800" fill="#C62828">{pctUsado}%</text>
                      <text x="50" y="62" textAnchor="middle" fontSize="8" fill="#9A99A5">usado</text>
                    </svg>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF4D4D" }} />
                        <span style={{ fontSize: 11, fontWeight: 600, flex: 1 }}>Utilizado</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#4F2EC0" }}>{pctUsado}%</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#E8E6F5" }} />
                        <span style={{ fontSize: 11, fontWeight: 600, flex: 1 }}>Disponível</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#4F2EC0" }}>{100 - pctUsado}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="stats-row">
                    <div className="stat-card"><div className="stat-value">R$ 1.240</div><div className="stat-label">Limite restante</div></div>
                    <div className="stat-card"><div className="stat-value">10 dias</div><div className="stat-label">Para fechamento</div></div>
                  </div>

                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#9A99A5", marginBottom: 6 }}>Últimos Gastos</div>
                    <div className="transaction-list">
                      {transacoesRecentes.slice(0, 3).map((t) => (
                        <div className="transaction-item" key={t.id}>
                          <div className="transaction-icon" style={{ background: "#FDEEE9" }}>
                            <ArrowDownLeft size={12} color="#E05C38" />
                          </div>
                          <div className="transaction-details">
                            <div className="transaction-description">{t.descricao}</div>
                            <div className="transaction-meta">
                              {fmtData(t.data)}
                              <span className="transaction-category">{t.categoria}</span>
                            </div>
                          </div>
                          <div className="transaction-value">-{fmt(t.valor)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}