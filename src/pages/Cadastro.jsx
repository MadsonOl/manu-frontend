import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Lightbulb, Mail, Lock, UserPlus, CheckCircle, X, Loader2 } from "lucide-react";

const dotPattern = `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='white' opacity='0.03'/%3E%3C/svg%3E")`;

function getPasswordStrength(senha) {
  let score = 0;
  if (senha.length >= 6) score++;
  if (senha.length >= 8) score++;
  if (/[A-Z]/.test(senha) && /[a-z]/.test(senha)) score++;
  if (/[0-9]/.test(senha) || /[^A-Za-z0-9]/.test(senha)) score++;
  return score;
}

const strengthColors = ["var(--alta)", "var(--alta)", "var(--normal)", "var(--baixa)", "var(--baixa)"];

const inputStyle = {
  width: "100%",
  background: "var(--surface-2)",
  border: "1px solid var(--border)",
  color: "var(--text-1)",
  padding: "9px 12px 9px 36px",
  borderRadius: "var(--radius-md)",
  fontSize: "var(--fs-14)",
  fontFamily: "var(--font-sans)",
  outline: "none",
  transition: "var(--transition)",
};

const labelStyle = {
  fontSize: "var(--fs-12)", fontWeight: 500, color: "var(--text-2)",
  textTransform: "uppercase", letterSpacing: "0.06em",
  marginBottom: 6, display: "block",
};

export default function Cadastro() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const strength = getPasswordStrength(senha);
  const senhasMatch = confirmar.length > 0 && senha === confirmar;
  const senhasMismatch = confirmar.length > 0 && senha !== confirmar;

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    if (senha !== confirmar) {
      setErro("As senhas não coincidem");
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      navigate("/login");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setErro("Este e-mail já está cadastrado");
      } else if (err.code === "auth/weak-password") {
        setErro("A senha deve ter pelo menos 6 caracteres");
      } else {
        setErro("Erro ao cadastrar. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleFocus(e) {
    e.target.style.borderColor = "var(--primary)";
    e.target.style.boxShadow = "0 0 0 3px var(--primary-ring)";
  }
  function handleBlur(e) {
    e.target.style.borderColor = "var(--border)";
    e.target.style.boxShadow = "none";
  }

  return (
    <div style={{
      minHeight: "calc(100vh - 56px)",
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
        padding: "clamp(24px, 6vw, 40px)",
        maxWidth: 420,
        width: "100%",
        boxShadow: "var(--shadow-lg)",
        animation: "fadeIn 0.3s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
          <Lightbulb size={16} style={{ color: "var(--primary)" }} />
          <span style={{ fontWeight: 700, fontSize: "var(--fs-20)", color: "var(--primary)" }}>manu</span>
        </div>

        <h1 style={{ fontSize: "var(--fs-20)", fontWeight: 600, color: "var(--text-1)", marginBottom: 4 }}>
          Criar conta de gestor
        </h1>
        <p style={{ fontSize: "var(--fs-14)", color: "var(--text-2)", marginBottom: 24 }}>
          Cadastre-se para gerenciar manutenções
        </p>

        {erro && (
          <div style={{
            background: "var(--alta-bg)",
            border: "1px solid color-mix(in srgb, var(--alta) 30%, transparent)",
            borderRadius: "var(--radius-md)",
            padding: "10px 14px",
            fontSize: "var(--fs-13)",
            color: "var(--alta)",
            marginBottom: 16,
          }}>
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>E-mail</label>
            <div style={{ position: "relative" }}>
              <Mail size={14} style={{
                position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                color: "var(--text-3)",
              }} />
              <input
                type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                required placeholder="seu@email.com"
                style={inputStyle}
                onFocus={handleFocus} onBlur={handleBlur}
              />
              {email.length > 0 && email.includes("@") && (
                <CheckCircle size={14} style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  color: "var(--baixa)",
                }} />
              )}
            </div>
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={labelStyle}>Senha</label>
            <div style={{ position: "relative" }}>
              <Lock size={14} style={{
                position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                color: "var(--text-3)",
              }} />
              <input
                type="password" value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required placeholder="••••••••"
                style={inputStyle}
                onFocus={handleFocus} onBlur={handleBlur}
              />
            </div>
            {/* Strength bar */}
            {senha.length > 0 && (
              <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} style={{
                    flex: 1,
                    height: 3,
                    borderRadius: 2,
                    background: i < strength ? strengthColors[strength] : "var(--surface-3)",
                    transition: "var(--transition)",
                  }} />
                ))}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Confirmar senha</label>
            <div style={{ position: "relative" }}>
              <Lock size={14} style={{
                position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                color: "var(--text-3)",
              }} />
              <input
                type="password" value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                required placeholder="••••••••"
                style={inputStyle}
                onFocus={handleFocus} onBlur={handleBlur}
              />
              {senhasMatch && (
                <CheckCircle size={14} style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  color: "var(--baixa)",
                }} />
              )}
              {senhasMismatch && (
                <X size={14} style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  color: "var(--alta)",
                }} />
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: "var(--primary-strong)",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "var(--radius-md)",
              fontSize: "var(--fs-13)",
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
            {loading ? <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> : <UserPlus size={15} />}
            Criar conta
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Link to="/login" style={{
            fontSize: "var(--fs-13)", color: "var(--text-2)", textDecoration: "none",
          }}>
            Já tenho conta
          </Link>
        </div>
      </div>
    </div>
  );
}
