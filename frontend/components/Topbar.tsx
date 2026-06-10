// frontend/components/Topbar.tsx
"use client";

import { Calendar, Bell, LogOut } from "lucide-react";
import { logout } from "@/services/api";
import { useRouter } from "next/navigation";

interface TopbarProps {
  nome: string;
  email: string;
  notifications?: number;
}

export default function Topbar({ nome, email, notifications = 3 }: TopbarProps) {
  const router = useRouter();
  const primeiroNome = (nome: string) => nome?.split(" ")[0] ?? "";
  
  const dataHoje = () => {
    return new Date().toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <>
      <style jsx>{`
        .topbar {
          background: #FFFFFF;
          border-bottom: 1px solid #F5F5F7;
          height: 70px;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }

        .topbar-left {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .topbar-title {
          font-family: 'Sora', sans-serif;
          font-size: 18px;
          font-weight: 700;
          background: linear-gradient(135deg, #4F2EC0 0%, #6B46FF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .topbar-date {
          font-size: 12px;
          color: #9A99A5;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .notif-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1.5px solid #F5F5F7;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #9A99A5;
          position: relative;
          transition: all 0.2s;
          background: #FFFFFF;
        }

        .notif-btn:hover {
          border-color: #4F2EC0;
          color: #4F2EC0;
          transform: scale(1.05);
        }

        .notif-dot {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #FF4D4D;
          border: 2px solid #FFFFFF;
        }

        .user-info {
          text-align: right;
        }

        .user-name {
          font-size: 13px;
          font-weight: 600;
          color: #303030;
        }

        .user-email {
          font-size: 11px;
          color: #9A99A5;
        }

        .avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #4F2EC0, #6B46FF);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          color: #FFFFFF;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .avatar:hover {
          transform: scale(1.05);
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: 1.5px solid #F5F5F7;
          color: #9A99A5;
          cursor: pointer;
          font-size: 12px;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 10px;
          transition: all 0.18s;
        }

        .logout-btn:hover {
          border-color: #4F2EC0;
          color: #4F2EC0;
          background: #EDE8FF;
        }
      `}</style>

      <header className="topbar">
        <div className="topbar-left">
          <div className="topbar-title">Dashboard</div>
          <div className="topbar-date">
            <Calendar size={12} />
            {dataHoje()}
          </div>
        </div>
        <div className="topbar-right">
          <button className="notif-btn">
            <Bell size={18} />
            {notifications > 0 && <span className="notif-dot" />}
          </button>
          <div className="user-info">
            <div className="user-name">{nome || "Usuário"}</div>
            <div className="user-email">{email || "usuario@email.com"}</div>
          </div>
          <div className="avatar">
            {primeiroNome(nome || "U").charAt(0).toUpperCase()}
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={13} /> Sair
          </button>
        </div>
      </header>
    </>
  );
}