import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    if (window.confirm("Deseja realmente sair?")) {
      await logout();
      navigate("/");
    }
  }

  return (
    <header className="header">
      <Link to="/dashboard" className="header-logo">manu</Link>
      <button className="header-logout" onClick={handleLogout}>Sair</button>
    </header>
  );
}
