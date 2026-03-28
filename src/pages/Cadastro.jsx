import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Cadastro() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    if (senha !== confirmar) {
      setErro("As senhas não coincidem");
      return;
    }

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
    }
  }

  return (
    <div className="page page-blue" style={{ justifyContent: "center" }}>
      <div className="card text-center">
        <h1 style={{ fontSize: 36, color: "#4A90D9", marginBottom: 8 }}>manu</h1>
        <p style={{ color: "#888", marginBottom: 24 }}>Crie sua conta</p>
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
          <div className="form-group">
            <label>Confirmar senha</label>
            <input type="password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>Cadastrar</button>
        </form>
        <div className="mt-12">
          <Link to="/login" className="link">Já tem conta? Entre</Link>
        </div>
      </div>
    </div>
  );
}
