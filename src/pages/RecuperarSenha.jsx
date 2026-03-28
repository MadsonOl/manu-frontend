import { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMensagem("E-mail de recuperação enviado com sucesso! Verifique sua caixa de entrada.");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setErro("E-mail não cadastrado");
      } else {
        setErro("Erro ao enviar e-mail de recuperação. Tente novamente.");
      }
    }
  }

  return (
    <div className="page page-blue" style={{ justifyContent: "center" }}>
      <div className="card text-center">
        <h1 style={{ fontSize: 36, color: "#4A90D9", marginBottom: 8 }}>manu</h1>
        <p style={{ color: "#888", marginBottom: 24 }}>Recuperar senha</p>
        {erro && <p className="error-msg">{erro}</p>}
        {mensagem && <p className="success-msg">{mensagem}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>E-mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
            Enviar código de recuperação
          </button>
        </form>
        <div className="mt-12">
          <Link to="/login" className="link">Voltar para login</Link>
        </div>
      </div>
    </div>
  );
}
