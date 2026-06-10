"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  CreditCard,
  Receipt,
  ShoppingCart,
  Tag,
  Heart,
  Bell,
  Bot,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { logout } from "@/services/api";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: <LayoutDashboard size={18} />, href: "/dashboard" },
  { label: "Cartões", icon: <CreditCard size={18} />, href: "/cartoes" },
  { label: "Dívidas", icon: <Receipt size={18} />, href: "/dividas" },
  { label: "Gastos", icon: <ShoppingCart size={18} />, href: "/gastos" },
  { label: "Promoções", icon: <Tag size={18} />, href: "/promocoes" },
  { label: "Lista de Desejos", icon: <Heart size={18} />, href: "/lista-desejos" },
  { label: "Notificações", icon: <Bell size={18} />, href: "/notificacoes" },
  { label: "IA - Ajuda", icon: <Bot size={18} />, href: "/ia" },
  { label: "Perfil", icon: <User size={18} />, href: "/perfil" },
  { label: "Configurações", icon: <Settings size={18} />, href: "/configuracoes" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + "/");
  };

  return (
    <>
      <style jsx>{`
        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          width: 64px;
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
          padding: 20px 12px;
          z-index: 100;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
          border-right: 1px solid #F5F5F7;
        }

        .sidebar:hover {
          width: 260px;
        }

        .logo {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 12px;
          margin-bottom: 32px;
          cursor: pointer;
          border-radius: 12px;
          transition: all 0.2s;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: #EDE8FF;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .logo-icon :global(img) {
          width: 24px;
          height: 24px;
          object-fit: contain;
        }

        .logo:hover .logo-icon {
          transform: scale(1.05);
          background: #6B46FF;
        }

        .logo:hover .logo-icon :global(img) {
          filter: brightness(0) invert(1);
        }

        .logo-text {
          font-family: 'Sora', sans-serif;
          font-size: 20px;
          font-weight: 700;
          background: linear-gradient(135deg, #4F2EC0 0%, #6B46FF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          opacity: 0;
          transition: opacity 0.2s;
          white-space: nowrap;
          line-height: 1.2;
        }

        .sidebar:hover .logo-text {
          opacity: 1;
        }

        .nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 10px;
          cursor: pointer;
          color: #9A99A5;
          transition: all 0.2s;
          position: relative;
          white-space: nowrap;
          min-height: 42px;
        }

        .nav-item:hover {
          background: #EDE8FF;
          color: #4F2EC0;
        }

        .nav-item.active {
          background: #4F2EC0;
          color: #FFFFFF;
        }

        .nav-icon {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .nav-icon :global(svg) {
          width: 18px;
          height: 18px;
          stroke-width: 1.8;
        }

        .nav-label {
          font-size: 14px;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
          opacity: 0;
          transition: opacity 0.2s;
          line-height: 1.4;
        }

        .sidebar:hover .nav-label {
          opacity: 1;
        }

        .tooltip {
          position: absolute;
          left: calc(100% + 12px);
          top: 50%;
          transform: translateY(-50%);
          background: #4F2EC0;
          color: #FFFFFF;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          z-index: 200;
          line-height: 1.4;
        }

        .nav-item:hover .tooltip {
          opacity: 1;
        }

        .sidebar:hover .tooltip {
          display: none;
        }

        .divider {
          height: 1px;
          background: #F5F5F7;
          margin: 12px 8px;
          flex-shrink: 0;
        }

        .logout {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 10px;
          cursor: pointer;
          color: #9A99A5;
          transition: all 0.2s;
          position: relative;
          margin-top: auto;
          min-height: 42px;
        }

        .logout:hover {
          background: #FFEBEE;
          color: #E05C38;
        }

        .logout-label {
          font-size: 14px;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
          opacity: 0;
          transition: opacity 0.2s;
          line-height: 1.4;
        }

        .sidebar:hover .logout-label {
          opacity: 1;
        }

        .logout-tooltip {
          position: absolute;
          left: calc(100% + 12px);
          top: 50%;
          transform: translateY(-50%);
          background: #4F2EC0;
          color: #FFFFFF;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          line-height: 1.4;
        }

        .logout:hover .logout-tooltip {
          opacity: 1;
        }

        .sidebar:hover .logout-tooltip {
          display: none;
        }
      `}</style>

      <aside className="sidebar">
        <div className="logo" onClick={() => handleNavigate("/dashboard")}>
          <div className="logo-icon">
            <Image 
              src="/logosg/sacodecompra.png" 
              alt="PromoAi" 
              width={24} 
              height={24}
              priority
            />
          </div>
          <span className="logo-text">PromoAi</span>
        </div>

        <nav className="nav">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.href}
              className={`nav-item ${isActive(item.href) ? "active" : ""}`}
              onClick={() => handleNavigate(item.href)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              <span className="tooltip">{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="divider" />

        <div className="logout" onClick={handleLogout}>
          <span className="nav-icon">
            <LogOut size={18} />
          </span>
          <span className="logout-label">Sair</span>
          <span className="logout-tooltip">Sair</span>
        </div>
      </aside>
    </>
  );
}