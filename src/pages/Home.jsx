import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="page page-blue" style={{ justifyContent: "center", gap: 32 }}>
      <h1 style={{ fontSize: 64, fontWeight: 700, color: "#fff", margin: 0 }}>manu</h1>
      <p style={{ fontSize: 18, opacity: 0.9 }}>Plataforma de gestão de manutenções</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16, width: 260 }}>
        <Link to="/login"><button className="btn btn-white btn-large">Entre</button></Link>
        <Link to="/cadastro"><button className="btn btn-outline btn-large">Cadastre-se</button></Link>
        <Link to="/sobre"><button className="btn btn-outline btn-large">Conheça o manu</button></Link>
      </div>
    </div>
  );
}
