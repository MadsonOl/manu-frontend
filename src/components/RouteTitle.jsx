import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/*
 * Atualiza o titulo da aba (document.title) a cada navegacao. Sem isto o titulo
 * fica sempre "manu", dificultando a identificacao da pagina por leitores de
 * tela e na troca de abas (WCAG 2.4.2). Renderizado uma unica vez dentro do
 * Router; nao desenha nada.
 */
const titulosPorRota = {
  "/": "Abrir chamado",
  "/login": "Entrar",
  "/cadastro": "Criar conta",
  "/recuperar-senha": "Recuperar senha",
  "/sobre": "Sobre",
  "/dashboard": "Dashboard",
  "/chamados": "Chamados",
  "/ordens-servico": "Ordens de Servico",
  "/ordens-servico/nova": "Nova Ordem de Servico",
  "/relatorios": "Relatorios",
  "/empresas": "Empresas",
  "/profissionais": "Profissionais",
};

export default function RouteTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    const nome = titulosPorRota[pathname];
    document.title = nome ? `${nome} - manu` : "manu";
  }, [pathname]);

  return null;
}
