import { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { Lightbulb, Mail, Send, MailCheck, ArrowLeft, Loader2 } from "lucide-react";

const dotPattern = `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='white' opacity='0.03'/%3E%3C/svg%3E")`;

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMensagem("E-mail enviado! Verifique sua caixa de entrada.");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setErro("E-mail não cadastrado");
      } else {
        setErro("Erro ao enviar e-mail de recuperação. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
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
          Recuperar senha
        </h1>
        <p style={{ fontSize: "var(--fs-14)", color: "var(--text-2)", marginBottom: 24, lineHeight: 1.5 }}>
          Informe seu e-mail e enviaremos as instruções de recuperação
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

        {mensagem && (
          <div style={{
            background: "var(--finalizado-bg)",
            border: "1px solid color-mix(in srgb, var(--finalizado) 30%, transparent)",
            borderRadius: "var(--radius-md)",
            padding: "14px",
            fontSize: "var(--fs-13)",
            color: "var(--finalizado)",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}>
            <MailCheck size={18} />
            {mensagem}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{
              fontSize: "var(--fs-12)", fontWeight: 500, color: "var(--text-2)",
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
                  fontSize: "var(--fs-14)",
                  fontFamily: "var(--font-sans)",
                  outline: "none",
                  transition: "var(--transition)",
                }}
                onFocus={(e) => { e.target.style.borderColor = "var(--primary)"; e.target.style.boxShadow = "0 0 0 3px var(--primary-ring)"; }}
                onBlur={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
              />
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
            {loading ? <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> : <Send size={15} />}
            Enviar instruções
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Link to="/login" style={{
            fontSize: "var(--fs-13)", color: "var(--text-2)", textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: 4,
          }}>
            <ArrowLeft size={12} />
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  );
}
