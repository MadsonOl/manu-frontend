import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    try {
      await login(email, senha);
      navigate("/dashboard");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setErro("E-mail não cadastrado");
      } else if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setErro("Senha incorreta");
      } else {
        setErro("Erro ao fazer login. Tente novamente.");
      }
    }
  }

  return (
    <div className="page page-blue" style={{ justifyContent: "center" }}>
      <div className="card text-center">
        <h1 style={{ fontSize: 36, color: "#4A90D9", marginBottom: 8 }}>manu</h1>
        <p style={{ color: "#888", marginBottom: 24 }}>Acesse sua conta</p>
        {erro && <p className="error-msg">{erro}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>E-mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Senha</label>
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>Entrar</button>
        </form>
        <div className="mt-12">
          <Link to="/recuperar-senha" className="link">Recuperar senha</Link>
        </div>
        <div className="mt-12">
          <Link to="/cadastro" className="link">Criar conta</Link>
        </div>
      </div>
    </div>
  );
}
