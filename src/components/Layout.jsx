import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Menu } from "lucide-react";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile hamburger */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="mobile-menu-btn"
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 100,
          background: "var(--surface-2)",
          border: "1px solid var(--border)",
          padding: 8,
          borderRadius: "var(--radius-sm)",
          cursor: "pointer",
          color: "var(--text-1)",
          display: "none",
        }}
      >
        <Menu size={20} />
      </button>

      <div className="content-area" style={{
        marginLeft: 240,
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
      }}>
        <Header variant="private" />
        <main style={{ flex: 1, padding: 32 }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .content-area {
            margin-left: 0 !important;
          }
          .content-area > main {
            padding: 16px !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
