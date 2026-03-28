import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Wrench, Mail, Lock, LogIn, Loader2 } from "lucide-react";

const dotPattern = `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='white' opacity='0.03'/%3E%3C/svg%3E")`;

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setLoading(true);
    try {
      await login(email, senha);
      navigate("/dashboard");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setErro("E-mail nao cadastrado");
      } else if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setErro("Senha incorreta");
      } else {
        setErro("Erro ao fazer login. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      backgroundImage: dotPattern,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    }}>
      <div style={{
        background: "var(--surface-1)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        padding: 40,
        maxWidth: 420,
        width: "100%",
        boxShadow: "var(--shadow-lg)",
        animation: "fadeIn 0.3s ease",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
          <Wrench size={16} style={{ color: "var(--primary)" }} />
          <span style={{ fontWeight: 700, fontSize: 20, color: "var(--primary)" }}>manu</span>
        </div>

        <h1 style={{ fontSize: 20, fontWeight: 600, color: "var(--text-1)", marginBottom: 4 }}>
          Entrar na sua conta
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-2)", marginBottom: 24 }}>
          Acesso exclusivo para gestores
        </p>

        {erro && (
          <div style={{
            background: "var(--alta-bg)",
            border: "1px solid rgba(248,113,113,0.2)",
            borderRadius: "var(--radius-md)",
            padding: "10px 14px",
            fontSize: 13,
            color: "var(--alta)",
            marginBottom: 16,
          }}>
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{
              fontSize: 12, fontWeight: 500, color: "var(--text-2)",
              textTransform: "uppercase", letterSpacing: "0.06em",
              marginBottom: 6, display: "block",
            }}>E-mail</label>
            <div style={{ position: "relative" }}>
              <Mail size={14} style={{
                position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                color: "var(--text-3)",
              }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
                style={{
                  width: "100%",
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  color: "var(--text-1)",
                  padding: "9px 12px 9px 36px",
                  borderRadius: "var(--radius-md)",
                  fontSize: 14,
                  fontFamily: "var(--font-sans)",
                  outline: "none",
                  transition: "var(--transition)",
                }}
                onFocus={(e) => { e.target.style.borderColor = "var(--primary)"; e.target.style.boxShadow = "0 0 0 3px var(--primary-ring)"; }}
                onBlur={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{
              fontSize: 12, fontWeight: 500, color: "var(--text-2)",
              textTransform: "uppercase", letterSpacing: "0.06em",
              marginBottom: 6, display: "block",
            }}>Senha</label>
            <div style={{ position: "relative" }}>
              <Lock size={14} style={{
                position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                color: "var(--text-3)",
              }} />
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: "100%",
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  color: "var(--text-1)",
                  padding: "9px 12px 9px 36px",
                  borderRadius: "var(--radius-md)",
                  fontSize: 14,
                  fontFamily: "var(--font-sans)",
                  outline: "none",
                  transition: "var(--transition)",
                }}
                onFocus={(e) => { e.target.style.borderColor = "var(--primary)"; e.target.style.boxShadow = "0 0 0 3px var(--primary-ring)"; }}
                onBlur={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
              />
            </div>
          </div>

          <div style={{ textAlign: "right", marginBottom: 20 }}>
            <Link to="/recuperar-senha" style={{
              fontSize: 12, color: "var(--text-2)", textDecoration: "none",
            }}>
              Esqueceu a senha?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: "var(--primary)",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "var(--radius-md)",
              fontSize: 13,
              fontWeight: 500,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "var(--transition)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> : <LogIn size={15} />}
            Entrar
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          margin: "20px 0",
        }}>
          <div style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
          <span style={{ fontSize: 12, color: "var(--text-3)" }}>ou</span>
          <div style={{ flex: 1, height: 1, background: "var(--border-subtle)" }} />
        </div>

        <div style={{ textAlign: "center" }}>
          <Link to="/cadastro" style={{
            fontSize: 13, color: "var(--text-2)", textDecoration: "none",
          }}>
            Criar uma conta
          </Link>
        </div>
      </div>
    </div>
  );
}
